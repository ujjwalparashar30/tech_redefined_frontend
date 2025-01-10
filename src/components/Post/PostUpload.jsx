import React, { useRef, useState } from "react";
import { usePostUpload } from "../../store/usePostStore";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

const PostUpload = () => {
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [titleError, setTitleError] = useState(false);
  const [category, setCategory] = useState("Dresses");

  const { authUser } = useAuthStore();

  const title = useRef("");
  const description = useRef("");
  const { uploadPost } = usePostUpload();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleValidation = () => {
    if (!title.current.value.trim()) {
      setTitleError(true);
      return false;
    }
    setTitleError(false);
    return true;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("title", title.current.value);
    formData.append("content", description.current.value);
    formData.append("category", category);
    formData.append("owner", authUser._id);
    

    try {
      const response = await axiosInstance.post("/post/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post uploaded successfully:", response.data);
      alert("Post uploaded successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error uploading post:", error.response.data);
        alert(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else {
        console.error("Network error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    
    <div className="h-[calc(100vh-64px)] flex items-center justify-center linear-gradient(to right, #1a1a2e, #533483) w-screen">
      <div className="w-[100%] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-4">
          <h3 className="text-2xl font-bold text-center text-white">
            Upload Your Post
          </h3>
        </div>

        <form className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Image
              </label>
              <div
                className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
                  image
                    ? "border-green-400 bg-green-50"
                    : "border-purple-300 bg-purple-50 hover:border-purple-400"
                }`}
              >
                {!image ? (
                  <label className="flex flex-col items-center justify-center h-40 cursor-pointer gap-3">
                    <ImagePlus size={32} className="text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload an image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group h-40">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <label className="cursor-pointer text-white font-medium">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a captivating title"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-black"
                  ref={title}
                />
                {titleError && (
                  <p className="mt-1 text-sm text-red-600">
                    Please enter a title
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Share your thoughts..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 h-24 resize-none text-black"
                  ref={description}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-black"
                >
                  <option value="Dresses">Dresses</option>
                  <option value="Outwear">Outwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <button
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpload;
