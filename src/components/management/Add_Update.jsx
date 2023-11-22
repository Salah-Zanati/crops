/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUserId } from "../../toolkit/loginSlice";
import { useState } from "react";
import { useEffect } from "react";
import { handleAdding, handleUpdating } from "../../utils/functions";
import Container from "../styles/Container.styled";
import Box from "../styles/Box.styled";
import Input from "../styles/Input.styled";
import ButtonStyled from "../styles/Button.styled";
import LoadingLine from "../animation/LoadingLine";
import fieldsAPI from "./fieldsAPI";

// eslint-disable-next-line react/prop-types
const Add_Update = ({ update }) => {
  const { state } = useLocation();
  const userId = useSelector(selectUserId);
  const fieldsData = fieldsAPI[`${state.chossed}`];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [des, setDes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (update && state.name) {
      setName(state.name);
    }
    if (update && state.phone) {
      setPhone(state.phone);
    }
    if (update && state.des) {
      setDes(state.des);
    }
  }, []);

  const onChange = (e, type) => {
    const value = e.target.value;
    switch (type) {
      case "name":
        setName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "des":
        setDes(value);
        break;
      default:
        break;
    }
  };

  const submitingObject = () => {
    let obj = {};
    name && (obj.name = name);
    phone && (obj.phone = phone);
    des && (obj.des = des);
    return { ...obj };
  };

  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/${fieldsData.name}`, submitingObject);
    if (update)
      handleUpdating(
        setLoading,
        `${userId}/${fieldsData.name}`,
        state.id,
        submitingObject
      );
  };

  return (
    <Container className="my-5 flex justify-center items-start">
      <Box className="rounded-xl flex-col w-full sm:w-80 sm:w-2/3 lg:w-1/2">
        <h1 className="font-bold text-xl">
          {update ? fieldsData.updateTitle : fieldsData.addTitle}
        </h1>
        <form className="flex flex-col gap-2">
          {(() => {
            let returning = [];
            for (let i = 0; i < fieldsData.fields.length; i++) {
              returning.push(
                <>
                  <label key={i} htmlFor={fieldsData.fields[i]}>
                    {"أدخل " +
                      fieldsData.fieldsTexts[i] +
                      " ال" +
                      fieldsData.arabicName}
                  </label>
                  <Input
                    key={i + 50}
                    id={fieldsData.fields[i]}
                    name={fieldsData.fields[i]}
                    type="text"
                    placeholder={fieldsData.fieldsTexts[i] + "..."}
                    value={eval(`${fieldsData.fields[i]}`)}
                    onChange={(e) => onChange(e, fieldsData.fields[i])}
                    disabled={loading}
                  />
                </>
              );
            }
            returning.push(
              <ButtonStyled.large
                id={"SubmitBtn"}
                type="button"
                onClick={() => handleSubmitBtn()}
                disabled={loading}
                className="mt-3"
              >
                {!loading && !update && "إرسال"}
                {loading && <LoadingLine />}
                {!loading && update && "تعديل"}
              </ButtonStyled.large>
            );
            return returning;
          })()}
        </form>
      </Box>
    </Container>
  );
};

export default Add_Update;
