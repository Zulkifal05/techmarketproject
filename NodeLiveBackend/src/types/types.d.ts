import mongoose from "mongoose"
import "socket.io"

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  role: "SELLER" | "BUYER";
  refreshToken: string
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // optional because middleware might not set it
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user: {
      userId: string;
    };
  }
}