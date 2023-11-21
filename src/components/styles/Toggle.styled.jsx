import styled from "styled-components";

const Toggle = styled.span`
  position: relative;
  display: block;
  width: 40px;
  height: 20px;
  background-color: var(--main-color);
  top: 0;
  left: 0;
  border-radius: 25px;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: white;
    top: 3px;
    right: 3px;
    border-radius: 50%;
    transition: 0.3s;
  }
  &.groups::after {
    right: 23px;
  }
`;
export default Toggle;
