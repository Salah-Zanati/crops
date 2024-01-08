import { useDispatch, useSelector } from "react-redux";
import logoImg from "../assets/icons8-vegetables-100-white.png";
import { closeAccess, selectAccess } from "../toolkit/loginSlice";
import { username } from "../toolkit/generalSlice";
import { useEffect } from "react";
import { useState } from "react";
import Button from "./styles/Button.styled";

const Navbar = () => {
  const dispatch = useDispatch();
  const access = useSelector(selectAccess);
  const bringUserName = useSelector(username);

  const [name, setName] = useState("");

  useEffect(() => {
    setName(bringUserName);
  }, [bringUserName]);

  return (
    <nav className="bg-main flex items-center justify-between px-5 py-3 shadow-md shadow-mainAlt z-30">
      <div className="flex items-center">
        <p className="flex items-center gap-2 text-2xl font-messiri text-gray-100 text-center pr-3">
          <img src={logoImg} alt="logo" className="h-12" />
          مواسم
        </p>
      </div>
      <div className="relative">
        {access && (
          <>
            <div
              className="w-14 h-14 rounded-full bg-white cursor-pointer"
              onClick={(e) => {
                e.target.parentElement.children
                  .item(1)
                  .classList.toggle("hidden");
              }}
            ></div>
            <div className="absolute p-3 flex flex-col items-center gap-1 min-w-max bg-white top-16 left-0 rounded-md shadow-md shadow-gray-300 hidden">
              <div className="select-none">
                <p className="text-sm">إسم المستخدم:</p>
                <p className="text-gray-500">{name}</p>
              </div>
              <Button.small
                onClick={() => {
                  const sure = confirm("هل أنت متأكد؟");
                  if (sure) dispatch(closeAccess());
                }}
              >
                تسجيل الخروج
              </Button.small>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
