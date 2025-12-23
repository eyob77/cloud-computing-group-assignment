import { useContext,createContext, useState } from "react";


const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children}) => {
  const [user,setUser] = useState(null);
  return (
    <AuthContext.Provider value={{user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
    
}