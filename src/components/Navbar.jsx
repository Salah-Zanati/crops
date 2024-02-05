import { useDispatch, useSelector } from "react-redux";
import logoImg from "../assets/icons8-vegetables-100-white.png";
import { closeAccess, selectAccess } from "../toolkit/loginSlice";
import { user } from "../toolkit/generalSlice";
import { useEffect } from "react";
import { useState } from "react";
import Button from "./styles/Button.styled";
import { UilSetting } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const access = useSelector(selectAccess);
  const userInfo = useSelector(user);

  const [name, setName] = useState("");

  useEffect(() => {
    setName(userInfo.name);
  }, [userInfo.name]);

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
              className="h-[35px] w-[35px] border-1 z-10 flex justify-center items-center cursor-pointer"
              onClick={() => {
                document.getElementById("setting").classList.toggle("hidden");
              }}
            >
              <UilSetting size="35" color="white" />
            </div>
            <div
              id="setting"
              className="absolute p-5 flex flex-col items-center gap-1 min-w-max bg-white top-16 left-0 rounded-xl shadow-lg shadow-gray-300 hidden"
            >
              <div className="select-none text-center">
                <div className="h-24 w-24 leading-[7rem] text-[50px] font-bold bg-eee text-gray-500 uppercase rounded-full">
                  {userInfo.name[0]}
                </div>
                <p className="text-gray-500 mt-1">{name}</p>
              </div>
              <hr className="bg-black w-2/3" />
              <div className="flex flex-col">
                <Link
                  to="/setting"
                  onClick={() => {
                    document
                      .getElementById("setting")
                      .classList.toggle("hidden");
                    document.querySelectorAll("#links li a").forEach((el) => {
                      el.classList.remove("bg-mainAlt");
                    });
                  }}
                  className="py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  الإعدادات
                </Link>
              </div>
              <Button.medium
                onClick={() => {
                  const sure = confirm("هل أنت متأكد؟");
                  if (sure) dispatch(closeAccess());
                }}
              >
                تسجيل الخروج
              </Button.medium>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
