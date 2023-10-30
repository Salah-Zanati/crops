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
import {
  getGroups,
  selectGroupsEntities,
  selectGroupsLoading,
} from "../../toolkit/groupsSlice";
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
const AddGroupsAct = ({ update }) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringVegData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);
  const bringActData = useSelector(selectActsEntities);
  const actsLoading = useSelector(selectActsLoading);
  const bringGroupData = useSelector(selectGroupsEntities);
  const groupsLoading = useSelector(selectGroupsLoading);

  // Inputs states
  const [hourPrice, setHourPrice] = useState(0);
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [act, setAct] = useState(
    doc(database, `users/${userId}/acts`, "00000000000000000000")
  );
  const [group, setGroup] = useState(
    doc(database, `users/${userId}/groups`, "00000000000000000000")
  );
  const [hoursNum, setHoursNum] = useState(0);
  const [workersNum, setWorkersNum] = useState(0);
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  const [isPaid, setIsPaid] = useState(false);

  // loading setting
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    vegsLoading === "loading" ||
    actsLoading === "loading" ||
    groupsLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [vegsLoading, actsLoading, groupsLoading]);

  // Getting data and setting it to vegsData state
  const [vegsData, setVegsData] = useState([]);
  const [actsData, setActsData] = useState([]);
  const [groupsData, setgroupsData] = useState([]);

  useEffect(() => {
    dispatch(getVegs());
    dispatch(getActs());
    dispatch(getGroups());
  }, []);
  useEffect(() => {
    setVegsData(bringVegData);
  }, [bringVegData]);
  useEffect(() => {
    setActsData(bringActData);
  }, [bringActData]);
  useEffect(() => {
    setgroupsData(bringGroupData);
  }, [bringGroupData]);

  // filling the states on update
  useEffect(() => {
    if (update) {
      setLoading(true);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      const actDoc = doc(database, `users/${userId}/acts`, state.actId);
      setAct(actDoc);
      const groupDoc = doc(database, `users/${userId}/groups`, state.groupId);
      setGroup(groupDoc);
      setHourPrice(Number(state.hourPrice));
      setWorkersNum(Number(state.workersNum));
      setHourPrice(Number(state.hourPrice));
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setIsPaid(state.isPaid);
      setLoading(false);
    }
  }, []);

  // onChange
  const onHourPriceChange = (e) => setHourPrice(Number(e.target.value));
  const onHoursNumChagne = (e) => setHoursNum(Number(e.target.value));
  const onWorkersNumChange = (e) => setWorkersNum(Number(e.target.value));
  const onIsPaidChange = () => setIsPaid(!isPaid);
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/groupsActs`, {
        act,
        veg,
        group,
        hoursNum,
        workersNum,
        hourPrice,
        isPaid,
        date,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/groupsActs`, state.id, {
        act,
        veg,
        group,
        hoursNum,
        workersNum,
        hourPrice,
        isPaid,
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
            <label htmlFor="hourPrice">أدخل سعر الساعة: </label>
            <Input
              id="hourPrice"
              name="hourPrice"
              type="number"
              className="w-36"
              placeholder="سعر الساعة..."
              value={update && hourPrice}
              onChange={onHourPriceChange}
              disabled={loading}
            />
            <label htmlFor="workersNum">أدخل عدد العمال: </label>
            <Input
              id="workersNum"
              name="workersNum"
              type="number"
              className="w-36"
              placeholder="عدد العمال..."
              value={update && workersNum}
              onChange={onWorkersNumChange}
              disabled={loading}
            />
            <label htmlFor="hoursNum">أدخل عدد الساعات: </label>
            <Input
              id="hoursNum"
              name="hoursNum"
              type="number"
              className="w-36"
              placeholder="عدد الساعات..."
              value={update && hoursNum}
              onChange={onHoursNumChagne}
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="groupsActAct">العمليات</label>
            <SelectMenu
              conectionName="acts"
              data={actsData && actsData}
              listName="إختر عملية"
              setValue={() => setAct}
              selectedItem={update && state.actId}
            />
            <label htmlFor="groupsActVeg">الأصناف</label>
            <SelectMenu
              conectionName="vegs"
              data={vegsData && vegsData}
              listName="إختر صنف"
              setValue={() => setVeg}
              selectedItem={update && state.vegId}
            />
            <label htmlFor="groupsActVeg">الورشة</label>
            <SelectMenu
              conectionName="groups"
              data={groupsData && groupsData}
              listName="إختر ورشة"
              setValue={() => setGroup}
              selectedItem={update && state.groupId}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="groupsActDate">أدخل التاريخ: </label>
            <Input
              id="groupsActDate"
              name="groupsActDate"
              type="date"
              value={
                date ? convertDate(date.toMillis()) : convertDate(new Date())
              }
              onChange={onDateChange}
              disabled={loading}
            />
            <label htmlFor="isPaid">مسددة ام لا:</label>
            <Input
              id="isPaid"
              name="isPaid"
              type="checkbox"
              checked={isPaid}
              onChange={onIsPaidChange}
              disabled={loading}
            />
          </div>
          <Button.large
            id="addGroupsActSubmitBtn"
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

export default AddGroupsAct;
