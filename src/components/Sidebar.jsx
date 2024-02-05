import { useEffect } from "react";
import { Link } from "react-router-dom";
import { UilEstate } from "@iconscout/react-unicons";
import { UilMoneyInsert } from "@iconscout/react-unicons";
import { UilMoneyWithdraw } from "@iconscout/react-unicons";
import { UilCalculator } from "@iconscout/react-unicons";
import { UilAnalysis } from "@iconscout/react-unicons";

const Sidebar = () => {
  const sections = [
    { id: 0, to: "/", value: "mang", text: "إدارة", icon: UilEstate },
    {
      id: 1,
      to: "/sales",
      value: "sales",
      text: "المبيعات",
      icon: UilMoneyInsert,
    },
    {
      id: 2,
      to: "/purchases",
      value: "purchases",
      text: "المشتريات",
      icon: UilMoneyWithdraw,
    },
    {
      id: 3,
      to: "/fullacts",
      value: "fullacts",
      text: "الأعمال",
      icon: UilCalculator,
    },
    {
      id: 4,
      to: "/budget",
      value: "budget",
      text: "الميزانية",
      icon: UilAnalysis,
    },
  ];
  useEffect(() => {
    let links = document.querySelectorAll("#links li a");
    if (!sessionStorage.getItem("activePartAtSidebar"))
      sessionStorage.setItem("activePartAtSidebar", "mang");
    links.forEach((link) => {
      if (link.dataset.value === sessionStorage.getItem("activePartAtSidebar"))
        link.classList.add("bg-mainAlt");
    });
    links.forEach((a) => {
      a.addEventListener("click", function () {
        links.forEach((link) => link.classList.remove("bg-mainAlt"));
        a.classList.add("bg-mainAlt");
        sessionStorage.setItem("activePartAtSidebar", a.dataset.value);
      });
    });
  }, []);

  return (
    <div className="bg-main text-white p-2 z-20 w-full fixed bottom-0 left-0 justify-start md:relative md:w-auto">
      <ul
        id="links"
        className="flex gap-2 text-xl justify-evenly md:items-start md:flex-col"
      >
        {sections.map((section) => (
          <li className="text-center" key={section.id}>
            <Link
              className="block p-1 rounded-md hover:bg-mainAlt flex flex-row-reverse items-center gap-1"
              to={section.to}
              data-value={section.value}
            >
              <p className="hidden md:block">{section.text}</p>
              <i>{<section.icon size="30" />}</i>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
