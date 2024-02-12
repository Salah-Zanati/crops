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
import AddingForm from "../styles/AddingForm.styled";

// eslint-disable-next-line react/prop-types
const AddFullact = ({ update }) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringVegData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);

  // Inputs states
  const [hourPrice, setHourPrice] = useState(0);
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [act, setAct] = useState("");
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
    <AddingForm>
      <div>
        <h1>{update ? "تعديل بيانات المصاريف" : "إضافة مصاريف جديدة"}</h1>
        <form>
          <div>
            <div>
              <label htmlFor="amount">أدخل سعر الساعة:</label>
              <Input
                id="amount"
                type="number"
                placeholder="سعر الساعة..."
                value={update && hourPrice}
                onChange={onHourPriceChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="act">أدخل العملية:</label>
              <Input
                id="act"
                type="text"
                placeholder="العملية..."
                value={update && act}
                onChange={onActChange}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <div>
              <label>الأصناف:</label>
              <SelectMenu
                conection="vegs"
                data={vegsData && vegsData}
                listName="إختر صنف"
                setValue={setVeg}
                existed={update && state.vegId}
              />
            </div>
            <div>
              <label htmlFor="date"> التاريخ: </label>
              <Input
                id="date"
                type="date"
                value={
                  date ? convertDate(date.toMillis()) : convertDate(new Date())
                }
                onChange={onDateChange}
                disabled={loading}
              />
            </div>
          </div>
          <Button.large
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
      </div>
    </AddingForm>
  );
};

export default AddFullact;
