import { pick } from "lodash";
import * as yup from "yup";

const credentialsSchema = {
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
};
export const registerSchema = yup.object(credentialsSchema).required();

export const loginSchema = yup
  .object(pick(credentialsSchema, ["email", "password"]))
  .required();
