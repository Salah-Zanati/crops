import { useEffect } from "react";
import Box from "../styles/Box.styled";
import Button from "../styles/Button.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loading from "../animation/Loading";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/VegsSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Vegs = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringVegsData = useSelector(selectVegsEntities);
  const vegsLoading = useSelector(selectVegsLoading);
  const [vegsData, setVegsData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getVegs());
  }, []);
  useEffect(() => {
    setVegsData(bringVegsData);
  }, [bringVegsData]);

  if (loading) return <Loading />;

  return (
    <Box className="flex-col gap-5 relative">
      <div className="flex justify-between">
        <Button.large>
          <Link to="/home/addVeg">إضافة صنف</Link>
        </Button.large>
        <div className="flex justify-center items-center gap-5">
          <label>مربع البحث: </label>
          <Input
            className="bg-white self-start"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table className="p-3 rounded-2xl bg-white">
        <thead>
          <tr>
            <th>إسم الصنف</th>
            <th>عمليات</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {vegsLoading === "loading" && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {vegsData &&
            vegsLoading !== "loading" &&
            vegsData
              .filter((veg) => veg.name.includes(searchTerm))
              .map((veg) => (
                <tr key={veg.id}>
                  <td key="1">{veg.name}</td>
                  <td key="2" className="flex gap-2 justify-center">
                    <Button.small>
                      <Link to="/home/updataVeg" state={veg}>
                        تعديل
                      </Link>
                    </Button.small>
                    <Button.small
                      onClick={() => {
                        const sure = confirm("هل أنت متأكد من الحذف.");
                        if (sure) {
                          handleDeleting(
                            setLoading,
                            `${userId}/vegs`,
                            veg.id,
                            dispatch,
                            getVegs
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
    </Box>
  );
};

export default Vegs;
