import { User } from "@techmarket/models/dist/UserModel"
import { create } from "zustand"

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  login: (user: User, accessToken: string) => void
  logout: () => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: User) => void
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    login: (user: User, accessToken: string) => {
        set({
            isAuthenticated: true,
            user: user,
            accessToken: accessToken
        });
    },
    logout: () => {
        set({
            isAuthenticated: false,
            user: null,
            accessToken: null
        });
    },
    setAccessToken: (accessToken: string) => {
        set({
            accessToken: accessToken
        });
    },
    setUser: (user: User) => {
        set({
            user: user
        });
    }
}))

export default useAuthStore