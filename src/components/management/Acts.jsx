import { useEffect } from "react";
import Button from "../styles/Button.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Loading from "../animation/Loading";
import {
  getActs,
  selectActsEntities,
  selectActsLoading,
} from "../../toolkit/actsSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const Acts = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringActsData = useSelector(selectActsEntities);
  const actsLoading = useSelector(selectActsLoading);
  const [actsData, setActsData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getActs());
  }, []);
  useEffect(() => {
    setActsData(bringActsData);
  }, [bringActsData]);

  if (loading) return <Loading />;

  return (
    <Table className="p-3 rounded-2xl bg-white">
      <thead>
        <tr>
          <th>إسم العملية</th>
          <th>عمليات</th>
        </tr>
      </thead>
      <tbody id="tbody">
        {actsLoading === "loading" && (
          <tr>
            <td>
              <Loading />
            </td>
          </tr>
        )}
        {actsData &&
          actsLoading !== "loading" &&
          actsData
            .filter((act) => act.name.includes(searchTerm.toLowerCase()))
            .map((act) => (
              <tr key={act.id}>
                <td key="1">{act.name}</td>
                <td key="2" className="flex gap-2 justify-center">
                  <Button.small>
                    <Link
                      to="/home/updataAct"
                      state={{ ...act, chossed: "acts" }}
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
                          `${userId}/acts`,
                          act.id,
                          dispatch,
                          getActs
                        );
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
  );
};

export default Acts;
