import { useState } from "react";
import Container from "./styles/Container.styled";
import Box from "./styles/Box.styled";
import { Link } from "react-router-dom";
import ButtonStyled from "./styles/Button.styled";
import Input from "./styles/Input.styled";
import Select from "./styles/Select.styled";
import Workers from "./management/Workers";
import Sellers from "./management/Sellers";
import Vegs from "./management/Vegs";
import Acts from "./management/Acts";
import Material from "./management/Material";
import Groups from "./management/Groups";
import Customers from "./management/Customers";
import { useEffect } from "react";

const Home = () => {
  const [chossed, setChossed] = useState("workers");
  const [searchTerm, setSearchTerm] = useState("");
  const [AddBtnTxt, setAddBtnTxt] = useState("عامل");

  useEffect(() => {
    const options = document.querySelectorAll("#homeMenu option");
    if (!sessionStorage.getItem("activeHomeOption"))
      sessionStorage.setItem("activeHomeOption", "workers");
    else setChossed(sessionStorage.getItem("activeHomeOption"));
    options.forEach((option) => {
      if (option.value === sessionStorage.getItem("activeHomeOption")) {
        option.selected = true;
        setAddBtnTxt(option.dataset.arabic);
      }
    });
  }, []);

  return (
    <>
      <Container className="p-5 flex flex-col gap-5">
        <Box>
          <div className="flex flex-col items-center mb-2 md:flex-row md:justify-between">
            <div className="flex gap-2 mb-2 md:mb-0">
              <ButtonStyled.medium>
                <Link
                  to={`/home/add${
                    chossed[0].toUpperCase() +
                    chossed.slice(
                      1,
                      chossed[chossed.length - 1] == "s"
                        ? chossed.length - 1
                        : chossed.length
                    )
                  }`}
                  state={{ chossed }}
                >
                  إضافة {AddBtnTxt}
                </Link>
              </ButtonStyled.medium>
              <Select
                onChange={(e) => {
                  setChossed(e.target.value);
                  setAddBtnTxt(e.target.selectedOptions[0].dataset.arabic);
                  sessionStorage.setItem("activeHomeOption", e.target.value);
                }}
                id="homeMenu"
              >
                <option value="workers" data-arabic="عامل">
                  العمال
                </option>
                <option value="sellers" data-arabic="بائع">
                  البائعين
                </option>
                <option value="customers" data-arabic="زبون">
                  الزبائن
                </option>
                <option value="vegs" data-arabic="صنف">
                  الأصناف
                </option>
                <option value="groups" data-arabic="ورشة">
                  الورش
                </option>
              </Select>
            </div>
            <Input
              className="!w-fit"
              placeholder="بحث..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {chossed === "workers" && <Workers searchTerm={searchTerm} />}
          {chossed === "sellers" && <Sellers searchTerm={searchTerm} />}
          {chossed === "customers" && <Customers searchTerm={searchTerm} />}
          {chossed === "vegs" && <Vegs searchTerm={searchTerm} />}
          {chossed === "acts" && <Acts searchTerm={searchTerm} />}
          {chossed === "material" && <Material searchTerm={searchTerm} />}
          {chossed === "groups" && <Groups searchTerm={searchTerm} />}
        </Box>
      </Container>
    </>
  );
};

export default Home;
