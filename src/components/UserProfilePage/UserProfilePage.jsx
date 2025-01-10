import React, { useEffect, useState } from "react";
import { Camera, Heart, MessageCircle, Settings } from "lucide-react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import axios from "axios"; // Import axios for the Cloudinary upload

const UserProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/dashboard/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dssioh7gb/image/upload", // Replace with your Cloudinary URL
        formData
      );
      const imageUrl = response.data.secure_url;

      // Update the profile photo in the backend
      await axiosInstance.put(`/update-profile/${id}`, { profilePhoto: imageUrl });

      // Update the state with the new profile photo URL
      setData((prev) => ({ ...prev, profilePhoto: imageUrl }));
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="bg-black min-h-screen px-16"
      style={{ borderRadius: "20px" }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="bg-black rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture Section */}
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-purple-100">
              <img
                src={data.profilePhoto || "/avatar.png"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold text-white">{data.username}</h1>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Follow
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{data.posts.length}</div>
                <div className="text-sm text-gray-500">posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">4,073</div>
                <div className="text-sm text-gray-500">followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">322</div>
                <div className="text-sm text-white">following</div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">{data.username}</h2>
              <p className="text-gray-600">{data.description || "UX/UI Designer"}</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.posts?.map((post, index) => (
              <div
                key={post._id} // Use unique post ID as the key
                className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square"
              >
                <img
                  src={post.image || "/api/placeholder/400/400"} // Dynamically load the image
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="text-white flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      <span className="text-lg">{post.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-lg">{post.commentCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
