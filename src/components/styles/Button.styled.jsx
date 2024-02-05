import styled from "styled-components";

const Button = () => {
  const style = {
    "background-color": " var(--main-color)",
    color: "white",
    "font-weight": "bold",
    transition: "all .3s",
  };
  const hover = {
    "background-color": "var(--main-color-alt)",
  };
  const small = styled.button`
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 3px;
    ${{ ...style }}
    &:hover {
      ${{ ...hover }}
    }
  `;
  const medium = styled.button`
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 8px;
    ${{ ...style }}
    &:hover {
      ${{ ...hover }}
    }
    & > div {
      height: 21px;
    }
  `;
  const large = styled.button`
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 10px;
    ${{ ...style }}
    &:hover {
      ${{ ...hover }}
    }
    & > div {
      height: 24px;
    }
  `;
  return {
    small,
    medium,
    large,
  };
};

export default Button();
