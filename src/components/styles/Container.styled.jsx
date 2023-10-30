import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 12px;
  padding-right: 12px;
  min-height: calc(100vh - 163px);
  @media (min-width: 480px) {
    & {
      max-width: 480px;
    }
  }
  @media (min-width: 768px) {
    & {
      max-width: 768px;
    }
  }
  @media (min-width: 976px) {
    & {
      max-width: 976px;
    }
  }
  @media (min-width: 1440px) {
    & {
      max-width: 1440px;
    }
  }
`;

export default Container;
