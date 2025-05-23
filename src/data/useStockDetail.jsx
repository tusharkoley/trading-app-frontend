import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const hostname = "localhost";
const port = 8000;

const fetchStockDetails = async ({ id }) => {
  const response = await axios.get(
    `http://${hostname}:${port}/stocks/companies/${id}/`
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
