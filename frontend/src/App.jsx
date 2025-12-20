import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ChevronLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import CreatePostPage from './pages/create';
import NavBar from './components/NavBar';
import Main from './pages/main';
import Article from './pages/article';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <NavBar/>

      <main className="pt-24 pb-20">
        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/create' element={<CreatePostPage/>}/>
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