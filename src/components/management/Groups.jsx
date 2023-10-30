import { useEffect } from "react";
import {
  getGroups,
  selectGroupsEntities,
  selectGroupsLoading,
} from "../../toolkit/groupsSlice";
import Box from "../styles/Box.styled";
import Button from "../styles/Button.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loading from "../animation/Loading";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Groups = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringGroupsData = useSelector(selectGroupsEntities);
  const groupsLoading = useSelector(selectGroupsLoading);
  const [groupsData, setGroupsData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getGroups());
  }, []);
  useEffect(() => {
    setGroupsData(bringGroupsData);
  }, [bringGroupsData]);

  if (loading) return <Loading />;

  return (
    <Box className="flex-col gap-5 relative">
      <div className="flex justify-between">
        <Button.large>
          <Link to="/home/addGroup">إضافة ورشة</Link>
        </Button.large>
        <div className="flex justify-center items-center gap-5">
          <label>مربع البحث: </label>
          <Input
            className="bg-white self-start"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
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
                      <Link to="/home/updataGroup" state={group}>
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
    </Box>
  );
};

export default Groups;
