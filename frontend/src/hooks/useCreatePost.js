import { useState } from "react";
import { toast } from "react-toastify";


export const useCreatePost = () => {
    const [loading, setLoading] = useState(false);

    const createPost = async (postData) => {
        const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        setLoading(true);


        try {
            const res = await fetch(`${URL}/api/post/create`, {
                method: "POST",
                body: postData,
                credentials: "include"
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }
            setLoading(false);
            toast.success(data.message);
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    return { createPost, loading };
}

