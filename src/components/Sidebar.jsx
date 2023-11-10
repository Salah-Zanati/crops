import { useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const sections = [
    { id: 5, to: "/", value: "mang", text: "إدارة" },
    { id: 1, to: "/sales", value: "sales", text: "المبيعات" },
    { id: 2, to: "/purchases", value: "purchases", text: "المشتريات" },
    { id: 3, to: "/fullacts", value: "fullacts", text: "العمليات الكاملة" },
    { id: 4, to: "/about", value: "developerInfo", text: "معلومات المطور" },
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
    <div className="bg-main text-white p-2 z-20">
      <ul id="links" className="flex flex-col gap-2 text-xl">
        {sections.map((section) => (
          <li className="text-center" key={section.id}>
            <Link
              className="block p-1 rounded-md hover:bg-mainAlt"
              to={section.to}
              data-value={section.value}
            >
              {section.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
