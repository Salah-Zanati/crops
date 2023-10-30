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
const AddSeller = ({ update }) => {
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  let { state } = useLocation();

  useEffect(() => {
    if (update) setName(state.name);
    if (update) setPhone(state.phone);
    if (update) setDes(state.des);
  }, []);
  const onNameChange = (e) => setName(e.target.value);
  const onPhoneChange = (e) => setPhone(e.target.value);
  const onDesChange = (e) => setDes(e.target.value);

  // Handle submit
  const userId = useSelector(selectUserId);
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/sellers`, {
        name,
        phone,
        des,
        imgPath: "not found",
      });
    if (update)
      handleUpdating(setLoading, `${userId}/sellers`, state.id, {
        name,
        phone,
        des,
        imgPath: "not found",
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات البائع" : "إضافة بائع جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="sellerName">أدخل إسم البائع : </label>
          <Input
            id="sellerName"
            name="sellerName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
            disabled={loading}
          />
          <label htmlFor="sellerDes">أدخل صفة البائع : </label>
          <Input
            id="sellerDes"
            name="sellerDes"
            type="text"
            placeholder="الصفة..."
            value={update && des}
            onChange={onDesChange}
            disabled={loading}
          />
          <label htmlFor="sellerPhone">أدخل رقم الهاتف : </label>
          <Input
            id="sellerPhone"
            name="sellerPhone"
            type="text"
            placeholder="رقم الهاتف..."
            value={update && phone}
            onChange={onPhoneChange}
            disabled={loading}
          />
          <label htmlFor="sellerPhoto">إختر صورة : </label>
          <input id="sellerPhoto" name="sellerPhoto" type="file" />
          <Button.large
            id="addSellerSubmitBtn"
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

export default AddSeller;
