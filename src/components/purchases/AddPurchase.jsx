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
import {
  getCurrency,
  selectCurrencyEntities,
  selectCurrencyLoading,
} from "../../toolkit/currencySlice.js";

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
  const [currency, setCurrency] = useState(
    doc(database, `users/${userId}/currency`, "00000000000000000000")
  );
  const [loading, setLoading] = useState(false);
  const [sellersData, setSellersData] = useState();
  const [vegsData, setVegsData] = useState();
  const [currencyData, setCurrencyData] = useState();

  const dispatch = useDispatch();

  const bringSellersData = useSelector(selectSellersEntities);
  const bringVegsData = useSelector(selectVegsEntities);
  const sellersLoading = useSelector(selectSellersLoading);
  const vegsLoading = useSelector(selectVegsLoading);
  const bringCurrencyData = useSelector(selectCurrencyEntities);
  const currencyLoading = useSelector(selectCurrencyLoading);

  let { state } = useLocation();

  useEffect(() => {
    dispatch(getSellers());
    dispatch(getVegs());
    dispatch(getCurrency());
  }, []);

  useEffect(() => {
    setSellersData(bringSellersData);
  }, [bringSellersData]);

  useEffect(() => {
    setVegsData(bringVegsData);
  }, [bringVegsData]);

  useEffect(() => {
    setCurrencyData(bringCurrencyData);
  }, [bringCurrencyData]);

  useEffect(() => {
    sellersLoading === "loading" ||
    vegsLoading === "loading" ||
    currencyLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [sellersLoading, vegsLoading, currencyLoading]);

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
      const currencyDoc = doc(
        database,
        `users/${userId}/currency`,
        state.currencyId
      );
      setCurrency(currencyDoc);
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
    obj.currency = currency;
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
    <Container className="my-5">
      <Box className="rounded-xl flex-col">
        <h1 className="font-bold text-xl">
          {update ? "تعديل بيانات الفاتورة" : "إضافة فاتورة جديد"}
        </h1>
        <form className="flex flex-col gap-2">
          <div className="flex gap-5 items-center flex-wrap">
            <div>
              <label htmlFor="purchaseQuanity" className="block">
                أدخل الكمية:{" "}
              </label>
              <Input
                id="purchaseQuantity"
                name="purchaseQuantity"
                type="number"
                placeholder="الكمية..."
                value={update && quantity}
                onChange={onQuantityChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block">
                أدخل السعر:{" "}
              </label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                placeholder="السعر..."
                value={update && price}
                onChange={onPriceChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="purchaseMaterial" className="block">
                المواد:{" "}
              </label>
              <Input
                id="purchaseMaterial"
                name="purchaseMaterial"
                type="text
              "
                placeholder="المادة..."
                value={update && material}
                onChange={onMaterialChange}
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-5 flex-wrap items-center">
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
            <div>
              <label htmlFor="currency">العملة: </label>
              <SelectMenu
                conectionName="currency"
                data={currencyData && currencyData}
                listName="إختر عملة"
                setValue={() => setCurrency}
                selectedItem={update && state.currencyId}
              />
            </div>
          </div>
          <div className="flex gap-5 items-center flex-wrap">
            <div>
              <label htmlFor="purchaseDate">أدخل التاريخ: </label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={
                  date ? convertDate(date.toMillis()) : convertDate(new Date())
                }
                onChange={onDateChange}
                disabled={loading}
              />
            </div>
            <label htmlFor="purchaseIsPaid" className="flex items-center gap-3">
              مسددة أم لا :
              <Input
                id="purchaseIsPaid"
                name="purchaseIsPaid"
                type="checkbox"
                checked={isPaid}
                onChange={onIsPaidChange}
                disabled={loading}
              />
            </label>
          </div>

          <Button.large
            id="addPurchaseSubmitBtn"
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

export default AddPurchase;
