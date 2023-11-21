import { configureStore } from "@reduxjs/toolkit";
import workersSlice from "./workersSlice";
import sellersSlice from "./sellersSlice";
import generalSlice from "./generalSlice";
import customersSlice from "./customersSlice";
import vegsSlice from "./vegsSlice";
import actsSlice from "./actsSlice";
import salesSlice from "./salesSlice";
import materialSlice from "./materialSlice";
import purchasesSlice from "./purchasesSlice";
import expensesSlice from "./expensesSlice";
import fullactsSlice from "./fullactsSlice";
import fullactWorkersSlice from "./fullactWorkersSlice";
import groupsSlice from "./groupsSlice";
import groupsActsSlice from "./groupsActsSlice";
import loginSlice from "./loginSlice";
import currencySlice from "./currencySlice";

export const store = configureStore({
  reducer: {
    workers: workersSlice,
    sellers: sellersSlice,
    general: generalSlice,
    customers: customersSlice,
    vegs: vegsSlice,
    acts: actsSlice,
    sales: salesSlice,
    material: materialSlice,
    purchases: purchasesSlice,
    expenses: expensesSlice,
    fullacts: fullactsSlice,
    fullactWorkers: fullactWorkersSlice,
    groups: groupsSlice,
    groupsActs: groupsActsSlice,
    users: loginSlice,
    currency: currencySlice,
  },
});
