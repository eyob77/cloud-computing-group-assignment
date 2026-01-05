import { useState } from "react";


export const useGetPosts = ()=>{
    const [loading,setLoading] = useState(false);

    const getPosts = async () =>{
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/post");

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