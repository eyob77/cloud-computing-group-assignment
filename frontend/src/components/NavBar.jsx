import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Bell, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { useEffect } from "react";


const NavBar=()=>{
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {syncUser} = useSignup();
  const {getToken} = useAuth(); 
  const { isSignedIn, isLoaded } = useUser();

  const synchronizeUser = async () => {
    const token = await getToken();
    await syncUser(token);
  };

  useEffect(()=>{
    if(isSignedIn && isLoaded){
      synchronizeUser();
    }
  },[isSignedIn,isLoaded]);
  
  
  
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
            <div className="flex items-center ">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 bg-black text-white rounded-sm text-xs hover:opacity-80 transition-opacity">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="ml-4 px-4 py-1.5 border border-black text-black rounded-sm text-xs hover:opacity-80 transition-opacity">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                  <UserButton/>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
        
      </nav>
  )
}

export default NavBar;