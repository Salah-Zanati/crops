import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  :root {
  --main-color: #4CAF50; 
  --main-color-alt: #3e9d41; 
}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box; 
    }
    body {
        font-family: 'El Messiri', sans-serif;
        min-height: 100vh;
        direction: rtl;
    }
`;

export default GlobalStyles;
