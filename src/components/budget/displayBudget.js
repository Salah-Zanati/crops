export const budget = {
  sales: 0,
  purchases: 0,
  workers: 0,
};
export const displaySalesBudget = (veg, sales) => {
  let res = 0;
  for (let i = 0; i < sales.length; i++) {
    if (sales[i].vegName === veg) res += sales[i].quantity * sales[i].price;
  }
  budget.sales = res;
  return res;
};
export const displayPurchasesBudget = (veg, purchases) => {
  let res = 0;
  for (let i = 0; i < purchases.length; i++) {
    if (purchases[i].vegName === veg)
      res += purchases[i].quantity * purchases[i].price;
  }
  budget.purchases = res;
  return res;
};
export const displayWorkersBuget = (veg, fullacts, groupsActs) => {
  let res = 0;
  for (let i = 0; i < fullacts.length; i++) {
    if (fullacts[i].vegName === veg) {
      let hoursNum = 0;
      fullacts[i].innerData.forEach((e) => (hoursNum += e));
      res += fullacts[i].hourPrice * hoursNum;
    }
  }
  for (let i = 0; i < groupsActs.length; i++) {
    if (groupsActs[i].vegName === veg)
      res +=
        groupsActs[i].hoursNum *
        groupsActs[i].hourPrice *
        groupsActs[i].workersNum;
  }
  budget.workers = res;
  return res;
};
