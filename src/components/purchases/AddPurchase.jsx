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
  getMaterial,
  selectMaterialEntities,
  selectMaterialLoading,
} from "../../toolkit/materialSlice";
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

// eslint-disable-next-line react/prop-types
const AddPurchase = ({ update }) => {
  const userId = useSelector(selectUserId);

  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState(Timestamp.fromDate(new Date()));
  const [isPaid, setIsPaid] = useState(false);
  const [material, setMaterial] = useState(
    doc(database, `users/${userId}/material`, "00000000000000000000")
  );
  const [seller, setSeller] = useState(
    doc(database, `users/${userId}/sellers`, "00000000000000000000")
  );
  const [veg, setVeg] = useState(
    doc(database, `users/${userId}/vegs`, "00000000000000000000")
  );
  const [loading, setLoading] = useState(false);
  const [materialData, setMaterialData] = useState();
  const [sellersData, setSellersData] = useState();
  const [vegsData, setVegsData] = useState();

  const dispatch = useDispatch();

  const bringMaterialData = useSelector(selectMaterialEntities);
  const bringSellersData = useSelector(selectSellersEntities);
  const bringVegsData = useSelector(selectVegsEntities);
  const materialLoading = useSelector(selectMaterialLoading);
  const sellersLoading = useSelector(selectSellersLoading);
  const vegsLoading = useSelector(selectVegsLoading);

  let { state } = useLocation();

  useEffect(() => {
    dispatch(getMaterial());
    dispatch(getSellers());
    dispatch(getVegs());
  }, []);

  useEffect(() => {
    setSellersData(bringSellersData);
  }, [bringSellersData]);

  useEffect(() => {
    setMaterialData(bringMaterialData);
  }, [bringMaterialData]);
  useEffect(() => {
    setVegsData(bringVegsData);
  }, [bringVegsData]);

  useEffect(() => {
    materialLoading === "loading" ||
    sellersLoading === "loading" ||
    vegsLoading === "loading"
      ? setLoading(true)
      : setLoading(false);
  }, [materialLoading, sellersLoading, vegsLoading]);

  useEffect(() => {
    if (update) {
      setLoading(true);
      setQuantity(state.quantity);
      setPrice(state.price);
      const selectedDate = new Date(state.date);
      const timestemp = Timestamp.fromDate(selectedDate);
      setDate(timestemp);
      setIsPaid(state.isPaid);
      const materialDoc = doc(
        database,
        `users/${userId}/material`,
        state.materialId
      );
      setMaterial(materialDoc);
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
  const onPriceChange = (e) => setPrice(Number(e.target.value));
  const onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const timestemp = Timestamp.fromDate(selectedDate);
    setDate(timestemp);
  };
  const onIsPaidChange = () => setIsPaid(!isPaid);

  // Handle submit
  const handleSubmitBtn = () => {
    if (!update)
      handleAdding(setLoading, `${userId}/purchases`, {
        material,
        quantity,
        price,
        date,
        veg,
        seller,
        isPaid,
      });
    if (update)
      handleUpdating(setLoading, `${userId}/purchases`, state.id, {
        material,
        quantity,
        price,
        date,
        veg,
        seller,
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
          <div className="flex gap-5 items-center">
            <label htmlFor="purchaseQuanity">أدخل الكمية: </label>
            <Input
              id="purchaseQuantity"
              name="purchaseQuantity"
              type="number"
              placeholder="الكمية..."
              value={update && quantity}
              onChange={onQuantityChange}
              disabled={loading}
            />
            <label htmlFor="purchasePrice">أدخل السعر: </label>
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
          <div className="flex gap-5 items-center">
            <label htmlFor="purchaseMaterial">المواد: </label>
            <SelectMenu
              conectionName="material"
              data={materialData && materialData}
              listName="إختر مادة"
              setValue={() => setMaterial}
              selectedItem={update && state.materialId}
            />
            <label htmlFor="purchaseSeller">البائعين: </label>
            <SelectMenu
              conectionName="sellers"
              data={sellersData && sellersData}
              listName="إختر بائع"
              setValue={() => setSeller}
              selectedItem={update && state.sellerId}
            />
            <label htmlFor="purchaseVeg">الصنف: </label>
            <SelectMenu
              conectionName="vegs"
              data={vegsData && vegsData}
              listName="إختر صنف"
              setValue={() => setVeg}
              selectedItem={update && state.vegId}
            />
          </div>
          <div className="flex gap-5 items-center">
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
