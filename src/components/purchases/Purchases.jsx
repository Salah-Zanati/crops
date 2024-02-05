import { Link } from "react-router-dom";
import Button from "../styles/Button.styled";
import Input from "../styles/Input.styled";
import Table from "../styles/Table.styled";
import Container from "../styles/Container.styled";
import Box from "../styles/Box.styled";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../animation/Loading";

import {
  getPurchases,
  selectPurchasesEntities,
  selectPurchasesLoading,
} from "../../toolkit/purchasesSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Purchases = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const [purchasesData, setPurchasesData] = useState();
  const [loading, setLoading] = useState(false);
  const bringPurchasesData = useSelector(selectPurchasesEntities);
  const purchasesLoading = useSelector(selectPurchasesLoading);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getPurchases());
  }, []);
  useEffect(() => {
    setPurchasesData(bringPurchasesData);
  }, [bringPurchasesData]);

  if (loading) return <Loading />;

  return (
    <Container className="p-5 mb-10">
      <Box>
        <div className="flex justify-between items-center flex-col gap-2 mb-2 sm:flex-row">
          <Button.large>
            <Link to="/purchases/addPurchase">إضافة فاتورة جديدة</Link>
          </Button.large>
          <Input
            type="text"
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
              <th>الشراء</th>
              <th className="hidden md:block">الكمية</th>
              <th className="hidden md:block">السعر</th>
              <th>الإجمالي</th>
              <th className="hidden md:block">الصنف</th>
              <th>التاريخ</th>
              <th>البائع</th>
              <th>مسددة ام لا</th>
              <th>عمليات</th>
            </tr>
          </thead>
          <tbody>
            {purchasesLoading === "loading" && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
            {purchasesData &&
              purchasesLoading !== "loading" &&
              purchasesData
                .filter((purchase) => {
                  const purchaseValues = Object.values(purchase);
                  return purchaseValues.some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                })
                .sort(function (a, b) {
                  return new Date(b.date) - new Date(a.date);
                })
                .map((purchase) => {
                  return (
                    <tr key={purchase.id}>
                      <td key="1">{purchase.material}</td>
                      <td className="hidden md:block" key="2">
                        {purchase.quantity}
                      </td>
                      <td className="hidden md:block" key="3">
                        {purchase.price} {purchase.currencyName}
                      </td>
                      <td key="8">
                        {purchase.price * purchase.quantity}{" "}
                        {purchase.currencyName}
                      </td>
                      <td className="hidden md:block" key="9">
                        {purchase.vegName}
                      </td>
                      <td key="4">{purchase.date}</td>
                      <td key="5">
                        {purchase.sellerName
                          ? purchase.sellerName
                          : "غير معروف"}
                      </td>
                      <td key="6">{purchase.isPaid ? "مسددة" : "غير مسددة"}</td>
                      <td
                        key="7"
                        className="flex gap-2 justify-center flex-wrap"
                      >
                        <Button.small>
                          <Link to="/purchases/updataPurchase" state={purchase}>
                            تعديل
                          </Link>
                        </Button.small>
                        <Button.small
                          onClick={() => {
                            const sure = confirm("هل أنت متأكد من الحذف.");
                            if (sure) {
                              handleDeleting(
                                setLoading,
                                `${userId}/purchases`,
                                purchase.id,
                                dispatch,
                                getPurchases
                              );
                            }
                          }}
                        >
                          حذف
                        </Button.small>
                        {/* <Button.small>
                          <Link to="/expenses" state={purchase}>
                            مصاريف
                          </Link>
                        </Button.small> */}
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

export default Purchases;
