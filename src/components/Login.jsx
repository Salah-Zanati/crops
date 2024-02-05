import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  openAccess,
  selectAccess,
  selectUsersEntities,
  selectUsersLoading,
} from "../toolkit/loginSlice";
import Loading from "./animation/Loading";
import { saveUser } from "../toolkit/generalSlice";
("../toolkit/generalSlice");

const Login = () => {
  const bringUsersData = useSelector(selectUsersEntities);
  const usersLoading = useSelector(selectUsersLoading);
  const access = useSelector(selectAccess);
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
      if (user.name === username && user.pass === pass) {
        dispatch(openAccess(user.userId));
        dispatch(saveUser(user));
      }
    });
    if (!access) {
      document.querySelector("#loginForm #errorMsg").classList.remove("hidden");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center items-center flex-1">
      <form
        id="loginForm"
        className="shadow-sm shadow-gray-300 shadow-lg shadow-gray-200 rounded-lg p-5 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <p id="errorMsg" className="text-red-600 hidden">
            خطأ في إسم المستخدم أو كلمة المرور!!
          </p>
          <label htmlFor="username" className="font-semibold text-sm">
            أدخل إسم المستخدم:
          </label>
          <input
            type="text"
            id="username"
            placeholder="test"
            value={username}
            className="border-2 border-solid bg-gray-200 border-gray-200 rounded-md py-3 px-5 focus:border-main focus:outline-none"
            onChange={onUsernameChange}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pass" className="font-semibold text-sm">
            أدخل الكود الخاص بك:
          </label>
          <input
            type="password"
            id="pass"
            placeholder="123"
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
