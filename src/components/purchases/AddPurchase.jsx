import { useState } from "react";
import Input from "../styles/Input.styled";
import Button from "../styles/Button.styled";
import { database } from "../../firebaseConfig.js";
import "firebase/firestore";
import { doc, Timestamp } from "firebase/firestore";
import LoadingLine from "../animation/LoadingLine";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellers,
  selectSellersEntities,
  selectSellersLoading,
} from "../../toolkit/sellersSlice";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/vegsSlice";
import SelectMenu from "../styles/SelectMenu";
import { selectUserId } from "../../toolkit/loginSlice";
import {
  convertDate,
  handleAdding,
  handleUpdating,
} from "../../utils/functions";
import AddingForm from "../styles/AddingForm.styled.jsx";

// eslint-disable-next-line react/prop-types
const AddPurchase = ({ update }) => {
  const userId = useSelector(selectUserId);

  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  const [isPaid, setIsPaid] = useState(false);
  const [material, setMaterial] = useState("");
  const [seller, setSeller] = useState(
    doc(database, `users/${userId}/sellers`, "00000000000000000000")
  );
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [loading, setLoading] = useState(false);
  const [sellersData, setSellersData] = useState();
  const [vegsData, setVegsData] = useState();

  const dispatch = useDispatch();

  const bringSellersData = useSelector(selectSellersEntities);
  const bringVegsData = useSelector(selectVegsEntities);
  const sellersLoading = useSelector(selectSellersLoading);
  const vegsLoading = useSelector(selectVegsLoading);

  let { state } = useLocation();

  useEffect(() => {
    dispatch(getSellers());
    dispatch(getVegs());
  }, []);

  useEffect(() => {
    setSellersData(bringSellersData);
  }, [bringSellersData]);

  useEffect(() => {
    setVegsData(bringVegsData);
  }, [bringVegsData]);

  useEffect(() => {
    sellersLoading === "loading" || vegsLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [sellersLoading, vegsLoading]);

  useEffect(() => {
    if (update) {
      setLoading(true);
      setQuantity(state.quantity);
      setPrice(state.price);
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setIsPaid(state.isPaid);
      setMaterial(state.material);
      const sellerDoc = doc(
        database,
        `users/${userId}/sellers`,
        state.sellerId
      );
      setSeller(sellerDoc);
      const vegDoc = doc(database, `users/${userId}/vegs`, state.vegId);
      setVeg(vegDoc);
      setLoading(false);
    }
  }, []);
  const onQuantityChange = (e) => setQuantity(Number(e.target.value));
  const onMaterialChange = (e) => setMaterial(e.target.value);
  const onPriceChange = (e) => setPrice(Number(e.target.value));
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };
  const onIsPaidChange = () => setIsPaid(!isPaid);

  // Handle submit
  const submitingObject = () => {
    let obj = {};
    obj.veg = veg;
    obj.material = material;
    obj.quantity = quantity;
    obj.price = price;
    obj.date = date;
    obj.seller = seller;
    obj.isPaid = isPaid;
    return { ...obj };
  };
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/purchases`, submitingObject);
    if (update)
      handleUpdating(
        setLoading,
        `${userId}/purchases`,
        state.id,
        submitingObject
      );
  };

  return (
    <AddingForm>
      <div>
        <h1>{update ? "تعديل بيانات الفاتورة" : "إضافة فاتورة جديد"}</h1>
        <form>
          <div>
            <div>
              <label htmlFor="quantity">أدخل الكمية:</label>
              <Input
                id="quantity"
                type="number"
                placeholder="الكمية..."
                value={update && quantity}
                onChange={onQuantityChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="price">أدخل السعر:</label>
              <Input
                id="price"
                type="number"
                placeholder="السعر..."
                value={update && price}
                onChange={onPriceChange}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <div className="w-full">
              <label htmlFor="material">المواد:</label>
              <Input
                id="material"
                type="text"
                placeholder="المادة..."
                value={update && material}
                onChange={onMaterialChange}
                disabled={loading}
              />
            </div>
          </div>
          <div className="justify-between">
            <div>
              <label htmlFor="purchaseSeller">البائعين: </label>
              <SelectMenu
                conectionName="sellers"
                data={sellersData && sellersData}
                listName="إختر بائع"
                setValue={() => setSeller}
                selectedItem={update && state.sellerId}
              />
            </div>
            <div>
              <label htmlFor="purchaseVeg">الصنف: </label>
              <SelectMenu
                conectionName="vegs"
                data={vegsData && vegsData}
                listName="إختر صنف"
                setValue={() => setVeg}
                selectedItem={update && state.vegId}
              />
            </div>
          </div>
          <div className="d-p">
            <div>
              <label htmlFor="date">التاريخ: </label>
              <input
                id="date"
                type="date"
                value={
                  date ? convertDate(date.toMillis()) : convertDate(new Date())
                }
                onChange={onDateChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="paid">مسددة:</label>
              <input
                id="paid"
                type="checkbox"
                checked={isPaid}
                onChange={onIsPaidChange}
                disabled={loading}
              />
            </div>
          </div>

          <Button.large
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
      </div>
    </AddingForm>
  );
};

export default AddPurchase;
