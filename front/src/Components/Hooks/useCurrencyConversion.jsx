// src/hooks/useCurrencyConversion.js
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "./useFetch";

const useCurrencyConversion = ({ amountToDonate, currency }) => {
  const [convertedBalance, setConvertedBalance] = useState(null);

  const {
    data: exchangeRateData,
    isLoading: isExchangeRateDataLoading,
    isError: isExchangeRateDataError,
  } = useQuery({ queryKey: ["exchangeRate"], queryFn: fetchExchangeRates });

  useEffect(() => {
    if (!isExchangeRateDataLoading && exchangeRateData) {
      const { GBP, NGN, USD } = exchangeRateData;

      let newBalance;
      if (currency === "NGN") {
        newBalance = amountToDonate * NGN;
      } else if (currency === "USD") {
        newBalance = amountToDonate * USD;
      } else if (currency === "GBP") {
        newBalance = amountToDonate * GBP;
      }

      setConvertedBalance(newBalance);
    }
  }, [exchangeRateData, amountToDonate, currency, isExchangeRateDataLoading]);

  return {
    convertedBalance,
    isLoading: isExchangeRateDataLoading,
    isError: isExchangeRateDataError,
  };
};

export default useCurrencyConversion;
