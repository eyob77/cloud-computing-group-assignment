import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mockData from "../mockData.json"

const Article=()=>{
  const {id} = useParams();
  const navigate = useNavigate();
  
  const selectedPost = mockData.find(d=> d.id.toString() === id);


    const handleBack = () => {
      navigate("/")
    };
  return (
    <div className="max-w-2xl mx-auto px-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-500 hover:text-black mb-10 transition group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to feed
            </button>
            
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4 text-black">
                {selectedPost.title}
              </h1>
              <p className="text-xl text-gray-500 font-serif italic mb-8">
                {selectedPost.description}
              </p>
              
              <div className="flex items-center justify-between py-6 border-y border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-bold text-black">{selectedPost.author}</p>
                    <p className="text-gray-500">{selectedPost.readTime} · {selectedPost.date}</p>
                  </div>
                </div>
              </div>
            </header>

            <div 
              className="font-serif text-xl leading-relaxed text-gray-800 space-y-6 article-content"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </div>
  )
}

export default Article;