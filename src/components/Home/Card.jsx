import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import "./Card.css";
import { axiosInstance } from "../../lib/axios";

function Card({ id, src, title, description,likeCount }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  const [count, setCount] = useState(likeCount);

  const handleLike = async() => {
      if(liked){
        const response = await axiosInstance.put(`/post/liked/${id}`,{
          liked: -1
        })
        console.log(response.data.likeCount)
        setCount(count=>count- 1);
      }
      
    
    else {
      const response = await axiosInstance.put(`/post/liked/${id}`,{
        liked: 1
      })
      console.log(response.data.likeCount)
      setCount(count=>count+ 1);
    }
    
    setLiked(!liked);
  };

  const handleCardClick = () => {
    navigate(`/post/${id}`); // Navigate to the PostView page with post ID
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={src} alt={title} />
      <div className="card__info">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="card__actions">
        <h1>{count}</h1>
          <button
            className="like-button mr-10"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click event
              handleLike();
            }}
          >
            <HeartIcon
              className={`heart-icon ${liked ? "liked" : ""}`}
              width={24}
              height={24}
            />
          </button>
          
          <button
            className="comment-button"
            onClick={(e) => e.stopPropagation()} // Prevent triggering the card click event
          >
            <ChatBubbleLeftIcon className="chat-icon" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
