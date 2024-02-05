import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getSales,
  selectSalesEntities,
  selectSalesLoading,
} from "../../toolkit/salesSlice";
import {
  getPurchases,
  selectPurchasesEntities,
  selectPurchasesLoading,
} from "../../toolkit/purchasesSlice";
import {
  getVegs,
  selectVegsEntities,
  selectVegsLoading,
} from "../../toolkit/VegsSlice";
import {
  getFullacts,
  selectFullactEntities,
  selectFullactLoading,
} from "../../toolkit/fullactsSlice";
import {
  getGroupsActs,
  selectGroupsActEntities,
  selectGroupsActLoading,
} from "../../toolkit/groupsActsSlice";
import Box from "../styles/Box.styled";
import Loading from "../animation/Loading";
import Table from "../styles/Table.styled";
import Container from "../styles/Container.styled";
import {
  budget,
  displayPurchasesBudget,
  displaySalesBudget,
  displayWorkersBuget,
} from "./displayBudget";

export const Budget = () => {
  const dispatch = useDispatch();

  // Fetching data
  useEffect(() => {
    dispatch(getSales());
    dispatch(getPurchases());
    dispatch(getVegs());
    dispatch(getFullacts());
    dispatch(getGroupsActs());
  }, []);

  // Bringing sales
  const [sales, setSales] = useState();
  const bringSales = useSelector(selectSalesEntities);
  const loadingSales = useSelector(selectSalesLoading);
  useEffect(() => {
    setSales(bringSales);
  }, [bringSales]);

  // Bringing purchases
  const [purchases, setPurchases] = useState();
  const bringPurchases = useSelector(selectPurchasesEntities);
  const loadingPurchases = useSelector(selectPurchasesLoading);
  useEffect(() => {
    setPurchases(bringPurchases);
  }, [bringPurchases]);

  // Bringing vegs
  const [vegs, setVegs] = useState();
  const bringVegs = useSelector(selectVegsEntities);
  const loadingVegs = useSelector(selectVegsLoading);
  useEffect(() => {
    setVegs(bringVegs);
  }, [bringVegs]);

  // Bringing fullacts, groupsActs
  const [fullacts, setFullacts] = useState();
  const [groupsActs, setGroupsActs] = useState();

  const bringFullacts = useSelector(selectFullactEntities);
  const bringGroupsActs = useSelector(selectGroupsActEntities);

  const loadingFullacts = useSelector(selectFullactLoading);
  const loadingGroupsActs = useSelector(selectGroupsActLoading);

  useEffect(() => {
    setFullacts(bringFullacts);
  }, [bringFullacts]);
  useEffect(() => {
    setGroupsActs(bringGroupsActs);
  }, [bringGroupsActs]);

  return (
    <Container className="p-5 mb-10">
      <Box className="flex-col gap-5">
        <Table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>المبيعات</th>
              <th>المشتريات</th>
              <th>العمال</th>
              <th>الميزانية</th>
            </tr>
          </thead>
          <tbody>
            {loadingGroupsActs === "loading" ? (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            ) : (
              vegs &&
              vegs.map((veg) => {
                return (
                  <tr key={veg.id}>
                    <td key="1">{veg.name}</td>
                    <td key="2">
                      {sales && displaySalesBudget(veg.name, sales)}
                    </td>
                    <td key="3">
                      {purchases && displayPurchasesBudget(veg.name, purchases)}
                    </td>
                    <td key="4">
                      {fullacts &&
                        groupsActs &&
                        displayWorkersBuget(veg.name, fullacts, groupsActs)}
                    </td>
                    <td key="5">
                      {budget.sales - budget.purchases - budget.workers} $
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Box>
    </Container>
  );
};
