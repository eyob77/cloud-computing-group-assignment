import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ChevronLeft,
  Plus,
  Image as ImageIcon,
  Type,
  Trash2,
  Heading,
  List,
  Table as TableIcon,
  Upload,
  X,
  TextQuote,
  GripVertical
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('home'); // 'home', 'article', or 'create'
  const [selectedPost, setSelectedPost] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [activeUploadBlock, setActiveUploadBlock] = useState(null);
  
  // Initial posts data
  const defaultPosts = [
    {
      id: 1,
      author: "Sarah Drasner",
      title: "The Future of Design Systems in an AI-Driven World",
      description: "How generative models are reshaping the way we think about components and consistency.",
      date: "Dec 12",
      readTime: "8 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200&h=200",
      content: `
        <p class="font-serif text-xl mb-6">In the past decade, we've moved from static style guides to living design systems. But as we enter the era of AI, the very definition of a "component" is changing.</p>
        <p class="font-serif text-xl mb-6">Imagine a system that doesn't just provide a button, but understands the context of the user's intent and generates the perfect interaction pattern in real-time. This isn't science fiction anymore.</p>
        <h2 class="text-2xl font-bold mt-8 mb-4 font-serif">The Shift from Static to Dynamic</h2>
        <p class="font-serif text-xl mb-6">Static systems were built for predictability. Dynamic systems are built for adaptability. When we use AI to bridge the gap between design and code, we're not just automating tasks; we're enabling a new kind of creativity.</p>
      `
    },
    {
      id: 2,
      author: "Marc Andreessen",
      title: "Software Is Still Eating the World",
      description: "A decade later, the digital transformation has only accelerated beyond our wildest expectations.",
      date: "Nov 28",
      readTime: "12 min read",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=200",
      content: "<p class=\"font-serif text-xl mb-6\">The original thesis held that every industry would eventually become a software industry. Today, we see that happening in healthcare, defense, and even heavy manufacturing...</p>"
    }
  ];

  // Initialize state from LocalStorage or Default
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('medium-clone-posts');
    return savedPosts ? JSON.parse(savedPosts) : defaultPosts;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('medium-clone-posts', JSON.stringify(posts));
  }, [posts]);

  // New Post State with Blocks
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    blocks: [{ id: '1', type: 'text', content: '' }],
    category: 'Draft'
  });

  // Tracking scroll for article progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}%`;
      setScrollProgress(scroll);
    };

    if (view === 'article') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setView('article');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelectedPost(null);
  };

  // Local Image Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activeUploadBlock) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(activeUploadBlock, reader.result);
        setActiveUploadBlock(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (blockId) => {
    setActiveUploadBlock(blockId);
    fileInputRef.current.click();
  };

  // Block Editor Helpers
  const addBlock = (type) => {
    const newBlock = { 
      id: Date.now().toString(), 
      type, 
      content: type === 'image' ? '' : 
               type === 'table' ? 'Header 1, Header 2\nRow 1 Col 1, Row 1 Col 2' : '',
    };
    setNewPost(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (id, content) => {
    setNewPost(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content } : b)
    }));
  };

  const removeBlock = (id) => {
    // We allow removing the last block, but will add a fresh text block if empty
    setNewPost(prev => {
      const filtered = prev.blocks.filter(b => b.id !== id);
      return {
        ...prev,
        blocks: filtered.length > 0 ? filtered : [{ id: Date.now().toString(), type: 'text', content: '' }]
      };
    });
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
    setView('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Navigation */}
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
            {view !== 'create' && (
              <button 
                onClick={() => setView('create')}
                className="flex items-center space-x-1 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Write</span>
              </button>
            )}
            {view === 'create' && (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setView('home')}
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

      <main className="pt-24 pb-20">
        {view === 'home' && (
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
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPosts(posts.filter(p => p.id !== post.id));
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        )}

        {view === 'article' && selectedPost && (
          <div className="max-w-2xl mx-auto px-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-500 hover:text-black mb-10 transition group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to feed
            </button>
            
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4 text-black">
                {selectedPost.title}
              </h1>
              <p className="text-xl text-gray-500 font-serif italic mb-8">
                {selectedPost.description}
              </p>
              
              <div className="flex items-center justify-between py-6 border-y border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-bold text-black">{selectedPost.author}</p>
                    <p className="text-gray-500">{selectedPost.readTime} · {selectedPost.date}</p>
                  </div>
                </div>
              </div>
            </header>

            <div 
              className="font-serif text-xl leading-relaxed text-gray-800 space-y-6 article-content"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-2xl mx-auto px-4 mt-10">
            <div className="mb-10">
              <input 
                type="text"
                placeholder="Title"
                className="w-full text-4xl md:text-5xl font-serif font-bold border-none focus:ring-0 placeholder:text-gray-100 mb-2 text-black"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <input 
                type="text"
                placeholder="Short description..."
                className="w-full text-xl font-serif text-gray-500 border-none focus:ring-0 placeholder:text-gray-100 italic"
                value={newPost.description}
                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              {newPost.blocks.map((block) => (
                <div key={block.id} className="relative group flex items-start -mx-12 px-12 py-2 hover:bg-gray-50/50 rounded-xl transition-colors">
                  {/* Block Tools */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeBlock(block.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove Block"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    {block.type === 'text' && (
                      <textarea 
                        placeholder="Tell your story..."
                        className="w-full text-xl font-serif border-none focus:ring-0 placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
                        value={block.content}
                        onChange={(e) => {
                          updateBlock(block.id, e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                    )}
                    {block.type === 'heading' && (
                      <input 
                        type="text"
                        placeholder="Section Heading"
                        className="w-full text-2xl font-bold font-serif border-none focus:ring-0 placeholder:text-gray-200 bg-transparent text-black"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                      />
                    )}
                    {block.type === 'subheading' && (
                      <input 
                        type="text"
                        placeholder="Sub-heading"
                        className="w-full text-xl font-bold font-serif text-gray-700 border-none focus:ring-0 placeholder:text-gray-200 bg-transparent"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                      />
                    )}
                    {block.type === 'image' && (
                      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4 min-h-40 flex flex-col items-center justify-center transition-colors hover:border-gray-300">
                        {block.content ? (
                          <div className="relative w-full group/img">
                            <img src={block.content} className="w-full h-auto rounded-lg shadow-sm" alt="Uploaded" />
                            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <button 
                                onClick={() => triggerUpload(block.id)}
                                className="bg-white/90 p-1.5 rounded-full shadow-md text-gray-600 hover:text-black transition"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateBlock(block.id, '')}
                                className="bg-white/90 p-1.5 rounded-full shadow-md text-red-500 hover:text-red-700 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => triggerUpload(block.id)}
                            className="flex flex-col items-center space-y-2 text-gray-400 hover:text-gray-600 transition"
                          >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Upload className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium">Click to upload image</span>
                          </button>
                        )}
                      </div>
                    )}
                    {block.type === 'list' && (
                      <div className="flex items-start">
                        <span className="text-gray-300 mt-2 mr-4">•</span>
                        <textarea 
                          placeholder="List items (one per line)..."
                          className="w-full text-xl font-serif border-none focus:ring-0 placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
                          value={block.content}
                          onChange={(e) => {
                            updateBlock(block.id, e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                    )}
                    {block.type === 'table' && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <textarea 
                          placeholder="Name, Role, Location&#10;Alice, Designer, NY"
                          className="w-full text-base font-mono bg-transparent border-none focus:ring-0 placeholder:text-gray-300 resize-none overflow-hidden min-h-20"
                          value={block.content}
                          onChange={(e) => {
                            updateBlock(block.id, e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 items-center py-8 border-t border-gray-100 mt-10">
                <button onClick={() => addBlock('text')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <Type className="w-4 h-4" /> <span>Text</span>
                </button>
                <button onClick={() => addBlock('heading')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <Heading className="w-4 h-4" /> <span>Heading</span>
                </button>
                <button onClick={() => addBlock('subheading')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <TextQuote className="w-4 h-4" /> <span>Sub-heading</span>
                </button>
                <button onClick={() => addBlock('list')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <List className="w-4 h-4" /> <span>List</span>
                </button>
                <button onClick={() => addBlock('table')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <TableIcon className="w-4 h-4" /> <span>Table</span>
                </button>
                <button onClick={() => addBlock('image')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                  <ImageIcon className="w-4 h-4" /> <span>Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
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