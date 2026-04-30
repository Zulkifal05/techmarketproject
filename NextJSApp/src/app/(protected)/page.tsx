'use client'

import React from 'react'
import toast from 'react-hot-toast'
import authService from '../../services/AuthService'

export default function page() {
  const handleMockSignup = async () => {
    const mockUsername = 'mockuser'
    const mockEmail = 'mockuser@example.com'
    const mockPassword = 'Password123!'
    const mockRole = 'SELLE'

    const user = await authService.SignUp(mockUsername, mockEmail, mockPassword, mockRole)

    if (user) {
      console.log('Mock signup success:', user)
      toast.success('Mock signup completed successfully')
    } else {
      console.log('Mock signup failed')
      toast.error('Mock signup failed')
    }
  }

  return (
    <button onClick={handleMockSignup}>Run Mock Signup</button>
  )
}
