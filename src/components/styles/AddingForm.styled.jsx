import { styled } from "styled-components";

const AddingForm = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  & label {
    user-select: none;
  }
  & > div {
    width: fit-content;
    max-width: 28rem;
    background-color: #eee;
    padding: 20px;
    border-radius: 12px;
  }
  & h1 {
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
  }
  & form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  & form > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  @media (min-width: 480px) {
    & form > div {
      flex-direction: row;
    }
  }
  & form > div > div {
    flex-basis: 50%;
  }
  & form > div.d-p {
    justify-content: space-evenly;
    flex-direction: row;
  }
  & form > div.d-p > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & form > div.d-p > div input[type="date"] {
    padding: 8px;
    border-radius: 12px;
  }
  & form > div.d-p > div input[type="checkbox"] {
    height: 20px;
    width: 20px;
  }
`;
export default AddingForm;
