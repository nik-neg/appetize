import { IUser } from "./types";

const baseUrl = "http://localhost:3001";

const apiServiceJWT = {
  register: async (user: IUser) => {},
  loginUser: async (user: IUser) => {},
  getProfile: async (accessToken: string | null) => {},
  logout: async (accessToken: string | null) => {},
};

apiServiceJWT.register = async (user) => {
  return fetch(`${baseUrl}/register`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));
};

apiServiceJWT.loginUser = async (user) => {
  return fetch(`${baseUrl}/login`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));
};

apiServiceJWT.getProfile = async (accessToken) => {
  return fetch(`${baseUrl}/profile`, {
    method: "GET",
    credentials: "include",
    mode: "cors", // TODO: check
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => data.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

apiServiceJWT.logout = async (accessToken) => {
  return fetch(`${baseUrl}/logout`, {
    method: "POST",
    credentials: "include",
    mode: "cors", // TODO: check
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => data.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

export default apiServiceJWT;
