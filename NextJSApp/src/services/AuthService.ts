import { User } from "@techmarket/models/dist/UserModel";
import axios, { AxiosRequestConfig } from "axios";

type signupResponseData = {
    status: number;
    success: boolean;
    message?: string;
    user?: User;
}

type methodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class AuthService {
    async SignUp(username: string, email: string, password: string, role: string) {
        try {
            if(!username || !email || !password || !role) {
                throw new Error("All fields are required");
            }
            const body = {
                name: username,
                email: email,
                password: password,
                role: role,
            }

            const response = await axios.post<signupResponseData>("/api/Auth/Signup", body);
            
            if(response) {
                return response.data?.user; // Return the created user object
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Server responded with:", error.response);
            }

            return null;
        }
    }

    async Login(username: string, password: string) {
        try {
            if(!username || !password) {
                return null;
            }

            const response = await axios.post<signupResponseData>("/api/Auth/Login", { username, password });
            
            if(response) {
                return response.data?.user; // Return the response data (e.g., token, user info)
            }
        } catch (error) {
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    throw new Error("Invalid Credentials");
                }
            }

            return null;
        }
    }

    async Logout(accessToken: string) {
        try {
            const response = await axios.post(
                "/api/Auth/Logout",
                {},
                { 
                    headers: { 
                        Authorization: `Bearer ${accessToken}` 
                    } 
                }
            )
            
            if(response) {
                return response.data; // Return the response data from the logout API call
            }
        } catch (error) {
            // If the logout API call fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the logout API call.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const response = await this.ReftryAuthFailedApiCall("POST", "/api/Auth/Logout");
                    if(response) {
                        return response.data; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async GetCurrentUser(token: string) {
        try {
            const response = await axios.get<signupResponseData>("/api/Auth/GetMe", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response) {
                return response.data.user; // Return the user data from the response
            }
        } catch (error) {
            // If the API call to get the current user fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the API call to get the current user.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const retryResponse = await this.ReftryAuthFailedApiCall("GET", "/api/Auth/GetMe");
                    if(retryResponse) {
                        return retryResponse.data.user; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async UpdateProfilePicture(profilePicture: string, token: string) {
        try {
            if(!token || !profilePicture) {
                return null;
            }

            const response = await axios.post<signupResponseData>(
                "/api/Auth/Upload-ProfilePic",
                { profilePicture },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if(response) {
                return response.data.user; // Return the response data from the API call
            }
        } catch (error) {
            // If the API call to update the profile picture fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the API call to update the profile picture.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const response = await this.ReftryAuthFailedApiCall("POST", "/api/Auth/Upload-ProfilePic", { profilePicture });
                    if(response) {
                        return response.data.user; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async RefreshToken() : Promise<string> {
        try {
            const response = await axios.get("/api/Auth/Refresh-Token",{ withCredentials: true }); // Include credentials to send cookies

            if(response && response.data && response.data.success) {
                return response.data.accessToken; // Return the new access token
            } else {
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return "";
        }
    }
    
    // This function can be used to retry API calls that failed due to authentication issues, such as an expired token. It can be called after refreshing the token to attempt the original API call again.
    async ReftryAuthFailedApiCall(method: methodType, url: string, data?: unknown) {
        try {
            const newAccessToken : string = await this.RefreshToken();

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
            return null;
        }
    }
}

const authService = new AuthService();

export default authService;