import { useEffect } from "react";
import Button from "../styles/Button.styled";
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

// eslint-disable-next-line react/prop-types
const Sellers = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringSellersData = useSelector(selectSellersEntities);
  const sellersLoading = useSelector(selectSellersLoading);
  const [sellersData, setSellersData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getSellers());
  }, []);
  useEffect(() => {
    setSellersData(bringSellersData);
  }, [bringSellersData]);

  if (loading) return <Loading />;

  return (
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
  );
};

export default Sellers;
