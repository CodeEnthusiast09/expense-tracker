import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";
import { clientRequestGateway } from "./request-gateway";

export function useApi() {
  const { getToken, signOut } = useAuth();

  const api = useMemo(() => {
    // Create a wrapper function that calls getToken with the template
    const getTokenWithTemplate = () =>
      getToken({ template: "your-template-name" });

    // Pass the function to clientRequestGateway
    return clientRequestGateway(getTokenWithTemplate, signOut);
  }, [getToken, signOut]); // Only depend on getToken

  return api;
}
