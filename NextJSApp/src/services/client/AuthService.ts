import { User } from "@techmarket/models/dist/UserModel"
import axios from "axios"
import ReftryAuthFailedApiCall from "./RetryApiService"

type signupResponseData = {
    status: number;
    success: boolean;
    message?: string;
    user?: User;
    accessToken?: string;
}

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
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return "Email already exists";
            }

            return null;
        }
    }

    async Login(email: string, password: string) {
        try {
            if(!email || !password) {
                return null;
            }

            const response = await axios.post<signupResponseData>("/api/Auth/Login", { email, password });
            
            if(response) {
                return response.data; // Return the response data (e.g., token, user info)
            }
        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status === 401) {
                return "InvalidCredentials";
            }

            return null;
        }
    }

    async Logout() {
        try {
            const response = await axios.post(
                "/api/Auth/Logout",
                {},
                { 
                    withCredentials: true
                }
            )
            
            if(response) {
                return response.data; // Return the response data from the logout API call
            }
        } catch (error) {
            // If the logout API call fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the logout API call.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const response = await ReftryAuthFailedApiCall("POST", "/api/Auth/Logout");

                    if(response === "RefreshFailed") {
                        throw new Error("Logout the User");
                    }

                    if(response) {
                        return response.data; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async GetCurrentUser() {
        try {
            const response = await axios.get<signupResponseData>("/api/Auth/GetMe", {
                withCredentials: true
            });

            if(response) {
                return response.data.user; // Return the user data from the response
            }
        } catch (error) {
            // If the API call to get the current user fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the API call to get the current user.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const retryResponse = await ReftryAuthFailedApiCall("GET", "/api/Auth/GetMe");

                    if(retryResponse === "RefreshFailed") {
                        throw new Error("Logout the User");
                    }

                    if(retryResponse) {
                        return retryResponse.data.user; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async UpdateProfilePicture(profilePicture: string) {
        try {
            if(!profilePicture) {
                return null;
            }

            const response = await axios.post<signupResponseData>(
                "/api/Auth/Upload-ProfilePic",
                { profilePicture },
                {
                    withCredentials: true
                }
            );

            if(response) {
                return response.data.user; // Return the response data from the API call
            }
        } catch (error) {
            // If the API call to update the profile picture fails due to an authentication issue (e.g., expired token), we can attempt to refresh the token and retry the API call to update the profile picture.
            if(axios.isAxiosError(error) && error.response) {
                if(error.response.status === 401) {
                    const response = await ReftryAuthFailedApiCall("POST", "/api/Auth/Upload-ProfilePic", { profilePicture });

                    if(response === "RefreshFailed") {
                        throw new Error("Logout the User");
                    }

                    if(response) {
                        return response.data.user; // Return the response from the retried API call
                    }
                    return null;
                }
            }
            return null;
        }
    }

    async RefreshToken() : Promise<boolean> {
        try {
            const response = await axios.get("/api/Auth/Refresh-Token",{ withCredentials: true }); // Include credentials to send cookies

            if(response && response.data && response.data.success) {
                return true;
            } else {
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    }
}

const authService = new AuthService();

export default authService;