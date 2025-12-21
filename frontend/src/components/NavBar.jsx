import { Bell, Plus } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const NavBar=()=>{
  const {pathname} = useLocation();
  const navigate = useNavigate();
  
  
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const handleBack = () => {
    navigate("/");
  };
  
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
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 font-medium">
            {(!pathname.includes("create")) && (
              <button 
                onClick={() => navigate("/create")}
                className="flex items-center space-x-1 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Write</span>
              </button>
            )}
            {pathname.includes("create") && (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => navigate("/")}
                  className="text-gray-400 hover:text-black transition"
                >
                  Cancel
                </button>
              </div>
            )}
            <Bell className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
            <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:opacity-80 transition-opacity"></div>
          </div>
        </div>
        
      </nav>
  )
}

export default NavBar;