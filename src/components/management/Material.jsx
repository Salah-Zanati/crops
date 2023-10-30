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
  getMaterial,
  selectMaterialEntities,
  selectMaterialLoading,
} from "../../toolkit/materialSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Material = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringMaterialData = useSelector(selectMaterialEntities);
  const materialLoading = useSelector(selectMaterialLoading);
  const [materialData, setMaterialData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getMaterial());
  }, []);
  useEffect(() => {
    setMaterialData(bringMaterialData);
  }, [bringMaterialData]);

  if (loading) return <Loading />;

  return (
    <Box className="flex-col gap-5 relative">
      <div className="flex justify-between">
        <Button.large>
          <Link to="/home/addMaterial">إضافة مادة</Link>
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
            <th>إسم المادة</th>
            <th>عمليات</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {materialLoading === "loading" && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {materialData &&
            materialLoading !== "loading" &&
            materialData
              .filter((material) => material.name.includes(searchTerm))
              .map((material) => (
                <tr key={material.id}>
                  <td key="1">{material.name}</td>
                  <td key="2" className="flex gap-2 justify-center">
                    <Button.small>
                      <Link to="/home/updataMaterial" state={material}>
                        تعديل
                      </Link>
                    </Button.small>
                    <Button.small
                      onClick={() => {
                        const sure = confirm("هل أنت متأكد من الحذف.");
                        if (sure) {
                          handleDeleting(
                            setLoading,
                            `${userId}/material`,
                            material.id,
                            dispatch,
                            getMaterial
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

export default Material;
