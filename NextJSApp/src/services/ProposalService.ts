import axios from "axios"
import RetryAuthFailedApiCall from "./RetryApiService"
import { Proposal } from "@/models/ProposalModel";

type proposalResponseData = {
    status: number;
    success: boolean;
    message?: string;
    proposal?: Proposal;
    proposals?: Proposal[];
}

class ProposalService {
    async CreateProposal(title: string, description: string, Bid: number, ProposalFor: string,token: string) {
        try {
            
            if(!title || !description || !Bid || !ProposalFor) {
                return null; // Return null if any of the required fields are missing
            }

            const data = {
                title,
                description,
                Bid,
                ProposalFor
            }

            const response = await axios.post<proposalResponseData>("/api/Proposal/Create-Proposal", data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response) {
                return response.data.proposal; // Return the created proposal from the response
            }
        } catch (error) {
            
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("POST", `/api/Proposal/Create-Proposal`, { title, description, Bid, ProposalFor })

                if(retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data?.proposal; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if (axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("unauthorized");
            } else if(axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error("Job not found");
            }

            console.error("Error creating proposal:", error);
            return null;
        }
    }

    async GetProposals(token: string) {
        try {
            const response = await axios.get<proposalResponseData>("/api/Proposal/Get-Proposals", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                return []; // Return an empty array if no proposals are found
            }

            if(response.status === 201) {
                return response.data.proposals; // Return the proposals from the response
            }
        } catch (error) {
            
            if(axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("GET", `/api/Proposal/Get-Proposals`)

                if(retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {                    
                    return retryResult.data?.proposals; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if (axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("unauthorized");
            }

            console.error("Error fetching proposals:", error);
            return null;
        }
    }

    async DeleteProposal(proposalId: string, token: string) {
        try {
            if(!proposalId) {
                return null; // Return null if proposalId is missing
            }

            const response = await axios.delete<proposalResponseData>(`/api/Proposal/Delete-Proposal/${proposalId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                return response.data; // Return the response data from the API call
            }
        } catch (error) {

            if(axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("DELETE", `/api/Proposal/Delete-Proposal/${proposalId}`)

                if(retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if (axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("unauthorized");
            } else if(axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error("Proposal not found");
            }

            console.error("Error deleting proposal:", error);
            return null;
        }
    }

    async RejectProposal(proposalId: string, token: string) {
        try {

            if(!proposalId) {
                return null; // Return null if proposalId is missing
            }
            
            const response = await axios.post<proposalResponseData>(`/api/Proposal/Reject`, { proposalId }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                return response.data; // Return the response data from the API call
            }
        } catch (error) {

            if(axios.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to refresh and retry the request
                const retryResult = await RetryAuthFailedApiCall("POST", `/api/Proposal/Reject`, { proposalId })

                if(retryResult === "RefreshFailed") {
                    throw new Error("Logout the User");
                }

                if (retryResult) {
                    return retryResult.data; // Return the response data from the retried API call
                }

                return null; // Return null if the retry also fails
            } else if (axios.isAxiosError(error) && error.response?.status === 403) {
                throw new Error("unauthorized");
            } else if(axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error("Proposal not found");
            }

            console.error("Error rejecting proposal:", error);
            return null;
        }
    }
}

const proposalService = new ProposalService();

export default proposalService