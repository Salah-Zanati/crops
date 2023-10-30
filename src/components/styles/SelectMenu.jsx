/* eslint-disable react/prop-types */
import { database } from "../../firebaseConfig";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../toolkit/loginSlice";

const SelectMenu = ({
  listName,
  setValue,
  data = [],
  conectionName,
  selectedItem,
}) => {
  const setSelectedElement = setValue();
  const ulId = conectionName + "Ul";
  const parentDiv = conectionName + "parentDiv";
  const [list, setList] = useState(listName);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    document
      .getElementById(ulId)
      .querySelectorAll("li")
      .forEach((li) => {
        if (li.dataset.value === selectedItem) {
          li.classList.add("text-main");
          setList(li.dataset.name);
        } else li.classList.remove("text-main");
      });
  }, [data]);

  return (
    <div className="relative font-bold">
      <div
        className="p-3 bg-main flex gap-2 items-center relative text-white cursor-pointer rounded-lg"
        onClick={(e) => {
          // animation
          const targetElement = e.target;
          const divElement = document.getElementById(parentDiv);
          if (
            targetElement === divElement ||
            divElement.contains(targetElement)
          ) {
            divElement
              .querySelector("span span:first-of-type")
              .classList.toggle("animate-ping");
          }
          // show and hide ul elment
          document.getElementById(ulId).classList.toggle("hidden");
        }}
        id={parentDiv}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <p className="text-center cursor-pointer">{list}</p>
      </div>
      <ul
        id={ulId}
        className="flex z-10 flex-col  absolute max-h-40 overflow-y-auto hidden mt-1 rounded-lg border-2 border-solid border-main bg-white text-gray-400"
      >
        {
          // eslint-disable-next-line react/prop-types
          data.map((li) => {
            return (
              <li
                data-value={li.id}
                key={li.id}
                data-name={li.name ? li.name : li.fullName}
                className="text-center py-5 px-3 overflow-hidden cursor-pointer rounded-md hover:bg-main-filmy"
                onClick={(e) => {
                  const lis = document
                    .getElementById(ulId)
                    .querySelectorAll(`li`);
                  lis.forEach((li) => {
                    li.classList.remove("text-main");

                    e.target.classList.add("text-main");
                    const selected = doc(
                      database,
                      `users/${userId}/${conectionName}`,
                      e.target.dataset.value
                    );
                    setList(e.target.dataset.name);
                    document.getElementById(ulId).classList.add("hidden");
                    setSelectedElement(selected);
                  });
                }}
              >
                {li.name ? li.name : li.fullName}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default SelectMenu;
