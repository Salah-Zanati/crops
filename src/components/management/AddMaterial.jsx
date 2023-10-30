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
const AddMaterial = ({ update }) => {
  const [name, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  let { state } = useLocation();

  useEffect(() => {
    if (update) setFullName(state.name);
  }, []);
  const onNameChange = (e) => setFullName(e.target.value);

  // Handle sumbit
  const userId = useSelector(selectUserId);
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/material`, {
        name,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/material`, state.id, {
        name,
      });
  };
  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات المادة" : "إضافة مادة جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <label htmlFor="materialName">أدخل إسم المادة : </label>
          <Input
            id="materialName"
            name="materialName"
            type="text"
            placeholder="الإسم..."
            value={update && name}
            onChange={onNameChange}
            disabled={loading}
          />
          <Button.large
            id="addMaterialSubmitBtn"
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

export default AddMaterial;
