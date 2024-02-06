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
import {
  fullactToggle,
  selectFullactToggle,
  user,
} from "../../toolkit/generalSlice";

const Fullact = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userInfo = useSelector(user);

  const bringFullactsData = useSelector(selectFullactEntities);
  const fullactsLoading = useSelector(selectFullactLoading);
  const bringGroupsActsData = useSelector(selectGroupsActEntities);
  const groupsActsLoading = useSelector(selectGroupsActLoading);
  const fullactToggleValue = useSelector(selectFullactToggle);

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
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <Container className="my-5">
      <Box>
        <div className="flex justify-between items-center flex-col gap-2 mb-2 md:flex-row">
          <Button.large>
            <Link
              to={
                fullactToggleValue
                  ? "/fullacts/addGroupsAct"
                  : "/fullacts/addFullact"
              }
            >
              إضافة علمية كاملة
            </Link>
          </Button.large>
          <Input
            type="text"
            placeholder="بحث..."
            className="!w-fit"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <div className="flex items-center gap-3">
            <p>عمال</p>
            <Toggle
              className={`${fullactToggleValue ? "groups" : ""}`}
              id="fullactToggle"
              onClick={() => {
                dispatch(fullactToggle(!fullactToggleValue));
              }}
            />
            <p>ورشات</p>
          </div>
        </div>
        <Table>
          {fullactToggleValue && (
            <>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th className="hidden md:block">العملية</th>
                  <th>الصنف</th>
                  <th>صاحب الورشة</th>
                  <th className="hidden md:block">عدد الساعات</th>
                  <th className="hidden md:block">سعر الساعة</th>
                  <th className="hidden md:block">عدد العمال</th>
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
                    .sort(function (a, b) {
                      return new Date(b.date) - new Date(a.date);
                    })
                    .map((act) => {
                      return (
                        <tr key={act.id}>
                          <td key="1">{act.date}</td>
                          <td className="hidden md:block" key="2">
                            {act.act}
                          </td>
                          <td key="3">{act.vegName}</td>
                          <td key="4">{act.groupName}</td>
                          <td className="hidden md:block" key="5">
                            {act.hoursNum}
                          </td>
                          <td className="hidden md:block" key="6">
                            {userInfo.currency} {act.hourPrice}
                          </td>
                          <td className="hidden md:block" key="7">
                            {act.workersNum}
                          </td>
                          <td key="8">
                            {userInfo.currency}{" "}
                            {(
                              act.workersNum *
                              act.hoursNum *
                              act.hourPrice
                            ).toFixed(2)}{" "}
                          </td>
                          <td key="10">
                            {act.isPaid === true ? "مسددة" : "غير مسددة"}
                          </td>
                          <td
                            key="9"
                            className="flex gap-2 justify-center flex-wrap"
                          >
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

          {!fullactToggleValue && (
            <>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th className="hidden md:block">العملية</th>
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
                    .sort(function (a, b) {
                      return new Date(b.date) - new Date(a.date);
                    })
                    .map((fullact) => {
                      return (
                        <tr key={fullact.id}>
                          <td key="1">{fullact.date}</td>
                          <td className="hidden md:block" key="2">
                            {fullact.act}
                          </td>
                          <td key="3">{fullact.vegName}</td>
                          <td key="4">
                            {userInfo.currency} {fullact.hourPrice}
                          </td>
                          <td
                            key="5"
                            className="flex gap-2 justify-center flex-wrap"
                          >
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
