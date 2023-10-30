import { useEffect } from "react";
import Box from "./styles/Box.styled";
import Button from "./styles/Button.styled";
import Workers from "./management/Workers";
import Sellers from "./management/Sellers";
import Customers from "./management/Customers";
import Acts from "./management/Acts";
import Vegs from "./management/Vegs";
import Container from "./styles/Container.styled";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActivePartAtHome,
  updateActivePartAtHome,
} from "../toolkit/generalSlice";
import Material from "./management/Material";
import Groups from "./management/Groups";

const Home = () => {
  const activePart = useSelector(selectActivePartAtHome);
  const dispatch = useDispatch();

  const activeBtnStyle = `
  button.active::after {
    content: "";
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: white;
    border-radius: 50%;
    margin-right: 5px;
    animation: activeBtnAnimation 0.5s linear alternate infinite;
  }
@keyframes activeBtnAnimation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.3);
  }
}
  `;
  useEffect(() => {
    document.querySelectorAll("#homeBoxBtns button").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll("#homeBoxBtns button").forEach((innerBtn) => {
          innerBtn.classList.remove("active");
        });
        btn.classList.add("active");
        dispatch(updateActivePartAtHome(btn.value));
      };
      if (btn.value === activePart) btn.classList.add("active");
    });
  }, []);

  return (
    <Container className="p-5 flex flex-col gap-5">
      <Box id="homeBoxBtns" className="flex-row justify-center gap-3 flex-wrap">
        <style>{activeBtnStyle}</style>
        <Button.large value="workers">العمال</Button.large>
        <Button.large value="sellers">البائعين</Button.large>
        <Button.large value="customers">الزبائن</Button.large>
        <Button.large value="vegs">الأصناف</Button.large>
        <Button.large value="acts">العمليات</Button.large>
        <Button.large value="material">المواد</Button.large>
        <Button.large value="groups">الورش</Button.large>
      </Box>
      {activePart === "workers" && <Workers />}
      {activePart === "sellers" && <Sellers />}
      {activePart === "customers" && <Customers />}
      {activePart === "vegs" && <Vegs />}
      {activePart === "acts" && <Acts />}
      {activePart === "material" && <Material />}
      {activePart === "groups" && <Groups />}
    </Container>
  );
};

export default Home;
