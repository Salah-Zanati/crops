import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  ${
    "" /* @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap');  */
  }
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
        ${"" /* font-family: 'Cairo', sans-serif; */}
        font-family: 'El Messiri', sans-serif;
        min-height: 100vh;
        direction: rtl;
    }
`;

export default GlobalStyles;
