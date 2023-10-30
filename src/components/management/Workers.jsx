import { useEffect } from "react";
import {
  getWorkers,
  selectWorkersEntities,
  selectWorkersLoading,
} from "../../toolkit/workersSlice";
import Box from "../styles/Box.styled";
import Button from "../styles/Button.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Loading from "../animation/Loading";
import { selectUserId } from "../../toolkit/loginSlice";

// eslint-disable-next-line react/prop-types
const Workers = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringWorkersData = useSelector(selectWorkersEntities);
  const workersLoading = useSelector(selectWorkersLoading);
  const [workersData, setWorkersData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getWorkers());
  }, []);
  useEffect(() => {
    setWorkersData(bringWorkersData);
  }, [bringWorkersData]);

  if (loading) return <Loading />;

  return (
    <>
      <Table className="p-3 rounded-2xl bg-white">
        <thead>
          <tr>
            <th>الإسم</th>
            <th>رقم الهاتف</th>
            <th>عمليات</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {workersLoading === "loading" && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {workersData &&
            workersLoading !== "loading" &&
            workersData
              .filter((worker) => {
                const workerValues = Object.values(worker);
                return workerValues.some((value) =>
                  value
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              })
              .map((worker) => (
                <tr key={worker.id}>
                  <td key="1">{worker.name}</td>
                  <td key="2">{worker.phone}</td>
                  <td key="3" className="flex gap-2 justify-center">
                    <Button.small>صورة</Button.small>
                    <Button.small>
                      <Link to="/home/updataWorker" state={worker}>
                        تعديل
                      </Link>
                    </Button.small>
                    <Button.small
                      onClick={() => {
                        const sure = confirm("هل أنت متأكد من الحذف.");
                        const docToDelete = doc(
                          database,
                          `users/${userId}/workers`,
                          worker.id
                        );
                        if (sure) {
                          setLoading(true);
                          deleteDoc(docToDelete)
                            .then(() => {
                              setLoading(false);
                              dispatch(getWorkers());
                            })
                            .catch((err) => {
                              alert(err.message);
                            });
                        }
                      }}
                    >
                      حذف
                    </Button.small>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </>
  );
};

export default Workers;
