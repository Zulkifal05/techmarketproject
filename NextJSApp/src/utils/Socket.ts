import { io , Socket } from "socket.io-client"
import axios from "axios"

interface TokenResponse {
  accessToken: string;
  status?: number;
  success?: boolean;
}

let socket: Socket | null = null;

async function getSocket() {
  if (!socket) {
    try {
      const tokenResponse = await axios.get<TokenResponse>("/api/Auth/Get-Token", { withCredentials: true });

      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        autoConnect: false,
        auth: {
          token: tokenResponse.data.accessToken
        }
      });

      return socket;
    } catch (error) {
      if(axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 500)) {
        return null; // Return null if token fetch fails
      }

      return null; // Return null for any other errors
    }
  }

  return socket;
}

export default getSocket;