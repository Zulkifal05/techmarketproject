"use client"
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, User, Building } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { SignupSchema } from "../../../schemas/SignupSchema"
import { type z } from 'zod'
import authService from '@/services/client/AuthService'
import { toast } from "react-hot-toast"
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [isSigningUp, setIsSigningUp] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'SELLER',
      profilePicture: ''
    }
  })

  async function SignupUser(data: z.infer<typeof SignupSchema>) {
    try {
      setIsSigningUp(true)
      const createdUser = await authService.SignUp(data.name, data.email, data.password, data.role);

      if(createdUser === "Email already exists") {
        toast.error('Email already exists. Please use a different email.')
        return;
      }

      if(createdUser) {  // If the user was created successfully, attempt to log in
        const loginResponse = await authService.Login(data.email, data.password);

        if(loginResponse === "InvalidCredentials") {
          toast.error('Login failed after signup. Please try logging in manually.')
          router.push('/Login')
          return;
        }

        if(loginResponse?.user) {
          toast.success('Account created successfully!')
          router.push("/")  // Go to home when sign up successfull
        } else {
          toast.error('Login failed after signup. Please try logging in manually.')
          router.push('/Login')
        }
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    } catch (e) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsSigningUp(false)
      reset() // Reset the form after submission
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechMaket
            </h1>
          </div>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(SignupUser)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black"
                  placeholder="John Doe"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              </div>
              {errors.name?.message && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black"
                  placeholder="you@company.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email?.message && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm text-gray-700 mb-2">
                Select Your Role
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  id="role"
                  {...register('role')}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black appearance-none bg-white cursor-pointer"
                  aria-invalid={errors.role ? 'true' : 'false'}
                >
                  <option value="SELLER">Developer</option>
                  <option value="BUYER">Hirer</option>
                </select>
              </div>
              {errors.role?.message && (
                <p className="mt-2 text-sm text-red-600">Select Role Please</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password?.message && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 cursor-pointer"
              disabled={isSigningUp}
            >
              <UserPlus className="w-5 h-5" />
              {isSigningUp ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/Login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
