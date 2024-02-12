import { styled } from "styled-components";

const Input = styled.input`
  padding: 6px 12px;
  font-size: 16px;
  outline: 1px solid #d5d5d5;
  border-radius: 5px;
  width: 100%;

  &:focus {
    /* outline: none; */
    outline: 2px solid var(--main-color);
    outline-offset: -1px;
  }
`;
export default Input;
