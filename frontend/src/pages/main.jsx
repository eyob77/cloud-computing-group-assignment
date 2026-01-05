import { useEffect, useState } from "react";
import mockData from "../mockData.json"
import { useNavigate } from "react-router-dom";
import { useGetPosts } from "../hooks/useGetPosts";

const Main = () => {

  const navigate = useNavigate();
  const defaultPosts = mockData;
  const { getPosts } = useGetPosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      try {
        const result = await getPosts();
        if (mounted && Array.isArray(result)) setPosts(result);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    fetchPosts();
    return () => {
      mounted = false;
    };
  }, [getPosts]);


    const handlePostClick = (post) => {
        navigate("/article/" + post._id);
        window.scrollTo(0, 0);
    };
    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-12">
              {posts.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-serif">
                  No stories found. Start writing!
                </div>
              ) : posts.map(post => (
                <div key={post.id} className="flex justify-between items-start group">
                  <div className="flex-1 pr-8"> 
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <span>{post.author.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <h2 
                      className="text-xl font-bold mb-2 cursor-pointer group-hover:text-gray-700 transition-colors"
                      onClick={() => handlePostClick(post)}
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{post.category}</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-sm overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}

export default Main;