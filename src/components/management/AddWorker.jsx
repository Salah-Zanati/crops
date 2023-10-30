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
const AddWorker = ({ update }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  let { state } = useLocation();

  useEffect(() => {
    if (update) setName(state.name);
    if (update) setPhone(state.phone);
  }, []);
  const onNameChange = (e) => setName(e.target.value);
  const onPhoneChange = (e) => setPhone(e.target.value);

  // Handle submit
  const userId = useSelector(selectUserId);
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/workers`, {
        name,
        phone,
        imgPath: "not found",
      });
    if (update)
      handleUpdating(setLoading, `${userId}/workers`, state.id, {
        name,
        phone,
        imgPath: "not found",
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات عامل" : "إضافة عامل جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="workerName">أدخل إسم العامل : </label>
          <Input
            id="workerName"
            name="workerName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
            disabled={loading}
          />
          <label htmlFor="workerPhone">أدخل رقم الهاتف : </label>
          <Input
            id="workerPhone"
            name="workerPhone"
            type="text"
            placeholder="رقم الهاتف..."
            value={update && phone}
            onChange={onPhoneChange}
            disabled={loading}
          />
          <label htmlFor="workerPhoto">إختر صورة : </label>
          <input id="workerPhoto" name="workerPhoto" type="file" />
          <Button.large
            id="addWorkerSubmitBtn"
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

export default AddWorker;
