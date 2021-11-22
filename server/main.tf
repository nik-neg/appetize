terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.48.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "appetize"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id

  acl           = "private"
  force_destroy = true
}

### package and copy lambda func to bucket
data "archive_file" "lambda_api" {
  type = "zip"

  source_dir  = "${path.module}/api"
  output_path = "${path.module}/api.zip"
}

resource "aws_s3_bucket_object" "lambda_api" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "api.zip"
  source = data.archive_file.lambda_api.output_path

  etag = filemd5(data.archive_file.lambda_api.output_path)
}

### define lamda func and resources
resource "aws_lambda_function" "register_user" {
  function_name = "RegisterUser"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_bucket_object.lambda_api.key

  runtime = "nodejs14.x"
  handler = "./user/register/user.register"

  source_code_hash = data.archive_file.lambda_api.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "login_user" {
  function_name = "LoginUser"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_bucket_object.lambda_api.key

  runtime = "nodejs14.x"
  handler = "./user/login/user.login"

  source_code_hash = data.archive_file.lambda_api.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

### defines a log group to store log messages from your Lambda function for 30 days.
resource "aws_cloudwatch_log_group" "register_user" {
  name = "/aws/lambda/${aws_lambda_function.register_user.function_name}"

  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "login_user" {
  name = "/aws/lambda/${aws_lambda_function.login_user.function_name}"

  retention_in_days = 30
}

### defines an IAM role that allows Lambda to access resources in your AWS account.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

### configure API Gateway
## defines a name for the API Gateway and sets its protocol to HTTP
resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"
}

## sets up application stages for the API Gateway - such as "Test", "Staging", and "Production".
## The example configuration defines a single stage, with access logging enabled.
resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "serverless_lambda_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

## configures the API Gateway to use your Lambda function
resource "aws_apigatewayv2_integration" "register_user" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.register_user.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "login_user" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.login_user.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

## maps an HTTP request to a target, in this case your Lambda function.
## In the example configuration, the route_key matches any GET request matching the path /hello.
## A target matching integrations/<ID> maps to a Lambda integration with the given ID.
resource "aws_apigatewayv2_route" "register_user" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "POST /register"
  target    = "integrations/${aws_apigatewayv2_integration.register_user.id}"
}

resource "aws_apigatewayv2_route" "login_user" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "POST /login"
  target    = "integrations/${aws_apigatewayv2_integration.login_user.id}"
}

## defines a log group to store access logs for the aws_apigatewayv2_stage.lambda API Gateway stage.
resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

## gives API Gateway permission to invoke your Lambda function.
resource "aws_lambda_permission" "api_gw_register" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_user.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
resource "aws_lambda_permission" "api_gw_login" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login_user.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}




