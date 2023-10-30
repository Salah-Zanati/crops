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
  getSellers,
  selectSellersEntities,
  selectSellersLoading,
} from "../../toolkit/sellersSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Sellers = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringSellersData = useSelector(selectSellersEntities);
  const sellersLoading = useSelector(selectSellersLoading);
  const [sellersData, setSellersData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getSellers());
  }, []);
  useEffect(() => {
    setSellersData(bringSellersData);
  }, [bringSellersData]);

  if (loading) return <Loading />;

  return (
    <Box className="flex-col gap-5 relative">
      <div className="flex justify-between">
        <Button.large>
          <Link to="/home/addSeller">إضافة بائع</Link>
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
            <th>الإسم</th>
            <th>الصفة</th>
            <th>رقم الهاتف</th>
            <th>عمليات</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {sellersLoading === "loading" && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {sellersData &&
            sellersLoading !== "loading" &&
            sellersData
              .filter((seller) => {
                const sellerValues = Object.values(seller);
                return sellerValues.some((value) =>
                  value
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              })
              .map((seller) => (
                <tr key={seller.id}>
                  <td key="1">{seller.name}</td>
                  <td key="2">{seller.des}</td>
                  <td key="3">{seller.phone}</td>
                  <td key="4" className="flex gap-2 justify-center">
                    <Button.small>صورة</Button.small>
                    <Button.small>
                      <Link to="/home/updataSeller" state={seller}>
                        تعديل
                      </Link>
                    </Button.small>
                    <Button.small
                      onClick={() => {
                        const sure = confirm("هل أنت متأكد من الحذف.");
                        if (sure) {
                          handleDeleting(
                            setLoading,
                            `${userId}/groupsActs`,
                            seller.id,
                            dispatch,
                            getSellers
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

export default Sellers;
