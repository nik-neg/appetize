import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    background: url("../images/login-small.jpg") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
`;

export default GlobalStyle;
