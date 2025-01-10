import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export const usePostUpload = () => {
  const navigate = useNavigate();

  const uploadPost = async (title, content, image) => {
    try {
      const response = await axiosInstance.post('/post/new', {
        title,
        content,
        image,
      });
      if (response.status === 201) {
        navigate('/home'); // Programmatic navigation
      } else {
        console.log('Failed to upload post:', response.data);
      }
    } catch (error) {
      console.error('Error uploading post:', error.message);
    }
  };

  return { uploadPost };
};
