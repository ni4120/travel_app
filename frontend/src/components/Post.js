import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/Post.css';
import Header from './Header';

// Custom icon definition
const customIcon = new L.Icon({
  iconUrl: './img/travel_pin.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Post = () => {
  const [spotName, setSpotName] = useState('');
  const [recommendedPoint, setRecommendedPoint] = useState('');
  const [recommendedFood, setRecommendedFood] = useState('');
  const [comment, setComment] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setImages(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('spotName', spotName);
    formData.append('recommendedPoint', recommendedPoint);
    formData.append('recommendedFood', recommendedFood);
    formData.append('comment', comment);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://localhost:3001/api/post', formData, { withCredentials: true });
      if (response.data.success) {
        navigate('/mypage'); // 投稿成功後にマイページにリダイレクト
      } else {
        alert('投稿に失敗しました。');
      }
    } catch (error) {
      console.error('投稿中にエラーが発生しました:', error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        setMarkerPosition(e.latlng);
      }
    });
    return null;
  };

  return (
    <div className="stars">
    <div className="text-center">
      <Header />
      <div className="post mt-16">
        <h1 className="text-3xl font-bold mb-8">投稿ページ</h1>
        <form onSubmit={handleSubmit} className="mx-auto space-y-6 max-w-md">
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="spotName" className="block text-sm font-medium text-gray-700">
                Spot Name
              </label>
              <input 
                type="text" 
                value={spotName} 
                className="mt-1 w-64 h-24 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                onChange={e => setSpotName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="recommendedPoint" className="block text-sm font-medium text-gray-700">
                Recommended Point
              </label>
              <input 
                type="text" 
                value={recommendedPoint} 
                className="mt-1 w-64 h-24 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                onChange={e => setRecommendedPoint(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="recommendedFood" className="block text-sm font-medium text-gray-700">
                Recommended Food
              </label>
              <input 
                type="text" 
                value={recommendedFood} 
                className="mt-1 w-64 h-24 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                onChange={e => setRecommendedFood(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea 
                value={comment} 
                className="mt-1 w-64 h-24 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                onChange={e => setComment(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Spot Image
              </label>
              <input 
                type="file" 
                multiple 
                className="mt-1 w-64 h-24 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                onChange={handleFileChange} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            投稿
          </button>
        </form>
        <div className="mt-16 px-4 lg:px-16">
          <h2 className="text-2xl mb-4">My Spots</h2>
          <div className="w-full mb-8">
            <MapContainer center={[36.2048, 138.2529]} zoom={5} style={{ height: "400px", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler /> 
              {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Post;
