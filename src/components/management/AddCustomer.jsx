import { useState } from "react";
import Input from "../styles/Input.styled";
import Box from "../styles/Box.styled";
import Container from "../styles/Container.styled";
import Button from "../styles/Button.styled";
import { database } from "../../firebaseConfig.js";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import LoadingLine from "../animation/LoadingLine";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleAdding, handleUpdating } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddCustomer = ({ update }) => {
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

  // Handle sumbit
  const userId = useSelector(selectUserId);
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/customers`, {
        name,
        phone,
        des,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/customers`, state.id, {
        name,
        phone,
        des,
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات الزبون" : "إضافة زبون جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="customerName">أدخل إسم الزبون : </label>
          <Input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
            disabled={loading}
          />
          <label htmlFor="customerDes">أدخل صفة الزبون : </label>
          <Input
            id="customerDes"
            name="customerDes"
            type="text"
            placeholder="الصفة..."
            value={update && des}
            onChange={onDesChange}
            disabled={loading}
          />
          <label htmlFor="customerPhone">أدخل رقم الهاتف : </label>
          <Input
            id="customerPhone"
            name="customerPhone"
            type="text"
            placeholder="رقم الهاتف..."
            value={update && phone}
            onChange={onPhoneChange}
            disabled={loading}
          />
          <label htmlFor="customerPhoto">إختر صورة : </label>
          <input id="customerPhoto" name="customerPhoto" type="file" />
          <Button.large
            id="addCustomerSubmitBtn"
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

export default AddCustomer;
