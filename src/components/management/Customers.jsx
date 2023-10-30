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
  getCustomers,
  selectCustomersEntities,
  selectCustomersLoading,
} from "../../toolkit/customersSlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

const Customer = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringCustomersData = useSelector(selectCustomersEntities);
  const customersLoading = useSelector(selectCustomersLoading);
  const [customersData, setCustomersData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getCustomers());
  }, []);
  useEffect(() => {
    setCustomersData(bringCustomersData);
  }, [bringCustomersData]);

  if (loading) return <Loading />;

  return (
    <Box className="flex-col gap-5 relative">
      <div className="flex justify-between">
        <Button.large>
          <Link to="/home/addCustomer">إضافة زبون</Link>
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
          {customersLoading === "loading" && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {customersData &&
            customersLoading !== "loading" &&
            customersData
              .filter((customer) => {
                const customerValues = Object.values(customer);
                return customerValues.some((value) =>
                  value
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              })
              .map((customer) => (
                <tr key={customer.id}>
                  <td key="1">{customer.name}</td>
                  <td key="2">{customer.des}</td>
                  <td key="3">{customer.phone}</td>
                  <td key="4" className="flex gap-2 justify-center">
                    <Button.small>صورة</Button.small>
                    <Button.small>
                      <Link to="/home/updataCustomer" state={customer}>
                        تعديل
                      </Link>
                    </Button.small>
                    <Button.small
                      onClick={() => {
                        const sure = confirm("هل أنت متأكد من الحذف.");
                        if (sure) {
                          handleDeleting(
                            setLoading,
                            `${userId}/cutsomers`,
                            customer.id,
                            dispatch,
                            getCustomers
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

export default Customer;
