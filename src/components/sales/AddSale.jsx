import { useState } from "react";
import Input from "../styles/Input.styled";
import Box from "../styles/Box.styled";
import Container from "../styles/Container.styled";
import Button from "../styles/Button.styled";
import { database } from "../../firebaseConfig.js";
import "firebase/firestore";
import { doc, Timestamp } from "firebase/firestore";
import LoadingLine from "../animation/LoadingLine";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/vegsSlice";
import {
  getCustomers,
  selectCustomersEntities,
  selectCustomersLoading,
} from "../../toolkit/customersSlice";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import {
  convertDate,
  handleAdding,
  handleUpdating,
} from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const AddSale = ({ update }) => {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const bringVegsData = useSelector(selectVegsEntities);
  const bringCustomersData = useSelector(selectCustomersEntities);
  const vegsLoading = useSelector(selectVegsLoading);
  const customersLoading = useSelector(selectCustomersLoading);

  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  const [isPaid, setIsPaid] = useState(false);
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [customer, setCustomer] = useState(
    doc(database, `users/${userId}/customers`, "00000000000000000000")
  );
  const [loading, setLoading] = useState(false);
  const [vegsData, setVegsData] = useState();
  const [customersData, setCustomersData] = useState();

  let { state } = useLocation();

  useEffect(() => {
    dispatch(getVegs());
    dispatch(getCustomers());
  }, []);

  useEffect(() => {
    setCustomersData(bringCustomersData);
  }, [bringCustomersData]);

  useEffect(() => {
    setVegsData(bringVegsData);
  }, [bringVegsData]);

  useEffect(() => {
    vegsLoading === "loading" ? setLoading(true) : setLoading(false);
    customersLoading === "loading" ? setLoading(true) : setLoading(false);
  }, [vegsLoading, customersLoading]);

  useEffect(() => {
    if (update) {
      setQuantity(state.quantity);
      setPrice(state.price);
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setIsPaid(state.isPaid);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      const customerDoc = doc(
        database,
        `users/${userId}/customers`,
        state.customerId
      );
      setCustomer(customerDoc);
    }
  }, []);
  const onQuantityChange = (e) => setQuantity(e.target.value);
  const onPriceChange = (e) => setPrice(e.target.value);
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };
  const onIsPaidChange = () => setIsPaid(!isPaid);

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/sales`, {
        veg,
        quantity,
        price,
        date,
        customer,
        isPaid,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/sales`, state.id, {
        veg,
        quantity,
        price,
        date,
        customer,
        isPaid,
      });
  };
  return (
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات الفاتورة" : "إضافة فاتورة جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <div className="flex gap-5 items-start flex-col sm:flex-row sm:items-center">
            <div>
              <label htmlFor="saleQuanity" className="block">
                أدخل الكمية:{" "}
              </label>
              <Input
                id="saleQuantity"
                name="saleQuantity"
                type="number"
                placeholder="الكمية..."
                value={quantity}
                onChange={onQuantityChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block">
                أدخل السعر:{" "}
              </label>
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                placeholder="السعر..."
                value={price}
                onChange={onPriceChange}
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <div>
              <label htmlFor="saleVeg">الأصناف: </label>
              <SelectMenu
                conectionName="vegs"
                data={vegsData && vegsData}
                listName="إختر صنف"
                setValue={() => setVeg}
                selectedItem={update && state.vegId}
              />
            </div>
            <div>
              <label htmlFor="saleCustomer">الزبائن: </label>
              <SelectMenu
                conectionName="customers"
                data={customersData && customersData}
                listName="إختر زبون"
                setValue={() => setCustomer}
                selectedItem={update && state.customerId}
              />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <div>
              <label htmlFor="saleDate">أدخل التاريخ: </label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                value={
                  date ? convertDate(date.toMillis()) : convertDate(new Date())
                }
                onChange={onDateChange}
                disabled={loading}
              />
            </div>
            <label htmlFor="saleIsPaid" className="flex items-center gap-3">
              مسددة أم لا :
              <Input
                id="saleIsPaid"
                name="saleIsPaid"
                type="checkbox"
                placeholder="مسددة أم لا..."
                checked={isPaid}
                onChange={onIsPaidChange}
                disabled={loading}
              />
            </label>
          </div>

          <Button.large
            id="addSaleSubmitBtn"
            type="button"
            onClick={() => {
              handleSubmitBtn();
            }}
          >
            {!loading && !update && "إرسال"}
            {loading && <LoadingLine />}
            {!loading && update && "تعديل"}
          </Button.large>
        </form>
      </Box>
    </Container>
  );
};

export default AddSale;
