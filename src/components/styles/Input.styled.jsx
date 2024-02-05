import { styled } from "styled-components";

const Input = styled.input`
  padding: 10px 15px;
  font-size: 18px;
  border: 2px solid #eee;
  border-radius: 10px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--main-color);
  }
`;
export default Input;
