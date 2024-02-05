import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Expenses from "./components/purchases/Expenses";
import Footer from "./components/About";
import Purchases from "./components/purchases/Purchases";
import Sales from "./components/sales/Sales";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import AddSale from "./components/sales/AddSale";
import AddPurchase from "./components/purchases/AddPurchase";
import AddExpenses from "./components/purchases/AddExpenses";
import Fullacts from "./components/fullacts/Fullacts";
import AddFullact from "./components/fullacts/AddFullact";
import FullactWorkers from "./components/fullacts/FullactWorkers";
import AddFullactWorkers from "./components/fullacts/AddFullactWorkers";
import AddGroupsAct from "./components/fullacts/addGroupsAct";
import { useSelector } from "react-redux";
import { selectAccess } from "./toolkit/loginSlice";
import Navbar from "./components/Navbar";
import Add_Update from "./components/management/Add_Update";
import { Budget } from "./components/budget/Budget";
import Setting from "./components/Setting";

const theme = {
  colors: {
    body: "#eee",
    bgElements: "#eee",
  },
};

function App() {
  const access = useSelector(selectAccess);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {!access && <Login />}
          {access && (
            <div className="flex flex-col-reverse justify-end flex-1 md:flex-row">
              <Sidebar />
              <div className="flex-1">
                <Routes>
                  {/* Management section */}
                  <Route path="/" element={<Home />} />
                  {(() => {
                    let addingMangRoutes = [
                      "addWorker",
                      "addSeller",
                      "addCustomer",
                      "addAct",
                      "addVeg",
                      "addMaterial",
                      "addGroup",
                      "addCurrency",
                    ];
                    let updatingMangRoutes = [
                      "updataWorker",
                      "updataSeller",
                      "updataCustomer",
                      "updataAct",
                      "updataVeg",
                      "updataMaterial",
                      "updataGroup",
                      "updataCurrency",
                    ];
                    const routes = [];
                    for (let i = 0; i < addingMangRoutes.length; i++) {
                      routes.push(
                        <Route
                          key={i}
                          path={"/home/" + addingMangRoutes[i]}
                          element={<Add_Update />}
                        />
                      );
                      routes.push(
                        <Route
                          key={i + 100}
                          path={"/home/" + updatingMangRoutes[i]}
                          element={<Add_Update update={true} />}
                        />
                      );
                    }
                    return routes;
                  })()}

                  {/* Sales section */}
                  <Route path="/sales" element={<Sales />} />

                  <Route path="/sales/addSale" element={<AddSale />} />
                  <Route
                    path="/sales/updataSale"
                    element={<AddSale update={true} />}
                  />
                  {/* Purchases section */}
                  <Route path="/purchases" element={<Purchases />} />
                  <Route
                    path="/purchases/addPurchase"
                    element={<AddPurchase />}
                  />
                  <Route
                    path="/purchases/updataPurchase"
                    element={<AddPurchase update={true} />}
                  />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route
                    path="expenses/addExpenses"
                    element={<AddExpenses />}
                  />
                  <Route
                    path="/expenses/updateExpenses"
                    element={<AddExpenses update={true} />}
                  />

                  {/* Fullact section */}
                  <Route path="/fullacts" element={<Fullacts />} />
                  <Route path="/fullacts/addFullact" element={<AddFullact />} />
                  <Route
                    path="/fullacts/updateFullact"
                    element={<AddFullact update={true} />}
                  />
                  <Route
                    path="/fullacts/addGroupsAct"
                    element={<AddGroupsAct />}
                  />
                  <Route
                    path="/fullacts/updateGroupsAct"
                    element={<AddGroupsAct update={true} />}
                  />
                  <Route path="/fullactWorkers" element={<FullactWorkers />} />
                  <Route
                    path="/fullactWorkers/addFullactWorkers"
                    element={<AddFullactWorkers />}
                  />
                  <Route
                    path="/fullactWorkers/updateFullactWorkers"
                    element={<AddFullactWorkers update={true} />}
                  />
                  <Route path="/about" element={<Footer />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/setting" element={<Setting />} />
                </Routes>
                {/* <p className="relative -left-1/2">
                  Developed by{" "}
                  <a href="http://salahzanati.web.app/">salahZanati</a> &copy;{" "}
                  {new Date().getFullYear()}
                </p> */}
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
