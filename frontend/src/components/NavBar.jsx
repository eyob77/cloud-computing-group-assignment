import { Bell, Plus } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const NavBar=()=>{
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState('home'); // 'home', 'article', or 'create'
  
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const handleBack = () => {
    setView('home');
    setSelectedPost(null);
  };
  const handlePublish = () => {
    if (!newPost.title || newPost.blocks.length === 0) return;
    
    // Convert blocks to HTML for the viewer
    const htmlContent = newPost.blocks.map(block => {
      if (block.type === 'heading') return `<h2 class="text-2xl font-bold mt-8 mb-4 font-serif text-black">${block.content}</h2>`;
      if (block.type === 'subheading') return `<h3 class="text-xl font-bold mt-6 mb-3 font-serif text-gray-800">${block.content}</h3>`;
      if (block.type === 'image' && block.content) return `<img src="${block.content}" class="w-full rounded-lg my-8" alt="Article image" />`;
      if (block.type === 'list') {
        const items = block.content.split('\n').filter(i => i.trim() !== '');
        return `<ul class="list-disc list-outside ml-6 space-y-2 my-4 font-serif text-xl">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      }
      if (block.type === 'table') {
        const rows = block.content.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        if (rows.length === 0) return '';
        const header = rows[0];
        const body = rows.slice(1);
        return `
          <div class="overflow-x-auto my-8">
            <table class="w-full text-left border-collapse font-serif text-lg">
              <thead>
                <tr class="border-b-2 border-gray-100">
                  ${header.map(h => `<th class="py-3 font-bold">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${body.map(row => `
                  <tr class="border-b border-gray-50">
                    ${row.map(cell => `<td class="py-3 text-gray-600">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
      return `<p class="font-serif text-xl mb-6 text-gray-800">${block.content.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    const createdPost = {
      id: Date.now(),
      author: "You",
      title: newPost.title,
      description: newPost.description,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      readTime: "1 min read",
      category: newPost.category,
      image: newPost.blocks.find(b => b.type === 'image')?.content || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=200&h=200",
      content: htmlContent
    };

    setPosts([createdPost, ...posts]);
    setNewPost({ title: '', description: '', blocks: [{ id: Date.now().toString(), type: 'text', content: '' }], category: 'Draft' });
    navigate("/")
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
                <button 
                  onClick={handlePublish}
                  className="bg-green-600 text-white px-3 py-1 rounded-full font-normal hover:bg-green-700 transition"
                >
                  Publish
                </button>
              </div>
            )}
            <Bell className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
            <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:opacity-80 transition-opacity"></div>
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

export default NavBar;