import { ErrorObject, ServerErrorResponse } from "@/interfaces";
import { extractPaginationFromGetResponse } from "@/lib/utils";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Toast from "react-native-toast-message";

/**
 * Creates an axios service with authentication and error handling
 * @param getToken - Function to retrieve the current auth token (from Clerk)
 * @param baseURL - Base URL for API requests
 */
const service = (
  getToken: () => Promise<string | null>,
  signOut: () => Promise<void>,
  baseURL = process.env.EXPO_PUBLIC_API_BASE_URL!,
) => {
  const service = axios.create({
    baseURL,
    withCredentials: false,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Methods": "*",
    },
  });

  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Get token from Clerk instead of AsyncStorage
      const token = await getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const responseData = response?.data;

      // Return the data from the API
      if (responseData?.data) {
        return responseData;
      }

      return responseData;
    },
    async (error: AxiosError) => {
      if (error?.response === undefined) {
        Toast.show({
          type: "error",
          text1: "No internet connection",
        });
        return Promise.reject("No internet connection");
      } else {
        const errors = error?.response?.data as ServerErrorResponse;

        // @ts-ignore
        let serverErrors = errors?.errors;

        const statusCode = error?.response?.status;

        // Handle 401 - Token is invalid/expired
        if (statusCode === 401) {
          Toast.show({
            type: "error",
            text1: "Session expired. Please sign in again.",
          });

          // Sign out the user and clear their session
          await signOut();

          // No need to redirect here - Clerk will automatically
          // redirect to sign-in because isSignedIn will become false

          return Promise.reject(new Error("Unauthorized"));
        }

        if (statusCode === 500 || statusCode === 405) {
          Toast.show({
            type: "error",
            text1: "Something went wrong. Please try again later!",
          });

          if (__DEV__) {
            console.error("Server Error:", error);
          }
        } else if (serverErrors) {
          // loop through serverErrors object and display value of each key
          Object.keys(serverErrors).forEach((key) => {
            const errorItem = serverErrors[key];

            if (Array.isArray(errorItem)) {
              errorItem.forEach((err) => {
                Toast.show({
                  type: "error",
                  text1:
                    (err as ErrorObject)?.message ||
                    errorItem.toString().replace(".", " "),
                  // serverErrors[key]?.toString().replace(".", " ")
                });
              });
            } else {
              Toast.show({
                type: "error",
                text1:
                  (errorItem as ErrorObject)?.message ||
                  errorItem.toString().replace(".", " "),
                // serverErrors[key]?.toString().replace(".", " "),
              });
            }
          });
        } else {
          // Generic error message
          const errorMessage = errors?.error || errors?.message;

          if (errorMessage && errorMessage !== "Appraisal not added yet!") {
            Toast.show({
              type: "error",
              text1: errorMessage ?? "Something went wrong! Please try again.",
            });
          }
        }
        return Promise.reject(errors);
      }
    },
  );

  interface PostProps {
    url: string;
    payload?: object;
    config?: AxiosRequestConfig;
  }

  return {
    get: async (url: string, config?: AxiosRequestConfig) => {
      try {
        const data = service.get(url, config);
        const resolvedData = await Promise.resolve(data);

        const exactData = resolvedData?.data;
        // @ts-ignore
        const pagination = extractPaginationFromGetResponse(resolvedData);

        if (pagination) {
          return { data: exactData, pagination };
        } else {
          return exactData;
        }
      } catch (error) {
        console.error(error);
      }
    },

    post: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.post(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    patch: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.patch(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    delete: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.delete(url, { data: payload, ...config });
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    put: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.put(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export const clientRequestGateway = (
  getToken: () => Promise<string | null>,
  signOut: () => Promise<void>,
  options?: { baseURL?: string },
) => {
  const baseURL = options?.baseURL ?? process.env.EXPO_PUBLIC_API_BASE_URL!;
  return service(getToken, signOut, baseURL);
};
