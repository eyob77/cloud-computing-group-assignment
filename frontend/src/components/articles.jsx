import { Bookmark, ChevronLeft, HandMetal, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";

const Article=({selectedPost, handleBack, claps, setClaps})=>{
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
                  <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4">
                    {selectedPost.title}
                  </h1>
                  <p className="text-xl text-gray-500 font-serif italic mb-8">
                    {selectedPost.description}
                  </p>
                  
                  <div className="flex items-center justify-between py-6 border-y border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold">{selectedPost.author}</p>
                          <span className="text-green-600 font-medium cursor-pointer">Follow</span>
                        </div>
                        <p className="text-gray-500">{selectedPost.readTime} · {selectedPost.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <Share2 className="w-5 h-5 cursor-pointer hover:text-black" />
                      <Bookmark className="w-5 h-5 cursor-pointer hover:text-black" />
                    </div>
                  </div>
                </header>
    
                <div 
                  className="font-serif text-xl leading-relaxed text-gray-800 space-y-6 article-content"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
    
                {/* Footer Interaction */}
                <footer className="mt-16 pt-10 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button 
                        onClick={() => setClaps(c => c + 1)}
                        className="flex items-center space-x-2 hover:text-black transition active:scale-110"
                      >
                        <HandMetal className={`w-6 h-6 ${claps > 0 ? 'text-green-600 fill-green-50' : ''}`} />
                        <span>{claps}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-black transition">
                        <MessageCircle className="w-6 h-6" />
                        <span>12</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <Share2 className="w-5 h-5" />
                      <MoreHorizontal className="w-5 h-5" />
                    </div>
                  </div>
                </footer>
              </div>
  )
}
export default Article;