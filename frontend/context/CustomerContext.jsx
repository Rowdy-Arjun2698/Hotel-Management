// CustomerContext.jsx

import { createContext, useState } from "react";

export const CustomerContext = createContext();

export const CustomerProvider = ({children}) => {

    const [hotel,setHotel] = useState(null);
    const [table,setTable] = useState(null);
    const [session,setSession] = useState(null);
    const [url,seturl]=useState(import.meta.env.VITE_BACKEND_URL);

    const clearSession = () => {
        setHotel(null);
        setTable(null);
        setSession(null);
    }

    return (
        <CustomerContext.Provider
            value={{
                hotel,
                table,
                session,
                setHotel,
                setTable,
                setSession,
                clearSession,
                url
            }}
        >
            {children}
        </CustomerContext.Provider>
    )
}