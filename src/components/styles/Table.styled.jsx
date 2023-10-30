import { styled } from "styled-components";

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  text-align: center;
  font-weight: bold;
  display: block;
  thead {
    border-radius: 30px 30px 0 0;
    font-size: 30px;
  }
  & > * {
    min-width: 500px;
    width: 100%;
    display: block;
  }
  th,
  td {
    flex: 1;
  }
  thead tr:first-of-type {
    border-radius: 10px 10px 0px 0px;
  }
  tbody tr:last-of-type {
    border-radius: 0px 0px 10px 10px;
  }
  tbody tr,
  thead tr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 18px;
    font-weight: 500;
  }
  tbody tr:nth-child(2n + 1) {
    background-color: #eee;
  }
  thead tr {
    background-color: var(--main-color);
    color: white;
  }

  @media (max-width: 767px) {
    & {
      overflow-x: scroll;
    }
  }
`;
export default Table;
/* background-color: ${(props) => props.bg}; */
/* background-color: ${({ bg }) => bg}; */
// background-color: ${({ theme }) => theme.colors.header};
// padding: 40px 0;

// h1 {
//   color: red;
// }
// &:hover h1 {
//   color: black;
// }
// &::after {
//   display: block;
//   content: "Hello from psudo element";
// }
