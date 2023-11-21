import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  openAccess,
  selectUsersEntities,
  selectUsersLoading,
} from "../toolkit/loginSlice";
import Loading from "./animation/Loading";

const Login = () => {
  const bringUsersData = useSelector(selectUsersEntities);
  const usersLoading = useSelector(selectUsersLoading);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    setUsersData(bringUsersData);
  }, [bringUsersData]);

  useEffect(() => {
    usersLoading === "loading" ? setLoading(true) : setLoading(false);
  }, [usersLoading]);

  const onPassChange = (e) => setPass(e.target.value);
  const onUsernameChange = (e) => setUsername(e.target.value);

  const handleAdding = () => {
    usersData.forEach((user) => {
      if (user.name === username && user.pass === pass)
        dispatch(openAccess(user.userId));
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center items-center flex-1">
      <form className="shadow-sm shadow-gray-300 shadow-lg shadow-gray-200 rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="codeInput" className="font-semibold text-sm">
            أدخل إسم المستخدم:
          </label>
          <input
            type="text"
            id="username"
            placeholder="text"
            value={username}
            className="border-2 border-solid bg-gray-200 border-gray-200 rounded-md py-3 px-5 focus:border-main focus:outline-none"
            onChange={onUsernameChange}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="codeInput" className="font-semibold text-sm">
            أدخل الكود الخاص بك:
          </label>
          <input
            type="password"
            id="pass"
            placeholder="12345678"
            value={pass}
            className="border-2 border-solid bg-gray-200 border-gray-200 rounded-md py-3 px-5 focus:border-main focus:outline-none"
            onChange={onPassChange}
            disabled={loading}
          />
        </div>
        <button
          type="button"
          className="p-3 rounded-md bg-main text-white text-xl self-center font-semibold"
          id="submitBtn"
          onClick={() => handleAdding()}
        >
          إرسال
        </button>
      </form>
    </div>
  );
};

export default Login;
