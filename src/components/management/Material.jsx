import { useEffect } from "react";
import Button from "../styles/Button.styled";
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

// eslint-disable-next-line react/prop-types
const Material = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringMaterialData = useSelector(selectMaterialEntities);
  const materialLoading = useSelector(selectMaterialLoading);
  const [materialData, setMaterialData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getMaterial());
  }, []);
  useEffect(() => {
    setMaterialData(bringMaterialData);
  }, [bringMaterialData]);

  if (loading) return <Loading />;

  return (
    <Table>
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
                    <Link
                      to="/home/updataMaterial"
                      state={{ ...material, chossed: "material" }}
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
  );
};

export default Material;
