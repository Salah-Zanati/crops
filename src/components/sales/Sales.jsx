import Table from "../styles/Table.styled";
import Input from "../styles/Input.styled";
import Button from "../styles/Button.styled";
import Container from "../styles/Container.styled";
import Box from "../styles/Box.styled";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getSales,
  selectSalesEntities,
  selectSalesLoading,
} from "../../toolkit/salesSlice";
import { useState } from "react";
import Loading from "../animation/Loading";
import { database } from "../../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Sales = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const [salesData, setSalesData] = useState();
  const [loading, setLoading] = useState(false);
  const bringSalesData = useSelector(selectSalesEntities);
  const salesLoading = useSelector(selectSalesLoading);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getSales());
  }, []);
  useEffect(() => {
    setSalesData(bringSalesData);
  }, [bringSalesData]);

  if (loading) return <Loading />;

  return (
    <Container className="p-5">
      <Box className="flex-col gap-5">
        <div className="flex justify-between gap-5 mt-2">
          <Button.large onClick={() => {}}>
            <Link to="/sales/addSale">إضافة فاتورة جديدة</Link>
          </Button.large>
          <div className="flex justify-start items-center gap-3">
            <p>مربع البحث: </p>
            <Input
              placeholder="بحث..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>

        <Table className="p-3 rounded-2xl bg-white">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
              <th>التاريخ</th>
              <th>الزبون</th>
              <th>مسددة ام لا</th>
              <th>عمليات</th>
            </tr>
          </thead>
          <tbody>
            {salesLoading === "loading" && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
            {salesData &&
              salesLoading !== "loading" &&
              salesData
                .filter((sale) => {
                  const saleValues = Object.values(sale);
                  return saleValues.some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                })
                .map((sale) => (
                  <tr key={sale.id}>
                    <td key="1">{sale.vegName}</td>
                    <td key="3">{sale.price}</td>
                    <td key="2">{sale.quantity}</td>
                    <td key="8">{(sale.price * sale.quantity).toFixed(2)}</td>
                    <td key="4">{sale.date}</td>
                    <td key="5">
                      {sale.customerName ? sale.customerName : "غير معروف"}
                    </td>
                    <td key="6">{sale.isPaid ? "مسددة" : "غير مسددة"}</td>
                    <td key="7" className="flex gap-2 justify-center">
                      <Button.small>
                        <Link to="/sales/updataSale" state={sale}>
                          تعديل
                        </Link>
                      </Button.small>
                      <Button.small
                        onClick={() => {
                          const sure = confirm("هل أنت متأكد من الحذف.");
                          if (sure) {
                            handleDeleting(
                              setLoading,
                              `${userId}/sales`,
                              sale.id,
                              dispatch,
                              getSales
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
    </Container>
  );
};

export default Sales;
