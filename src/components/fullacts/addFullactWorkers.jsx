import { useLocation } from "react-router-dom";
import Box from "../styles/Box.styled";
import Container from "../styles/Container.styled";
import Input from "../styles/Input.styled";
import { useDispatch, useSelector } from "react-redux";
import {
  getWorkers,
  selectWorkersEntities,
  selectWorkersLoading,
} from "../../toolkit/workersSlice";
import { useState } from "react";
import { useEffect } from "react";
import { doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Button from "../styles/Button.styled";
import LoadingLine from "../animation/LoadingLine";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleAdding, handleUpdating } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddFullactWorkers = ({ update }) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const fullactId = state.fullactId;
  const bringWorkerData = useSelector(selectWorkersEntities);
  const workersLoading = useSelector(selectWorkersLoading);

  // inputs states
  const [hoursNum, setHoursNum] = useState(0);
  const [worker, setWorker] = useState(
    doc(database, `users/${userId}/workers`, "00000000000000000000")
  );
  const [isPaid, setIsPaid] = useState(false);

  // Loading setting
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    workersLoading === "loading" ? setLoading(true) : setLoading(false);
  }, [workersLoading]);

  // Getting workers data and set it to a state
  const [workersData, setWorkersData] = useState([]);
  useEffect(() => {
    dispatch(getWorkers());
  }, []);
  useEffect(() => {
    setWorkersData(bringWorkerData);
  }, [bringWorkerData]);

  // filling the states on update
  useEffect(() => {
    if (update) {
      setLoading(true);
      const workerDoc = doc(
        database,
        `users/${userId}/workers`,
        state.workerId
      );
      setWorker(workerDoc);
      setHoursNum(Number(state.hoursNum));
      setIsPaid(state.isPaid);
      setLoading(false);
    }
  }, []);

  // onChange
  const onHoursNumChange = (e) => setHoursNum(Number(e.target.value));
  const onIsPaidChange = () => setIsPaid(!isPaid);

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(
        setLoading,
        `${userId}/fullacts/${fullactId}/fullactWorkers`,
        {
          hoursNum,
          worker,
          isPaid,
        }
      );
    if (update)
      handleUpdating(
        setLoading,
        `${userId}/fullacts/${fullactId}/fullactWorkers`,
        state.id,
        {
          hoursNum,
          worker,
          isPaid,
        }
      );
  };

  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات العامل" : "إضافة عامل"}
        </h1>
        <form className="flex flex-col gap-2">
          <div className="">
            <label htmlFor="fullactWorkersHoursNum">أدخل عدد الساعات: </label>
            <Input
              id="fullactWorkersHoursNum"
              name="fullactWorkersHoursNum"
              type="number"
              placeholder="عدد الساعات..."
              value={update && hoursNum}
              onChange={onHoursNumChange}
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="fullactWorkersWorker">إختر العامل: </label>
            <SelectMenu
              conectionName="workers"
              data={workersData && workersData}
              listName="إختر عامل"
              setValue={() => setWorker}
              selectedItem={update && state.workerId}
            />
          </div>
          <div className="flex gap-5 items-center">
            <label htmlFor="fullactWorkersIsPaid">
              مسددة ام لا:{" "}
              <Input
                id="fullactWorkersIsPaid"
                name="fullactWorkersIsPaid"
                type="checkbox"
                checked={isPaid}
                onChange={onIsPaidChange}
                disabled={loading}
              />
            </label>
          </div>
          <Button.large
            id="addFullactWorkersSubmitBtn"
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

export default AddFullactWorkers;
