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
const AddGroup = ({ update }) => {
  const [name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  let { state } = useLocation();

  useEffect(() => {
    if (update) setFullName(state.name);
    if (update) setPhone(state.phone);
  }, []);
  const onNameChange = (e) => setFullName(e.target.value);
  const onPhoneChange = (e) => setPhone(e.target.value);

  // Handle sumbit
  const userId = useSelector(selectUserId);
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/groups`, {
        name,
        phone,
        imgPath: "not found",
      });
    if (update)
      handleUpdating(setLoading, `${userId}/groups`, state.id, {
        name,
        phone,
        imgPath: "not found",
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات ورشة" : "إضافة ورشة جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="groupName">أدخل إسم الورشة : </label>
          <Input
            id="groupName"
            name="groupName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
            disabled={loading}
          />
          <label htmlFor="groupPhone">أدخل رقم الهاتف : </label>
          <Input
            id="groupPhone"
            name="groupPhone"
            type="text"
            placeholder="رقم الهاتف..."
            value={update && phone}
            onChange={onPhoneChange}
            disabled={loading}
          />
          <label htmlFor="groupPhoto">إختر صورة : </label>
          <input id="groupPhoto" name="groupPhoto" type="file" />
          <Button.large
            id="addGroupSubmitBtn"
            type="button"
            onClick={() => {
              handleSubmitBtn();
            }}
            disabled={loading}
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

export default AddGroup;
