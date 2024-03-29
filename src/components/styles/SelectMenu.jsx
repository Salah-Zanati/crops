import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { useSelector } from "react-redux";
import { selectUserId } from "../../toolkit/loginSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line react/prop-types
const SelectMenu = ({ listName, data = [], setValue, conection, existed }) => {
  const userId = useSelector(selectUserId);

  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (selected.id) {
      const selectedDoc = doc(
        database,
        `users/${userId}/${conection}`,
        selected.id
      );
      setValue(selectedDoc);
    }
  }, [selected]);
  useEffect(() => {
    if (existed) {
      data.forEach((e) => e.id === existed && setSelected(e));
    }
  }, [data]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pr-3 pl-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-main sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="block truncate w-[60vw] text-right text-base sm:w-[140px]">
                  {selected.name ? selected.name : listName}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 left-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {data &&
                  data.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-main text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 px-3"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {person.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-main",
                                "absolute inset-y-0 left-0 flex items-center pl-3"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SelectMenu;
