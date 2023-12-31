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

function Fullactworkers() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
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
      <Box className="flex-col gap-5">
        <div className="flex justify-between gap-5 mt-2">
          <Button.large>
            <Link
              to="/fullactWorkers/addFullactWorkers"
              state={{ ...state, fullactId }}
            >
              إضافة عمال
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
        </div>
        <Table className="p-3 rounded-2xl bg-white">
          <thead>
            <tr>
              <th>العامل</th>
              <th>عدد الساعات</th>
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
                      <td key="5">
                        {fullactworker.hoursNum * state.hourPrice}{" "}
                        {state.currencyName}
                      </td>
                      <td key="3">
                        {fullactworker.isPaid ? "مسددة" : "غير مسددة"}
                      </td>
                      <td key="4" className="flex gap-2 justify-center">
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
