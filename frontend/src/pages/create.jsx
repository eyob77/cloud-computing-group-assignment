import { Heading, ImageIcon, List, TableIcon, TextQuote, Trash2, Type, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

const CreatePostPage=()=>{
  const fileInputRef = useRef(null);
  const [activeUploadBlock, setActiveUploadBlock] = useState(null);
  const [newPost, setNewPost] = useState({
      title: '',
      description: '',
      blocks: [{ id: '1', type: 'text', content: '' }],
      category: 'Draft'
    });

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
  }
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

    
    setNewPost({ title: '', description: '', blocks: [{ id: Date.now().toString(), type: 'text', content: '' }], category: 'Draft' });
    console.log("Published Post:", createdPost);
  };

  return(
  
              <div className="max-w-2xl mx-auto px-4 mt-10">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="mb-10">
                  <input 
                    type="text"
                    placeholder="Title"
                    className="w-full text-4xl md:text-5xl font-serif font-bold border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-100 mb-2 text-black"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                  <input 
                    type="text"
                    placeholder="Short description..."
                    className="w-full text-xl font-serif text-gray-500 border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-100 italic"
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
                            className="w-full text-xl font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded  placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
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
                            className="w-full text-2xl font-bold font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-200 bg-transparent text-black"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                          />
                        )}
                        {block.type === 'subheading' && (
                          <input 
                            type="text"
                            placeholder="Sub-heading"
                            className="w-full text-xl font-bold font-serif text-gray-700 border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded  placeholder:text-gray-200 bg-transparent"
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
                              className="w-full text-xl font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded  placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
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
                    <button onClick={() => addBlock('image')} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
                      <ImageIcon className="w-4 h-4" /> <span>Image</span>
                    </button>
                    <button 
                  onClick={handlePublish}
                  className="bg-green-600 text-white px-3 py-1 rounded-full font-normal hover:bg-green-700 transition"
                >
                  Publish
                </button>
                  </div>
                </div>
              </div>
  )
}

export default CreatePostPage;