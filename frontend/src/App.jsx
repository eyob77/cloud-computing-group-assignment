
import CreatePostPage from './pages/create';
import NavBar from './components/NavBar';
import Main from './pages/main';
import Article from './pages/article';
import HomePage from './pages/home';


import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';


 function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openSignIn({
        mode: "modal",

        // If user closes the modal → go back
        onClose: () => {
          navigate(-1);
        },

      });
    }
  }, [isLoaded, isSignedIn, openSignIn, navigate,]);

  if (!isLoaded) return <Navigate to="/" />;

  // Block page access while modal is open
  if (!isSignedIn) return <Navigate to="/" />;;

  return children;
}

const App = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <NavBar/>

      <main className="pt-24 pb-20">
        <Routes>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/create' element={
            <ProtectedRoute>
              <CreatePostPage/>
            </ProtectedRoute>
          }/>
          <Route path='/' element={<Main/>}/>
          <Route path='/article/:id' element={<Article/>}/>
        </Routes>

      </main>

      <style>{`
        .font-serif { font-family: 'Charter', 'Georgia', serif; }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content img { max-width: 100%; height: auto; display: block; border-radius: 0.5rem; }
        .article-content h2 { margin-top: 2rem; margin-bottom: 1rem; color: #000; }
        .article-content h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; color: #333; }
        table { border-spacing: 0; width: 100%; }
        th, td { padding: 0.75rem 0.5rem; text-align: left; }
        textarea::placeholder, input::placeholder { color: #e5e7eb; }
      `}</style>
    </div>
  );
};

export default App;