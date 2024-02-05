import { useEffect } from "react";
import Button from "../styles/Button.styled";
import Table from "../styles/Table.styled";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loading from "../animation/Loading";
import {
  getCurrency,
  selectCurrencyEntities,
  selectCurrencyLoading,
} from "../../toolkit/currencySlice";
import { selectUserId } from "../../toolkit/loginSlice";
import { handleDeleting } from "../../utils/functions";

// eslint-disable-next-line react/prop-types
const Currency = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const bringCurrencyData = useSelector(selectCurrencyEntities);
  const currencyLoading = useSelector(selectCurrencyLoading);
  const [currencyData, setCurrencyData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCurrency());
  }, []);
  useEffect(() => {
    setCurrencyData(bringCurrencyData);
  }, [bringCurrencyData]);

  if (loading) return <Loading />;

  return (
    <Table>
      <thead>
        <tr>
          <th>إسم العملة</th>
          <th>عمليات</th>
        </tr>
      </thead>
      <tbody id="tbody">
        {currencyLoading === "loading" && (
          <tr>
            <td>
              <Loading />
            </td>
          </tr>
        )}
        {currencyData &&
          currencyLoading !== "loading" &&
          currencyData
            .filter((currency) => currency.name.includes(searchTerm))
            .map((currency) => (
              <tr key={currency.id}>
                <td key="1">{currency.name}</td>
                <td key="2" className="flex gap-2 justify-center">
                  <Button.small>
                    <Link
                      to="/home/updataCurrency"
                      state={{ ...currency, chossed: "currency" }}
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
                          `${userId}/currency`,
                          currency.id,
                          dispatch,
                          getCurrency
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
  );
};

export default Currency;
