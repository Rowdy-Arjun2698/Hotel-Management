import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Loginform = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handlesubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/hotel/login', formData, {
        withCredentials: true,
      })
      console.log('Response:', response.data)
      alert('Login successful!') 
      // Show an alert on successful login
      navigate('/hoteladmin')
    } catch (error) {
      console.error('Error submitting form:', error)
    }

    console.log('Form submitted:', formData)
  }
  return (
    <div className=" bg-white rounded-lg border-none flex flex-col w-[80%] h-auto p-5 gap-3 justify-center items-center">
      <form onSubmit={handlesubmit} className='flex flex-col gap-3 w-full h-full'>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
        value={formData.password}
        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} />
        <button type="submit" className='p-3 bg-[#d2873aff] text-white rounded-lg cursor-pointer hover:bg-[#c07a2f]'>
          Log in
        </button>
      </form>

    </div>
  )
}

export default Loginform
