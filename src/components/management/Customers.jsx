import { useEffect } from "react";
import Button from "../styles/Button.styled";
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

// eslint-disable-next-line react/prop-types
const Customer = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringCustomersData = useSelector(selectCustomersEntities);
  const customersLoading = useSelector(selectCustomersLoading);
  const [customersData, setCustomersData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getCustomers());
  }, []);
  useEffect(() => {
    setCustomersData(bringCustomersData);
  }, [bringCustomersData]);

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
            .map((customer) => {
              return (
                <tr key={customer.id}>
                  <td key="1">{customer.name}</td>
                  <td key="2">{customer.des}</td>
                  <td key="3">{customer.phone}</td>
                  <td key="4" className="flex gap-2 justify-center">
                    <Button.small>صورة</Button.small>
                    <Button.small>
                      <Link
                        to="/home/updataCustomer"
                        state={{ ...customer, chossed: "customers" }}
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
                            `${userId}/customers`,
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
              );
            })}
      </tbody>
    </Table>
  );
};

export default Customer;
