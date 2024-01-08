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
import LoadingLine from "../animation/LoadingLine";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import {
  convertDate,
  handleAdding,
  handleUpdating,
} from "../../utils/functions";
import {
  getCurrency,
  selectCurrencyEntities,
  selectCurrencyLoading,
} from "../../toolkit/currencySlice";

// eslint-disable-next-line react/prop-types
const AddFullact = ({ update }) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringVegData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);

  const bringCurrencyData = useSelector(selectCurrencyEntities);
  const currencyLoading = useSelector(selectCurrencyLoading);

  // Inputs states
  const [hourPrice, setHourPrice] = useState(0);
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [act, setAct] = useState("");
  const [currency, setCurrency] = useState(
    doc(database, `users/${userId}/currency`, "00000000000000000000")
  );
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  // loading setting
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    vegsLoading === "loading" || currencyLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [vegsLoading, currencyLoading]);

  // Getting data and setting it to vegsData state
  const [vegsData, setVegsData] = useState([]);
  const [currencyData, setCurrencyData] = useState();
  useEffect(() => {
    dispatch(getVegs());
    dispatch(getCurrency());
  }, []);
  useEffect(() => {
    setVegsData(bringVegData);
  }, [bringVegData]);
  useEffect(() => {
    setCurrencyData(bringCurrencyData);
  }, [bringCurrencyData]);

  // filling the states on update
  useEffect(() => {
    if (update) {
      setLoading(true);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      const currencyDoc = doc(
        database,
        `users/${userId}/currency`,
        state.currencyId
      );
      setCurrency(currencyDoc);
      setAct(state.act);
      setHourPrice(Number(state.hourPrice));
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setLoading(false);
    }
  }, []);

  // onChange
  const onHourPriceChange = (e) => setHourPrice(Number(e.target.value));
  const onActChange = (e) => setAct(e.target.value);
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };

  // Handle submit
  const submitingObject = () => {
    let obj = {};
    obj.veg = veg;
    obj.act = act;
    obj.date = date;
    obj.currency = currency;
    obj.hourPrice = hourPrice;
    return { ...obj };
  };

  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/fullacts`, submitingObject);
    if (update)
      handleUpdating(
        setLoading,
        `${userId}/fullacts`,
        state.id,
        submitingObject
      );
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات المصاريف" : "إضافة مصاريف جديدة"}
        </h1>
        <form className="flex flex-col gap-2">
          <div>
            <label htmlFor="expensesAmount" className="block">
              أدخل سعر الساعة:
            </label>
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
          <div>
            <label htmlFor="act" className="block">
              أدخل العملية:
            </label>
            <Input
              id="act"
              name="act"
              type="text"
              placeholder="العملية..."
              value={update && act}
              onChange={onActChange}
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 items-center">
            <div>
              <label htmlFor="fullactVeg">الأصناف</label>
              <SelectMenu
                conectionName="vegs"
                data={vegsData && vegsData}
                listName="إختر صنف"
                setValue={() => setVeg}
                selectedItem={update && state.vegId}
              />
            </div>
            <div>
              <label htmlFor="currency">العملات</label>
              <SelectMenu
                conectionName="currency"
                data={currencyData && currencyData}
                listName="إختر عملة"
                setValue={() => setCurrency}
                selectedItem={update && state.currencyId}
              />
            </div>
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
