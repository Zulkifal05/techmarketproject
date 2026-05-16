import { Job } from "@/models/JobModel"
import RetryAuthFailedApiCall from "./RetryApiService"
import axios from "axios"

type jobResponseData = {
    status: number;
    success: boolean;
    message?: string;
    job?: Job;
    jobs?: Job[];
}

class JobService {
    async AssignJob(jobId: string, proposalId: string) {
        try {
            if(!jobId || !proposalId) {
                throw new Error("Missing required fields or token")
            }

            const response = await axios.patch<jobResponseData>(
                "/api/Job/Assign-Job",
                { jobId, proposalId },
                {
                    withCredentials: true
                }
            )

            if(response) {
                return response.data.job; // Return the job data from the response
            }
        } catch (error) {

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("PATCH", `/api/Job/Assign-Job`, { jobId , proposalId })

                if(retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data?.job; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if(axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("Unauthorized")
            } else if(axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error("Job or Proposal not found")
            }

            console.error("Error assigning job:", error)
            return null
        }
    }

    async CreateJob(title: string, description: string, categories: string[], jobPrice: number) {
        try {
            if(!title || !description || categories.length === 0 || !jobPrice || jobPrice <= 0) {
                throw new Error("Missing required fields or token")
            }

            const response = await axios.post<jobResponseData>(
                "/api/Job/Create-Job",
                { title, description, categories, jobPrice },
                {
                    withCredentials: true
                }
            )

            if(response) {
                return response.data.job; // Return the job data from the response
            }
        } catch (error) {

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("POST", `/api/Job/Create-Job`, { title, description, categories, jobPrice })

                if (retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data?.job; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if(axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("Unauthorized")
            }

            console.error("Error creating job:", error)
            return null
        }
    }

    async DeleteJob(jobId: string) {
        try {
            if(!jobId) {
                throw new Error("Missing required fields or token")
            }

            const response = await axios.delete(
                `/api/Job/Delete-Job/${jobId}`,
                {
                    withCredentials: true
                }
            )

            if(response) {
                return response.data; // Return the job data from the response
            }
        } catch (error) {

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("DELETE", `/api/Job/Delete-Job/${jobId}`)

                if (retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if(axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("Unauthorized")
            } else if(axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error("Job not found")
            }

            console.error("Error deleting job:", error)
            return null
        }
    }

    async GetJobsFeed(page: number, limit: number) {
        try {
            if(!page || !limit) {
                return null
            }

            const response = await axios.get<jobResponseData>(
                `/api/Job/Feed?page=${page}&limit=${limit}`,
                {
                    withCredentials: true
                }
            )

            if(response) {
                return response.data.jobs; // Return the jobs data from the response
            }
        } catch (error) {
            
            if(axios.isAxiosError(error) && error.response?.status === 401) {
                const retryResult = await RetryAuthFailedApiCall("GET", `/api/Job/Feed?page=${page}&limit=${limit}`)

                if (retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data?.jobs; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            }

            console.error("Error fetching job feed:", error)
            return null
        }
    }

    async GetUserJobs() {
        try {
            const response = await axios.get<jobResponseData>(
                `/api/Job/Get-Jobs`,
                {
                    withCredentials: true
                }
            )

            if(response) {
                return response.data.jobs; // Return the jobs data from the response
            }
        } catch (error) {

            if(axios.isAxiosError(error) && error.response?.status === 401) {
                const retryResult = await RetryAuthFailedApiCall("GET", `/api/Job/Get-Jobs`)

                if (retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data?.jobs; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if(axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("Unauthorized")
            }

            console.error("Error fetching user jobs:", error)
            return null
        }
    }
}

const jobService = new JobService();

export default jobService