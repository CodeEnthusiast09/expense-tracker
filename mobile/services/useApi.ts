import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";
import { clientRequestGateway } from "./request-gateway";

export function useApi() {
  const { getToken, signOut, userId } = useAuth();

  const api = useMemo(() => {
    // Wrapper function that returns both token and userId
    const getAuthData = async () => {
      const token = await getToken();
      return { token, userId };
    };

    return clientRequestGateway(getAuthData, signOut);
  }, [getToken, signOut, userId]);

  return api;
}
