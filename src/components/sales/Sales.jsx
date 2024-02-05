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
    <Container className="p-5 mb-10">
      <Box>
        <div className="flex justify-between flex-col items-center gap-2 mb-2 sm:flex-row">
          <Button.large onClick={() => {}}>
            <Link to="/sales/addSale">إضافة فاتورة جديدة</Link>
          </Button.large>
          <Input
            placeholder="بحث..."
            className="!w-fit"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <Table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th className="hidden md:block">السعر</th>
              <th className="hidden md:block">الكمية</th>
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
                .sort(function (a, b) {
                  return new Date(b.date) - new Date(a.date);
                })
                .map((sale) => {
                  return (
                    <tr key={sale.id}>
                      <td key="1">{sale.vegName}</td>
                      <td className="hidden md:block" key="3">
                        {sale.price} {sale.currencyName}
                      </td>
                      <td className="hidden md:block" key="2">
                        {sale.quantity}
                      </td>
                      <td key="8">
                        {(sale.price * sale.quantity).toFixed(2)}{" "}
                        {sale.currencyName}
                      </td>
                      <td key="4">{sale.date}</td>
                      <td key="5">
                        {sale.customerName ? sale.customerName : "غير معروف"}
                      </td>
                      <td key="6">{sale.isPaid ? "مسددة" : "غير مسددة"}</td>
                      <td
                        key="7"
                        className="flex gap-2 justify-center flex-wrap"
                      >
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
                  );
                })}
          </tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default Sales;
