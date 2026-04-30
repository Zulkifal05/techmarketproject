import axios, { AxiosRequestConfig } from "axios"
import AuthService from "./AuthService"

type methodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// This function can be used to retry API calls that failed due to authentication issues, such as an expired token. It can be called after refreshing the token to attempt the original API call again.
async function ReftryAuthFailedApiCall(method: methodType, url: string, data?: unknown) {
    try {
        const newAccessToken : string = await AuthService.RefreshToken();

        if(newAccessToken) {
            // If the token refresh was successful, retry the original API call

            const config: AxiosRequestConfig = {
                method,
                url,
                headers: {
                Authorization: `Bearer ${newAccessToken}`,
                },
            };

            if (data && method !== "GET") {
                config.data = data;
            }

            const retryResponse = await axios.request(config);

            if(retryResponse) {
                return retryResponse; // Return the response data from the retried API call
            }
        } else {
            throw new Error("Token refresh failed");
        }
    } catch (error) {
        console.error("Error retrying API call:", error);

        if(error instanceof Error && error.message === "Token refresh failed") {
            return "RefreshFailed"; // Return a specific value to indicate that the token refresh failed
        }
        return null;
    }
}

export default ReftryAuthFailedApiCall
