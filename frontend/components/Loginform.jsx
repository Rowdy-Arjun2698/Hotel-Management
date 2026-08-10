import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

const Loginform = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handlesubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/hotel/login', formData, {
        withCredentials: true,
      })
      console.log('Response:', response.data)
      navigate('/hoteladmin')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="flex w-[80%] flex-col items-center gap-4 rounded-lg border-none bg-white p-5 mx-auto">
      <form onSubmit={handlesubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#D97B3F]"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password:</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D97B3F]"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#D97B3F] p-3 font-semibold text-white transition-colors duration-200 hover:bg-[#c06a30] cursor-pointer"
        >
          <LogIn size={16} />
          Log in
        </button>
      </form>
    </div>
  )
}

export default Loginform