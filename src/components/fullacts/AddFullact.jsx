import Container from "../styles/Container.styled";
import Box from "../styles/Box.styled";
import Input from "../styles/Input.styled";
import Button from "../styles/Button.styled";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/vegsSlice";
import { useState } from "react";
import { useEffect } from "react";
import { Timestamp, doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import {
  getActs,
  selectActsEntities,
  selectActsLoading,
} from "../../toolkit/actsSlice";
import LoadingLine from "../animation/LoadingLine";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import {
  convertDate,
  handleAdding,
  handleUpdating,
} from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddFullact = ({ update }) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringVegData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);
  const bringActData = useSelector(selectActsEntities);
  const actsLoading = useSelector(selectActsLoading);

  // Inputs states
  const [hourPrice, setHourPrice] = useState(0);
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [act, setAct] = useState(
    doc(database, `users/${userId}/acts`, "00000000000000000000")
  );
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  // loading setting
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    vegsLoading === "loading" || actsLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [vegsLoading, actsLoading]);

  // Getting data and setting it to vegsData state
  const [vegsData, setVegsData] = useState([]);
  const [actsData, setActsData] = useState([]);
  useEffect(() => {
    dispatch(getVegs());
    dispatch(getActs());
  }, []);
  useEffect(() => {
    setVegsData(bringVegData);
  }, [bringVegData]);
  useEffect(() => {
    setActsData(bringActData);
  }, [bringActData]);

  // filling the states on update
  useEffect(() => {
    if (update) {
      setLoading(true);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      const actDoc = doc(database, `users/${userId}/acts`, state.actId);
      setAct(actDoc);
      setHourPrice(Number(state.hourPrice));
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setLoading(false);
    }
  }, []);

  // onChange
  const onHourPriceChange = (e) => setHourPrice(Number(e.target.value));
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/fullacts`, {
        act,
        veg,
        hourPrice,
        date,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/fullacts`, state.id, {
        act,
        veg,
        hourPrice,
        date,
      });
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات المصاريف" : "إضافة مصاريف جديدة"}
        </h1>
        <form className="flex flex-col gap-2">
          <div className="flex gap-5 items-center">
            <label htmlFor="expensesAmount">أدخل سعر الساعة</label>
            <Input
              id="expensesAmount"
              name="expensesAmount"
              type="number"
              placeholder="سعر الساعة..."
              value={update && hourPrice}
              onChange={onHourPriceChange}
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="fullactAct">العمليات</label>
            <SelectMenu
              conectionName="acts"
              data={actsData && actsData}
              listName="إختر عملية"
              setValue={() => setAct}
              selectedItem={update && state.actId}
            />
            <label htmlFor="fullactVeg">الأصناف</label>
            <SelectMenu
              conectionName="vegs"
              data={vegsData && vegsData}
              listName="إختر صنف"
              setValue={() => setVeg}
              selectedItem={update && state.vegId}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="fullactDate">أدخل التاريخ: </label>
            <Input
              id="fullactDate"
              name="fullactDate"
              type="date"
              value={
                date ? convertDate(date.toMillis()) : convertDate(new Date())
              }
              onChange={onDateChange}
              disabled={loading}
            />
          </div>
          <Button.large
            id="addFullactSubmitBtn"
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

export default AddFullact;
