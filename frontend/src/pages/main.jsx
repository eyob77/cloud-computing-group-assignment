import { useEffect, useState } from "react";
import mockData from "../mockData.json"
import { useNavigate } from "react-router-dom";

const Main =()=>{
//     const defaultPosts = [
//     {
//       id: 1,
//       author: "Sarah Drasner",
//       title: "The Future of Design Systems in an AI-Driven World",
//       description: "How generative models are reshaping the way we think about components and consistency.",
//       date: "Dec 12",
//       readTime: "8 min read",
//       category: "Design",
//       image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200&h=200",
//       content: `
//         <p class="font-serif text-xl mb-6">In the past decade, we've moved from static style guides to living design systems. But as we enter the era of AI, the very definition of a "component" is changing.</p>
//         <p class="font-serif text-xl mb-6">Imagine a system that doesn't just provide a button, but understands the context of the user's intent and generates the perfect interaction pattern in real-time. This isn't science fiction anymore.</p>
//         <h2 class="text-2xl font-bold mt-8 mb-4 font-serif">The Shift from Static to Dynamic</h2>
//         <p class="font-serif text-xl mb-6">Static systems were built for predictability. Dynamic systems are built for adaptability. When we use AI to bridge the gap between design and code, we're not just automating tasks; we're enabling a new kind of creativity.</p>
//       `
//     },
//     {
//       id: 2,
//       author: "Marc Andreessen",
//       title: "Software Is Still Eating the World",
//       description: "A decade later, the digital transformation has only accelerated beyond our wildest expectations.",
//       date: "Nov 28",
//       readTime: "12 min read",
//       category: "Tech",
//       image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=200",
//       content: "<p class=\"font-serif text-xl mb-6\">The original thesis held that every industry would eventually become a software industry. Today, we see that happening in healthcare, defense, and even heavy manufacturing...</p>"
//     }
//   ];
    const navigate = useNavigate();
    const defaultPosts = mockData;
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('medium-clone-posts');
        return savedPosts ? JSON.parse(savedPosts) : defaultPosts;
      });
      useEffect(() => {
          localStorage.setItem('medium-clone-posts', JSON.stringify(posts));
        }, [posts]);

    const handlePostClick = (post) => {
        navigate("/article/" + post.id);
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
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
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