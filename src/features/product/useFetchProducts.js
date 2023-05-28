import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// react hook  adalah menapilkan sebuah proses saja
// react componnet adalah menampilkan halaman atau component

export const useFetchProducts = () => {
  return useQuery({
    queryFn: async () => {
      const productsResponse = await axiosInstance.get("/products");
      return productsResponse;
    },
  });
};
