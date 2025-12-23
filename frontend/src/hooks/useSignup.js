import { useState } from "react";
import { useAuthContext } from "../context/authContext";

export const useSignup =  ()=>{
  const [loading,setLoading] = useState(false);
  const {setUser} = useAuthContext();
  const syncUser = async(token)=>{
    if(!token){
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if(data.error){
        throw new Error(data.error);
      }
      setUser(data);      
      
    } catch (error) {
      console.log("error fetching user:", error);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  }

  return {syncUser,loading};
}