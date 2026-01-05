import { useState } from "react"


export const useGetPostById = ()=>{
    const [loading,setLoading] = useState(false)

    const getPostById = async (id) =>{
                const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

        setLoading(true);
        try {
            const result = await fetch(`${URL}/api/post/id/${id}`);
            const data = await result.json();
            if(data.error){
                throw new Error(data.error);
            }
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.log("Error fetching post by ID:", error);
        }finally{
            setLoading(false);
        }
    }

    return {loading,getPostById}
}