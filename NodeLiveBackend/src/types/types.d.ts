export interface User {
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