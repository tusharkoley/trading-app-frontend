import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const hostname = "localhost";
const port = 8000;

const fetchSnp500Stocks = async () => {
  const response = await axios.get(
    `http://${hostname}:${port}/stocks/companies/`
  );
  return response.data;
};

const fetchPricebyTicker = async (ticker) => {
  const response = await axios.get(
    `http://${hostname}:${port}/stocks/company/${ticker}/prices/`
  );

  console.log(response.data);

  return response.data;

  // if (Array.isArray(response.data)) {
  //   // If it's an array, convert each element to an object
  //   const prices = response.data.map((priceData) => {
  //     ticker: priceData.ticker || "unknown";
  //   });
  // }
  // return prices;
};
export const usePriceDatabyTicker = (ticker) => {
  const {
    isLoading,
    error,
    data: stocks = [],
  } = useQuery({
    queryKey: ["fetchProcesbyTicker"],
    queryFn: () => fetchPricebyTicker(ticker),
    initialData: [],
    cacheTime: 5 * 60 * 1000,
  });
  return { isLoading, error, stocks };
};

export const useSnp500StocksData = () => {
  const {
    isLoading,
    error,
    data: stocks = [],
  } = useQuery({
    queryKey: ["fetchSnp500Stocks"],
    queryFn: () => fetchSnp500Stocks(),
    initialData: [],
    cacheTime: 5 * 60 * 1000,
  });
  return { isLoading, error, stocks };
};

// export default useSnp500StocksData;
