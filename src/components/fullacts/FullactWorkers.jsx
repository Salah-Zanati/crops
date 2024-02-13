import { Link, useLocation } from "react-router-dom";
import Button from "../styles/Button.styled";
import Container from "../styles/Container.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import Box from "../styles/Box.styled";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFullactWorkers,
  selectFullactWorkersEntities,
  selectFullactWorkersLoading,
} from "../../toolkit/fullactWorkersSlice";
import { useEffect } from "react";
import Loading from "../animation/Loading";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";
import { user } from "../../toolkit/generalSlice";
import { database } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

function Fullactworkers() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userInfo = useSelector(user);
  const bringFullactworkersData = useSelector(selectFullactWorkersEntities);
  const fullactworkersLoading = useSelector(selectFullactWorkersLoading);
  let { state } = useLocation();
  const fullactId = state.id;

  const [fullactworkersData, setFullactworkersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getFullactWorkers(fullactId));
  }, [fullactId]);

  useEffect(() => {
    setFullactworkersData(bringFullactworkersData);
  }, [bringFullactworkersData]);

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <Box>
        <div className="flex flex-col justify-between items-center gap-2 mb-2 sm:flex-row">
          <div className="flex gap-2">
            <Button.large>
              <Link
                to="/fullactWorkers/addFullactWorkers"
                state={{ ...state, fullactId }}
              >
                إضافة عمال
              </Link>
            </Button.large>
            <Button.large
              onClick={() => {
                fullactworkersData.forEach((e) => {
                  let submitingObject = { ...e, isPaid: true };
                  const docToUpdate = doc(
                    database,
                    `users/${userId}/fullacts/${fullactId}/fullactWorkers`,
                    e.id
                  );
                  setLoading(true);
                  updateDoc(docToUpdate, submitingObject)
                    .then(() => {
                      setLoading(false);
                      dispatch(getFullactWorkers(fullactId));
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
                });
              }}
            >
              تسديد
            </Button.large>
          </div>
          <Input
            type="text"
            placeholder="بحث..."
            className="!w-fit"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <Table>
          <thead>
            <tr>
              <th>العامل</th>
              <th>عدد الساعات</th>
              <th>سعر الساعة</th>
              <th>الإجمالي</th>
              <th>مسددة ام لا</th>
              <th>عمليات</th>
            </tr>
          </thead>
          <tbody>
            {fullactworkersLoading === "loading" && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
            {fullactworkersData &&
              fullactworkersLoading !== "loading" &&
              fullactworkersData
                .filter((expnese) => {
                  const values = Object.values(expnese);
                  return values.some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                })
                .map((fullactworker) => {
                  return (
                    <tr key={fullactworker.id}>
                      <td key="1">{fullactworker.workerName}</td>
                      <td key="2">{fullactworker.hoursNum}</td>
                      <td key="3">{fullactworker.hourPrice}</td>
                      <td key="4">
                        {userInfo.currency}{" "}
                        {fullactworker.hoursNum * fullactworker.hourPrice}
                      </td>
                      <td key="5">
                        {fullactworker.isPaid ? "مسددة" : "غير مسددة"}
                      </td>
                      <td key="6" className="flex gap-2 justify-center">
                        <Button.small>
                          <Link
                            to="/fullactWorkers/updateFullactworkers"
                            state={{ ...fullactworker, fullactId }}
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
                                `${userId}/fullacts/${fullactId}/fullactWorkers`,
                                fullactworker.id,
                                dispatch,
                                getFullactWorkers,
                                fullactId
                              );
                            }
                          }}
                        >
                          حذف
                        </Button.small>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </Box>
    </Container>
  );
}

export default Fullactworkers;
