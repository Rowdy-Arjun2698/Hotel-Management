import React from 'react'
import { useState } from 'react'
import Loginform from '../components/Loginform'
import Registerform from '../components/Registerform'
import HeroPanel from '../components/HeroPanel'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left: form panel */}
      <div className="flex w-full items-center justify-center px-6 lg:w-[45vw]">
        <div
  className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-black/5 bg-white p-6"
  style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
>
          {/* animated tab switcher */}
          <div className="relative mt-4 flex h-12 w-[80%] rounded-2xl border-2 border-gray-300 p-1">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#D97B3F] transition-all duration-300 ease-out"
              style={{ left: isLogin ? "4px" : "calc(50% + 0px)" }}
            />
            <button
              className={`relative z-10 w-1/2 cursor-pointer rounded-xl text-sm font-semibold transition-colors duration-300 ${
                isLogin ? "text-white" : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Log in
            </button>
            <button
              className={`relative z-10 w-1/2 cursor-pointer rounded-xl text-sm font-semibold transition-colors duration-300 ${
                !isLogin ? "text-white" : "text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <div key={isLogin ? "login" : "register"} style={{ animation: "fade-slide-in 0.35s ease-out" }} className="w-full">
            {isLogin ? <Loginform /> : <Registerform />}
          </div>
        </div>
      </div>

      {/* Right: animated hero */}
      <div className="hidden lg:block lg:w-[55vw]">
        <HeroPanel />
      </div>
    </div>
  )
}

export default Login