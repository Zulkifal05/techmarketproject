'use client'
import { useEffect } from 'react'
import useAuthStore from '../store/AuthStore'
import { User } from '@techmarket/models/dist/UserModel'

export default function ZustandHydrater({ user , children }: { user: User , children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    if(user) {
      setUser(user)
    }
  },[user,setUser])

  return <div className="min-h-screen">{children}</div>
}