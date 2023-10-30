import { useState } from "react";
import Box from "../styles/Box.styled";
import Container from "../styles/Container.styled";
import Input from "../styles/Input.styled";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/vegsSlice";
import { useEffect } from "react";
// import Select from "../styles/Select.styled";
import { Timestamp, doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Button from "../styles/Button.styled";
import LoadingLine from "../animation/LoadingLine";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import {
  convertDate,
  handleAdding,
  handleUpdating,
} from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddExpenses = ({ update }) => {
  const { state } = useLocation();
  const purchaseId = state.purchasesId;
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const bringVegData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);

  // Inputs states
  const [amount, setAmount] = useState(0);
  const [veg, setVeg] = useState("");
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  // loading setting
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    vegsLoading === "loading" ? setLoading(true) : setLoading(false);
  }, [vegsLoading]);

  // Getting data and setting it to vegsData state
  const [vegsData, setVegsData] = useState([]);
  useEffect(() => {
    dispatch(getVegs());
  }, []);
  useEffect(() => {
    setVegsData(bringVegData);
  }, [bringVegData]);

  // filling the states on update
  useEffect(() => {
    if (update) {
      setLoading(true);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      setAmount(Number(state.amount));
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setLoading(false);
    }
  }, []);

  // onChange
  const onAmountChange = (e) => setAmount(Number(e.target.value));

  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/purchases/${purchaseId}/expenses`, {
        veg,
        amount,
        date,
      });
    if (update)
      handleUpdating(
        setLoading,
        `${userId}/purchases/${purchaseId}/expenses`,
        state.id,
        {
          veg,
          amount,
          date,
        }
      );
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات المصاريف" : "إضافة مصاريف جديدة"}
        </h1>
        <form className="flex flex-col gap-2">
          <div className="flex gap-5 items-center">
            <label htmlFor="expensesAmount">أدخل الكمية</label>
            <Input
              id="expensesAmount"
              name="expensesAmount"
              type="number"
              placeholder="الكمية..."
              value={update && amount}
              onChange={onAmountChange}
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="expensesVeg">الأصناف</label>
            <SelectMenu
              conectionName="vegs"
              data={vegsData && vegsData}
              listName="إختر صنف"
              setValue={() => setVeg}
              selectedItem={update && state.vegId}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="expensesDate">أدخل التاريخ: </label>
            <Input
              id="expensesDate"
              name="expensesDate"
              type="date"
              value={
                date ? convertDate(date.toMillis()) : convertDate(new Date())
              }
              onChange={onDateChange}
              disabled={loading}
            />
          </div>
          <Button.large
            id="addPurchaseSubmitBtn"
            type="button"
            onClick={() => {
              handleSubmitBtn();
            }}
          >
            {!loading && !update && "إرسال"}
            {loading && <LoadingLine />}
            {!loading && update && "تعديل"}
          </Button.large>
        </form>
      </Box>
    </Container>
  );
};

export default AddExpenses;
