import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ServerURL from "./config";

const fetchSnp500Stocks = async () => {
  const response = await axios.get(`${ServerURL}/stocks/companies/`);
  return response.data;
};

const fetchPricebyTicker = async (ticker) => {
  const response = await axios.get(
    `${ServerURL}/stocks/company/${ticker}/prices/`
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

const fetchLatestTechnicals = async (rsMin = null) => {
  const response = await axios.get(`${ServerURL}/stocks/technicals/latest/`, {
    params: rsMin !== null ? { rs_min: rsMin } : {},
  });
  return response.data;
};

const fetchLatestPrices = async () => {
  const response = await axios.get(`${ServerURL}/stocks/prices/latest/`);
  return response.data;
};

const fetchLatestTechnicalByTicker = async (ticker) => {
  if (!ticker) {
    return {};
  }

  const response = await axios.get(
    `${ServerURL}/stocks/company/${ticker}/technicals/latest/`
  );
  return response.data;
};

const fetchIndustryPerformanceRankings = async ({ months, country }) => {
  const response = await axios.get(`${ServerURL}/stocks/industries/performance/`, {
    params: {
      months,
      ...(country ? { country } : {}),
    },
  });

  return response.data;
};

export const usePriceDatabyTicker = (ticker) => {
  const {
    isLoading,
    error,
    data: stocks = [],
  } = useQuery({
    queryKey: ["fetchPricesByTicker", ticker],
    queryFn: () => fetchPricebyTicker(ticker),
    enabled: !!ticker,
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return { isLoading, error, stocks };
};

export const useLatestTechnicals = ({ rsMin = null } = {}) => {
  const {
    isLoading,
    error,
    data: technicals = [],
  } = useQuery({
    queryKey: ["fetchLatestTechnicals", rsMin],
    queryFn: () => fetchLatestTechnicals(rsMin),
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, error, technicals };
};

export const useLatestTechnicalByTicker = (ticker) => {
  const {
    isLoading,
    error,
    data: technical = {},
  } = useQuery({
    queryKey: ["fetchLatestTechnicalByTicker", ticker],
    queryFn: () => fetchLatestTechnicalByTicker(ticker),
    enabled: !!ticker,
    placeholderData: {},
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, error, technical };
};

export const useLatestPrices = () => {
  const {
    isLoading,
    error,
    data: prices = [],
  } = useQuery({
    queryKey: ["fetchLatestPrices"],
    queryFn: () => fetchLatestPrices(),
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, error, prices };
};

export const useIndustryPerformanceRankings = ({ months = 3, country = "" } = {}) => {
  const {
    isLoading,
    error,
    data = {
      rankings: [],
      top_industry: null,
      available_countries: [],
      as_of_date: null,
      lookback_date: null,
    },
  } = useQuery({
    queryKey: ["industryPerformanceRankings", months, country],
    queryFn: () => fetchIndustryPerformanceRankings({ months, country }),
    placeholderData: {
      rankings: [],
      top_industry: null,
      available_countries: [],
      as_of_date: null,
      lookback_date: null,
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, error, data };
};

// export default useSnp500StocksData;
