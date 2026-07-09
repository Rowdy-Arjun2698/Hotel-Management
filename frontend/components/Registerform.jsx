import React, { useState } from 'react'
import axios from 'axios'

const fields = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'owenerName', label: 'Owner Name', type: 'text' },
  { name: 'hotelName', label: 'Hotel Name', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'pincode', label: 'Pincode', type: 'text' },
  { name: 'gstnumber', label: 'GST Number', type: 'text' },
  { name: 'fssaiNumber', label: 'FSSAI Number', type: 'text' },
  { name: 'openingtime', label: 'Opening Time', type: 'time' },
  { name: 'closingtime', label: 'Closing Time', type: 'time' },
]

const GROUP_SIZE = 3

const Registerform = () => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [touched, setTouched] = useState(false)

  const groups = []
  for (let i = 0; i < fields.length; i += GROUP_SIZE) {
    groups.push(fields.slice(i, i + GROUP_SIZE))
  }

  const currentGroup = groups[step]
  const isLastGroup = step === groups.length - 1

  const isFieldFilled = (field) =>
    String(formData[field.name] ?? '').trim().length > 0

  const isGroupFilled = currentGroup.every(isFieldFilled)

  const handleChange = (fieldName) => (e) => {
    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }))
  }

  const goNext = () => {
    if (!isGroupFilled) {
      setTouched(true)
      return
    }
    setTouched(false)
    if (!isLastGroup) setStep((s) => s + 1)
  }

  const goBack = () => {
    setTouched(false)
    if (step > 0) setStep((s) => s - 1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      goNext()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isGroupFilled) {
      setTouched(true)
      return
    }
    console.log('Form submitted:', formData)
    try {
      const response = await axios.post('http://localhost:3000/api/hotel/register', formData,
         {
    withCredentials: true,
  }

      )
      console.log('Response:', response.data)
      alert('Login to access your account') // Show an alert on successful registration

    } catch (error) {
      console.error('Error submitting form:', error)
    }

  }

  return (
    <div className="bg-white rounded-lg  flex flex-col w-full max-w-md mx-auto p-6 gap-4 justify-center items-center border-none">
      {/* progress */}
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Step {step + 1} of {groups.length}</span>
          <span>{Math.round(((step + 1) / groups.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d2873aff] transition-all duration-300"
            style={{ width: `${((step + 1) / groups.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        {currentGroup.map((field) => {
          const value = formData[field.name] ?? ''
          const showError = touched && !isFieldFilled(field)
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={field.name} className="font-medium text-gray-700">
                {field.label}:
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={value}
                onChange={handleChange(field.name)}
                onKeyDown={handleKeyDown}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  showError
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-[#d2873aff]'
                }`}
              />
              {showError && (
                <p className="text-red-500 text-sm">This field is required to continue.</p>
              )}
            </div>
          )
        })}

        <div className="flex w-full gap-3 mt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="p-3 flex-1 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              Back
            </button>
          )}

          {!isLastGroup ? (
            <button
              type="button"
              onClick={goNext}
              className="p-3 flex-1 bg-[#d2873aff] text-white rounded-lg cursor-pointer hover:bg-[#c07a2f]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="p-3 flex-1 bg-[#d2873aff] text-white rounded-lg cursor-pointer hover:bg-[#c07a2f]"
            >
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Registerform