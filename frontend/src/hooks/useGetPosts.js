import { useState } from "react";


export const useGetPosts = ()=>{
    const [loading,setLoading] = useState(false);

    const getPosts = async () =>{
        setLoading(true);
         const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


        try {
            const res = await fetch(`${URL}/api/post`);

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data;
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }finally{
            setLoading(false);

        }
    }

    return {loading,getPosts}
}