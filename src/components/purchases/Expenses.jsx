import { Link, useLocation } from "react-router-dom";
import Button from "../styles/Button.styled";
import Container from "../styles/Container.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import Box from "../styles/Box.styled";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenses,
  selectExpensesEntities,
  selectExpensesLoading,
} from "../../toolkit/expensesSlice";
import { useEffect } from "react";
import Loading from "../animation/Loading";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

function Expenses() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringExpensesData = useSelector(selectExpensesEntities);
  const expnesesLoading = useSelector(selectExpensesLoading);
  let { state } = useLocation();
  const purchasesId = state.id;

  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getExpenses(purchasesId));
  }, [purchasesId]);

  useEffect(() => {
    setExpensesData(bringExpensesData);
  }, [bringExpensesData]);

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <Box className="flex-col gap-5">
        <div className="flex justify-between gap-5 mt-2">
          <Button.large>
            <Link to="/expenses/addExpenses" state={{ ...state, purchasesId }}>
              إضافة مصاريف
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
              <th>التاريخ</th>
              <th>المادة</th>
              <th>الكمية</th>
              <th>الصنف</th>
              <th>عمليات</th>
            </tr>
          </thead>
          <tbody>
            {expnesesLoading === "loading" && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
            {expensesData &&
              expnesesLoading !== "loading" &&
              expensesData
                .filter((expnese) => {
                  const values = Object.values(expnese);
                  return values.some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                })
                .map((expense) => {
                  return (
                    <tr key={expense.id}>
                      <td key="1">{expense.date}</td>
                      <td key="2">{state.materialName}</td>
                      <td key="3">{expense.amount}</td>
                      <td key="4">{expense.vegName}</td>
                      <td key="5" className="flex gap-2 justify-center">
                        <Button.small>
                          <Link
                            to="/expenses/updateExpenses"
                            state={{ ...expense, purchasesId }}
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
                                `${userId}/purchases/${purchasesId}/expenses`,
                                expense.id,
                                dispatch,
                                getExpenses,
                                purchasesId
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

export default Expenses;
