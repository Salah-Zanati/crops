import { styled } from "styled-components";

const Table = styled.table`
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  box-shadow: 0 0 10px #ddd;
  border-radius: 10px;

  & > * {
    min-width: 620px;
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
    gap: 10px;
    padding: 10px;
    font-size: 18px;
    font-weight: 500;
    min-width: 600px;
  }
  tbody tr:nth-child(2n + 1) {
    background-color: #fff;
  }
  thead tr {
    background-color: var(--main-color);
    color: white;
  }
  th,
  td {
    flex: 1;
  }

  @media (max-width: 767px) {
    & {
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
