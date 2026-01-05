import { Heading, ImageIcon, List, TextQuote, Trash2, Type, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useCreatePost } from "../hooks/useCreatePost";
import { useAuthContext } from "../context/authContext";

const CreatePostPage = () => {
  const fileInputRef = useRef(null);
  const [activeUploadBlock, setActiveUploadBlock] = useState(null);

  const {createPost,loading} = useCreatePost();
  const {user} = useAuthContext()

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blocks: [{ id: "1", type: "text", content: "" }],
    category: "Draft"
  });

  const addBlock = (type) => {
    const id = Date.now().toString();

    setNewPost((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          id,
          type,
          content: "",
          imageId: type === "image" ? `image-${id}` : null,
          file: null
        }
      ]
    }));
  };


  const updateBlock = (id, updates) => {
    setNewPost((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    }));
  };

  const removeBlock = (id) => {
    setNewPost((prev) => {
      const filtered = prev.blocks.filter((b) => b.id !== id);
      return {
        ...prev,
        blocks: filtered.length > 0 ? filtered : [{ id: Date.now().toString(), type: "text", content: "" }]
      };
    });
  };

  const triggerUpload = (blockId) => {
    setActiveUploadBlock(blockId);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !activeUploadBlock) return;

    updateBlock(activeUploadBlock, {
      file,
      content: URL.createObjectURL(file)
    });

    setActiveUploadBlock(null);
    e.target.value = "";
  };

  // const handlePublish = async () => {
  //   if (!newPost.title) return;

  //   const formData = new FormData();
  //   const contents = [];
  //   let currentListItems = [];

  //   newPost.blocks.forEach((block, index) => {
  //     if ((!block.content || block.content.trim() === "") && !block.file) return;

  //     // List block handling
  //     if (block.type === "list") {
  //       currentListItems.push(block.content.trim());
  //       return;
  //     }

  //     // Flush collected list items
  //     if (currentListItems.length) {
  //       contents.push({ type: "list", content: currentListItems.join("\n") });
  //       currentListItems = [];
  //     }

  //     // Image block handling
  //     if (block.type === "image") {
  //       contents.push({ type: "image", imageIndex: index }); // placeholder
  //       if (block.file) formData.append("images", block.file); // attach file
  //       return;
  //     }

  //     // All other blocks
  //     contents.push({
  //       type: block.type === "text" ? "paragraph" : block.type,
  //       content: block.content
  //     });
  //   });

  //   // Flush remaining list items
  //   if (currentListItems.length) {
  //     contents.push({ type: "list", content: currentListItems.join("\n") });
  //   }

  //   // Append post JSON
  //   const postData = {
  //     title: newPost.title,
  //     description: newPost.description,
  //     category: newPost.category,
  //     contents
  //   };
  //   console.log(postData)
  //   formData.append("post", JSON.stringify(postData));


  //     // Reset editor
  //     setNewPost({
  //       title: "",
  //       description: "",
  //       blocks: [{ id: Date.now().toString(), type: "text", content: "" }],
  //       category: "Draft"
  //     });
      

  //   };

  const handlePublish = async () => {
    if (!newPost.title) return;

    const formData = new FormData();
    const contents = [];
    let currentListItems = [];

    newPost.blocks.forEach((block) => {
      if ((!block.content || block.content.trim() === "") && !block.file) return;

      // Collect list items
      if (block.type === "list") {
        currentListItems.push(block.content.trim());
        return;
      }

      // Flush list items when encountering a non-list block
      if (currentListItems.length) {
        contents.push({ type: "list", content: currentListItems.join("\n") });
        currentListItems = [];
      }

      // Image blocks: set content to imageId so server can map uploaded files
      if (block.type === "image") {
        contents.push({ type: "image", content: block.imageId || block.id });
        if (block.file) {
          formData.append("images", block.file, block.imageId || block.id);
        }
        return;
      }

      // Map editor types to schema types (text -> paragraph)
      contents.push({ type: block.type === "text" ? "paragraph" : block.type, content: block.content });
    });

    if (currentListItems.length) {
      contents.push({ type: "list", content: currentListItems.join("\n") });
    }

    // Build required post metadata to match Mongoose schema
    const date = new Date().toISOString();

    // Estimate readTime (200 wpm)
    const totalWords = contents.reduce((acc, c) => {
      if (!c.content) return acc;
      return acc + c.content.split(/\s+/).filter(Boolean).length;
    }, 0);
    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    const readTime = `${minutes} min`;

    // Use first image content (imageId) as post image if available
    const firstImage = contents.find((c) => c.type === "image");
    const image = firstImage ? firstImage.content : "";

    const postData = {
      author: user?.email || "",
      title: newPost.title,
      description: newPost.description,
      date,
      readTime,
      category: newPost.category,
      image,
      contents
    };

    formData.append("post", JSON.stringify(postData));

    await createPost(formData);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setNewPost({
      title: "",
      description: "",
      blocks: [{ id: Date.now().toString(), type: "text", content: "" }],
      category: "Draft"
    });
  };

  

  return (
    <div className="max-w-2xl mx-auto px-4 mt-10 relative">
      {loading && <div className="fixed top-0 left-0 text-center w-full h-full z-100 opacity-50">Loading...</div>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="mb-10">
        <input
          type="text"
          placeholder="Title"
          className="w-full text-4xl md:text-5xl font-serif font-bold border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-100 mb-2 text-black"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Short description..."
          className="w-full text-xl font-serif text-gray-500 border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-100 italic"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        {newPost.blocks.map((block) => (
          <div
            key={block.id}
            className="relative group flex items-start -mx-12 px-12 py-2 hover:bg-gray-50/50 rounded-xl transition-colors"
          >
            {/* Block tools */}
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
              {/* Text */}
              {block.type === "text" && (
                <textarea
                  placeholder="Tell your story..."
                  className="w-full text-xl font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
                  value={block.content}
                  onChange={(e) => {
                    updateBlock(block.id, { content: e.target.value });
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              )}

              {/* Heading */}
              {block.type === "heading" && (
                <input
                  type="text"
                  placeholder="Section Heading"
                  className="w-full text-2xl font-bold font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-200 bg-transparent text-black"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                />
              )}

              {/* Subheading */}
              {block.type === "subheading" && (
                <input
                  type="text"
                  placeholder="Sub-heading"
                  className="w-full text-xl font-bold font-serif text-gray-700 border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-200 bg-transparent"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                />
              )}

              {/* Image */}
              {block.type === "image" && (
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
                          onClick={() => updateBlock(block.id, { content: "", file: null })}
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

              {/* List */}
              {block.type === "list" && (
                <div className="flex items-start">
                  <span className="text-gray-300 mt-2 mr-4">•</span>
                  <textarea
                    placeholder="List items (one per line)..."
                    className="w-full text-xl font-serif border-none focus:ring-3 focus:p-4 focus:ring-gray-300 focus:rounded placeholder:text-gray-200 resize-none overflow-hidden min-h-10 bg-transparent text-gray-800"
                    value={block.content}
                    onChange={(e) => {
                      updateBlock(block.id, { content: e.target.value });
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2 items-center py-8 border-t border-gray-100 mt-10">
          <button onClick={() => addBlock("text")} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
            <Type className="w-4 h-4" /> <span>Text</span>
          </button>
          <button onClick={() => addBlock("heading")} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
            <Heading className="w-4 h-4" /> <span>Heading</span>
          </button>
          <button onClick={() => addBlock("subheading")} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
            <TextQuote className="w-4 h-4" /> <span>Sub-heading</span>
          </button>
          <button onClick={() => addBlock("list")} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
            <List className="w-4 h-4" /> <span>List</span>
          </button>
          <button onClick={() => addBlock("image")} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-full text-sm text-gray-500 hover:text-black transition">
            <ImageIcon className="w-4 h-4" /> <span>Image</span>
          </button>

          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-3 py-1 rounded-full font-normal hover:bg-green-700 transition"
            disabled={loading}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
