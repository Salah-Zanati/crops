import { useState } from "react";
import Input from "../styles/Input.styled";
import Box from "../styles/Box.styled";
import Container from "../styles/Container.styled";
import Button from "../styles/Button.styled";
import LoadingLine from "../animation/LoadingLine";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleAdding, handleUpdating } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddAct = ({ update }) => {
  const [name, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  let { state } = useLocation();

  useEffect(() => {
    if (update) setFullName(state.name);
  }, []);
  const onNameChange = (e) => setFullName(e.target.value);

  const userId = useSelector(selectUserId);

  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/acts`, {
        name,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/acts`, state.id, {
        name,
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات العملية" : "إضافة عملية جديدة"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="actName">أدخل إسم العملية : </label>
          <Input
            id="actName"
            name="actName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
          />
          <Button.large
            id="addActSubmitBtn"
            type="button"
            onClick={() => {
              handleSubmitBtn();
            }}
          >
            {!loading && !update && "إرسال"}
            {loading && <LoadingLine />}
            {!loading && update && "تعديل"}
          </Button.large>
        </form>
      </Box>
    </Container>
  );
};

export default AddAct;
