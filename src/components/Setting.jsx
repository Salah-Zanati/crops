import { useEffect, useState } from "react";
import Box from "./styles/Box.styled";
import Button from "./styles/Button.styled";
import Container from "./styles/Container.styled";
import SettingRow from "./styles/SettingRow.styled";
import { useSelector } from "react-redux";
import { user } from "../toolkit/generalSlice";
import Loading from "./animation/LoadingLine";

const Setting = () => {
  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("");

  const userInfo = useSelector(user);
  console.log(userInfo);

  useEffect(() => {
    setUsername(userInfo.name);
    setCurrency(userInfo.currency);
  }, [userInfo]);

  const onUsernameChange = (e) => setUsername(e.target.value);
  const onCurrencyChange = (e) => setCurrency(e.target.value);

  return (
    <Container className="p-5 mb-10 flex justify-center items-start">
      <Box className="flex flex-col gap-3 max-w-sm items-start">
        <div className="w-32 h-32 rounded-full bg-white leading-[9rem] text-center text-[60px] font-bold text-gray-500 uppercase self-center">
          {userInfo.name[0]}
        </div>
        <SettingRow editing={editing}>
          <p>إسم المستخدم:</p>
          <input
            type="text"
            disabled={!editing}
            value={username}
            onChange={onUsernameChange}
          />
        </SettingRow>
        <SettingRow editing={editing}>
          <p> العملة:</p>
          <input
            type="text"
            disabled={!editing}
            value={currency}
            onChange={onCurrencyChange}
          />
        </SettingRow>
        <Button.medium
          onClick={() => {
            if (editing) {
              setEditing(false);
            } else {
              setEditing(true);
            }
          }}
          className="self-end w-fit"
        >
          {loading ? <Loading /> : editing ? "حفظ" : "تعديل"}
        </Button.medium>
        <p className="font-bold">تغيير كلمة المرور:</p>
        <SettingRow>
          <input type="text" placeholder="كلمة المرور الحالية..." />
        </SettingRow>
        <SettingRow>
          <input type="text" placeholder="كلمة المرور الجديدة..." />
        </SettingRow>
        <SettingRow>
          <input type="text" placeholder="تأكيد كلمة المرور..." />
        </SettingRow>
        <Button.medium className="self-end">تغيير</Button.medium>
      </Box>
    </Container>
  );
};

export default Setting;
