import styled from "styled-components";

const settingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  & p {
    width: 110px;
  }
  & input {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    background-color: ${(props) => (props.editing == false ? "#ddd" : "#fff")};
  }
  & input:focus {
    outline: 2px solid var(--main-color);
  }
`;
export default settingRow;
