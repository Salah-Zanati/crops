import logoImg from "../assets/icons8-vegetables-100-white.png";

const Navbar = () => {
  return (
    <nav className="bg-main flex items-center justify-between px-5 py-3 shadow-md shadow-mainAlt z-30">
      <div className="flex items-center">
        <p className="flex items-center gap-2 text-2xl font-messiri text-gray-100 text-center pr-3">
          <img src={logoImg} alt="logo" className="h-12" />
          مواسم
        </p>
      </div>
      <div className="flex gap-5">
        <span className="flex place-items-center cursor-pointer"></span>
        <span className="h-10 w-10 inline-block bg-white hover:bg-mainAlt rounded-full cursor-pointer"></span>
      </div>
    </nav>
  );
};

export default Navbar;
