import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ServerURL from "./config";

const fetchStockDetails = async ({ id }) => {
  const response = await axios.get(
    `http://${ServerURL}/stocks/companies/${id}/`
  );
  return response.data;
};

function useStockDetail({ id }) {
  const {
    isLoading,
    error,
    data: stock = [],
  } = useQuery({
    queryKey: ["fetchStockDetails"],
    queryFn: () => fetchStockDetails((id = { id })),
    initialData: [],
    cacheTime: 5 * 60 * 1000,
  });
  return { isLoading, error, stock };
}

export default useStockDetail;
