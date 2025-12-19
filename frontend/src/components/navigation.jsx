import { Bell, Search } from "lucide-react";

const Navigation = ({handleBack,view,scrollProgress}) => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl font-bold tracking-tighter cursor-pointer font-serif"
              onClick={handleBack}
            >
              Medium
            </h1>
            <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none focus:ring-0 text-sm w-40"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 font-medium">
            {view !== 'create' && (
              <button 
                onClick={() => setView('create')}
                className="flex items-center space-x-1 hover:text-black"
              >
                <Plus className="w-4 h-4" />
                <span>Write</span>
              </button>
            )}
            {view === 'create' && (
              <button 
                onClick={handlePublish}
                className="bg-green-600 text-white px-3 py-1 rounded-full font-normal hover:bg-green-700 transition"
              >
                Publish
              </button>
            )}
            <Bell className="w-5 h-5 cursor-pointer hover:text-black" />
            <button className="bg-green-600 text-white px-4 py-1.5 rounded-full font-normal hover:bg-green-700 transition">
              Sign up
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer"></div>
          </div>
        </div>
        {view === 'article' && (
          <div 
            className="h-0.5 bg-black transition-all duration-100" 
            style={{ width: scrollProgress }}
          />
        )}
      </nav>
  )
}
export default Navigation;