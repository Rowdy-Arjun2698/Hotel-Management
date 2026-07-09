import React from 'react'
import {useState} from 'react'
import Loginform from '../components/Loginform'
import Registerform from '../components/Registerform'
const Login = () => {
  const [space, setSpace] = useState({})
  const [isLogin, setIsLogin] = useState(true)

  return (
    <>
    <div className="big min-h-screen bg-white flex ">
        <div className="anoter  w-[45vw] bg-white  flex justify-center items-center ">
         
            <div className={'add w-[60%] h-[80%] bg-gray-100 border-2 shadow-[#d2873aff] shadow-2xl border-gray-300 rounded-2xl flex flex-col  items-center gap-8 ${isLogin ? "" : "space-y-4"}'}>
                  <div className="another w-[80%] h-[10%] mt-4 bg-gra flex flex-row justify-center items-center border-gray-300 border-2 rounded-2xl">
                <button className={`p-3 ${isLogin ? "bg-[#d2873aff]" : "bg-transparent"} rounded-2xl h-full w-[50%] text-1.5xl  cursor-pointer`} onClick={() => setIsLogin(true)}>Log in</button>
                <button className={`p-3 ${isLogin ? "bg-transparent" : "bg-[#d2873aff]"} rounded-2xl h-full w-[50%] text-1.5xl  cursor-pointer`} onClick={() => setIsLogin(false)}>Register</button>
            </div>
                    {isLogin ? <Loginform /> : <Registerform />}
            </div>
        </div>
        <div className="anoter  w-[55vw] bg-green-400 ">
          
        </div>
    </div>
    </>
  )
}

export default Login
