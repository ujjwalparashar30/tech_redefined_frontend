import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Banner.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { axiosInstance } from '../../lib/axios'; // Uncomment if axiosInstance is predefined

function Banner() {
  const [opacity, setOpacity] = useState(1);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axiosInstance.get('/post'); // Replace with axiosInstance if available
        if (Array.isArray(response.data)) {
          setCardData(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setCardData([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setCardData([]);
      }
    }

    fetchPosts();
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const fadeValue = Math.max(1 - scrollPosition / 500, 0);
    setOpacity(fadeValue);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
    adaptiveHeight: true,
    dots: true,
    prevArrow: null, // Remove the "Previous" button
  };

  return (
    <div className="banner">
      <Slider {...settings} className="banner__slider">
        {cardData.length > 0 ? (
          cardData.map((item) => (
            <div
              className="banner__slide"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.title}
                className="banner__image"
                style={{ opacity }}
              />
              <div className="banner__overlay">
                <h3 className="banner__title">{item.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="banner__placeholder">
            No posts available
          </div>
        )}
      </Slider>
    </div>
  );
}

export default Banner;
