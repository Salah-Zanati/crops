import { useLocation } from "react-router-dom";
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
import { selectUserId } from "../../toolkit/loginSlice";
import { handleAdding, handleUpdating } from "../../utils/functions";
import AddingForm from "../styles/AddingForm.styled";
import SelectManyMenu from "../styles/SelectManyMenu";
import SelectMenu from "../styles/SelectMenu";

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
  const [workersGroup, setWorkersGroup] = useState([]);

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
  const submitingObject = (worker) => {
    let obj = {};
    obj.hoursNum = hoursNum;
    obj.worker = worker;
    obj.isPaid = isPaid;
    return { ...obj };
  };
  const handleSubmitBtn = () => {
    // console.log(workersGroup);
    if (!update) {
      workersGroup.forEach((e) => {
        const workerDoc = doc(database, `users/${userId}/workers`, e.id);
        handleAdding(
          setLoading,
          `${userId}/fullacts/${fullactId}/fullactWorkers`,
          () => submitingObject(workerDoc)
        );
      });
    }
    if (update) {
      handleUpdating(
        setLoading,
        `${userId}/fullacts/${fullactId}/fullactWorkers`,
        state.id,
        () => submitingObject(worker)
      );
    }
  };

  return (
    <AddingForm>
      <div>
        <h1>{update ? "تعديل بيانات العامل" : "إضافة عامل"}</h1>
        <form>
          <div>
            <div>
              <label htmlFor="hoursNum">أدخل عدد الساعات: </label>
              <Input
                id="hoursNum"
                type="number"
                placeholder="عدد الساعات..."
                value={update && hoursNum}
                onChange={onHoursNumChange}
                disabled={loading}
              />
            </div>
            <div>
              <label>إختر عامل:</label>
              {update ? (
                <SelectMenu
                  conection="workers"
                  data={workersData && workersData}
                  listName="إختر عامل"
                  setValue={setWorker}
                  existed={update && state.workerId}
                />
              ) : (
                <SelectManyMenu
                  listName="العمال"
                  data={workersData && workersData}
                  setWorkersGroup={setWorkersGroup}
                />
              )}
            </div>
          </div>
          <div className="d-p">
            <div className="!basis-0">
              <label htmlFor="paid">مسددة:</label>
              <Input
                id="paid"
                type="checkbox"
                checked={isPaid}
                onChange={onIsPaidChange}
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

export default AddFullactWorkers;
