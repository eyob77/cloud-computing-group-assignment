import { Bookmark, MoreHorizontal } from "lucide-react";

const Main=({posts, handlePostClick})=>{
  return (
  <div className="max-w-2xl mx-auto space-y-12">
    {posts.map(post => (
      <div key={post.id} className="flex justify-between items-start group">
        <div className="flex-1 pr-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <span className="text-sm font-medium">{post.author}</span>
            </div>
            <h2 
              className="text-xl font-bold mb-2 cursor-pointer group-hover:text-gray-700"
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
            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition">
              <Bookmark className="w-4 h-4 cursor-pointer hover:text-black" />
              <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-black" />
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
  )
}

export default Main;