import { styled } from "styled-components";

const Input = styled.input`
  /* background-color: ${({ theme }) => theme.colors.bgElements}; */
  padding: 10px 15px;
  font-size: 18px;
  position: relative;
  border: 2px solid #eee;
  border-radius: 10px;
  color: black;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--main-color);
  }
`;
export default Input;
