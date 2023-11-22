import { useEffect } from "react";
import {
  getGroups,
  selectGroupsEntities,
  selectGroupsLoading,
} from "../../toolkit/groupsSlice";
import Button from "../styles/Button.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loading from "../animation/Loading";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const Groups = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringGroupsData = useSelector(selectGroupsEntities);
  const groupsLoading = useSelector(selectGroupsLoading);
  const [groupsData, setGroupsData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getGroups());
  }, []);
  useEffect(() => {
    setGroupsData(bringGroupsData);
  }, [bringGroupsData]);

  if (loading) return <Loading />;

  return (
    <Table className="p-3 rounded-2xl bg-white">
      <thead>
        <tr>
          <th>الإسم الكامل</th>
          <th>رقم الهاتف</th>
          <th>عمليات</th>
        </tr>
      </thead>
      <tbody id="tbody">
        {groupsLoading === "loading" && (
          <tr>
            <td>
              <Loading />
            </td>
          </tr>
        )}
        {groupsData &&
          groupsLoading !== "loading" &&
          groupsData
            .filter((group) => {
              const groupValues = Object.values(group);
              return groupValues.some((value) =>
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              );
            })
            .map((group) => (
              <tr key={group.id}>
                <td key="1">{group.name}</td>
                <td key="2">{group.phone}</td>
                <td key="3" className="flex gap-2 justify-center">
                  <Button.small>صورة</Button.small>
                  <Button.small>
                    <Link
                      to="/home/updataGroup"
                      state={{ ...group, chossed: "groups" }}
                    >
                      تعديل
                    </Link>
                  </Button.small>
                  <Button.small
                    onClick={() => {
                      const sure = confirm("هل أنت متأكد من الحذف.");
                      if (sure) {
                        handleDeleting(
                          setLoading,
                          `${userId}/groups`,
                          group.id,
                          dispatch,
                          getGroups
                        );
                      }
                    }}
                  >
                    حذف
                  </Button.small>
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

export default Groups;
