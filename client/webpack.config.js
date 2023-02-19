/* eslint-disable no-undef */
__webpack_base_uri__ = "http://localhost:3000";
const dotenv = require("dotenv");
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  const config = {
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 3000,
    },
    performance: {
      hints: false,
    },
    mode: "development",
    entry: path.resolve(__dirname, "src") + "/index.jsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "./bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.m?jsx$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                limit: 1000,
                name: "public/icons/[name].[ext]",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new webpack.ProvidePlugin({
        React: "react",
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html"),
      }),
    ],
  };

  return config;
};
