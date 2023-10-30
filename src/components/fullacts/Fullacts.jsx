import { Link } from "react-router-dom";
import Box from "../styles/Box.styled";
import Button from "../styles/Button.styled";
import Container from "../styles/Container.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getFullacts,
  selectFullactEntities,
  selectFullactLoading,
} from "../../toolkit/fullactsSlice";
import Loading from "../animation/Loading";
import Toggle from "../styles/Toggle.styled";
import {
  getGroupsActs,
  selectGroupsActEntities,
  selectGroupsActLoading,
} from "../../toolkit/groupsActsSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Fullact = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringFullactsData = useSelector(selectFullactEntities);
  const fullactsLoading = useSelector(selectFullactLoading);
  const bringGroupsActsData = useSelector(selectGroupsActEntities);
  const groupsActsLoading = useSelector(selectGroupsActLoading);
  const [type, setType] = useState("groups");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullactsData, setfullactsData] = useState([]);
  const [groupsActsData, setGroupsActsData] = useState([]);

  useEffect(() => {
    dispatch(getFullacts());
    dispatch(getGroupsActs());
  }, []);

  useEffect(() => {
    setfullactsData(bringFullactsData);
  }, [bringFullactsData]);
  useEffect(() => {
    setGroupsActsData(bringGroupsActsData);
  }, [bringGroupsActsData]);

  if (
    loading ||
    fullactsLoading === "loading" ||
    groupsActsLoading === "loading"
  )
    return <Loading />;

  return (
    <Container className="my-5">
      <Box className="flex-col gap-5">
        <div className="flex justify-between items-center gap-5 mt-2">
          <Button.large>
            <Link
              to={
                type === "groups"
                  ? "/fullacts/addGroupsAct"
                  : "/fullacts/addFullact"
              }
            >
              إضافة علمية كاملة
            </Link>
          </Button.large>
          <div className="flex justify-start items-center gap-3">
            <p>مربع البحث: </p>
            <Input
              type="text"
              placeholder="بحث..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <p>عمال</p>
            <Toggle
              className="groups"
              onClick={(e) => {
                e.target.classList.toggle("groups");
                e.target.classList.toggle("workers");
                setType(type === "groups" ? "workers" : "groups");
              }}
            />
            <p>ورشات</p>
          </div>
        </div>
        <Table className="p-3 rounded-2xl bg-white">
          {type === "groups" && (
            <>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>العملية</th>
                  <th>الصنف</th>
                  <th>صاحب الورشة</th>
                  <th>عدد الساعات</th>
                  <th>سعر الساعة</th>
                  <th>عدد العمال</th>
                  <th>الإجمالي</th>
                  <th>مسددة أم لا</th>
                  <th>العمليات</th>
                </tr>
              </thead>
              <tbody>
                {groupsActsData &&
                  groupsActsLoading !== "loading" &&
                  groupsActsData
                    .filter((act) => {
                      const actValues = Object.values(act);
                      return actValues.some((value) =>
                        value
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      );
                    })
                    .map((act) => {
                      return (
                        <tr key={act.id}>
                          <td key="1">{act.date}</td>
                          <td key="2">{act.actName}</td>
                          <td key="3">{act.vegName}</td>
                          <td key="4">{act.groupName}</td>
                          <td key="5">{act.hoursNum}</td>
                          <td key="6">{act.hourPrice}</td>
                          <td key="7">{act.workersNum}</td>
                          <td key="8">
                            {(
                              act.workersNum *
                              act.hoursNum *
                              act.hourPrice
                            ).toFixed(2)}
                          </td>
                          <td key="8">
                            {act.isPaid === true ? "مسددة" : "غير مسددة"}
                          </td>
                          <td key="9" className="flex gap-2 justify-center">
                            <Button.small
                              onClick={() => {
                                const sure = confirm("هل أنت متأكد من الحذف.");
                                if (sure) {
                                  handleDeleting(
                                    setLoading,
                                    `${userId}/groupsActs`,
                                    act.id,
                                    dispatch,
                                    getFullacts
                                  );
                                }
                              }}
                            >
                              حذف
                            </Button.small>
                            <Button.small>
                              <Link to="/fullacts/updateGroupsAct" state={act}>
                                تعديل
                              </Link>
                            </Button.small>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </>
          )}

          {type === "workers" && (
            <>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>العملية</th>
                  <th>الصنف</th>
                  <th>سعر الساعة</th>
                  <th>عمليات</th>
                </tr>
              </thead>
              <tbody>
                {fullactsData &&
                  fullactsLoading !== "loading" &&
                  fullactsData
                    .filter((fullact) => {
                      const fullactValues = Object.values(fullact);
                      return fullactValues.some((value) =>
                        value
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      );
                    })
                    .map((fullact) => {
                      return (
                        <tr key={fullact.id}>
                          <td key="1">{fullact.date}</td>
                          <td key="2">{fullact.actName}</td>
                          <td key="3">{fullact.vegName}</td>
                          <td key="4">{fullact.hourPrice}</td>
                          <td key="5" className="flex gap-2 justify-center">
                            <Button.small>
                              <Link
                                to="/fullacts/updateFullact"
                                state={fullact}
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
                                    `${userId}/fullacts`,
                                    fullact.id,
                                    dispatch,
                                    getFullacts
                                  );
                                }
                              }}
                            >
                              حذف
                            </Button.small>
                            <Button.small>
                              <Link to="/fullactWorkers" state={fullact}>
                                عمال
                              </Link>
                            </Button.small>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </>
          )}
        </Table>
      </Box>
    </Container>
  );
};

export default Fullact;
