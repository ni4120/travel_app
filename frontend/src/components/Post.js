import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    axios.get('http://localhost:3001/api/logout')
      .then(response => {
        if (response.data.success) {
          window.location.href = '/';
        } else {
          alert('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
        alert('Logout failed');
      });
  };

  return (
    <div className="post">
      <Header />
      <h1>投稿ページ</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Spot Name" value={spotName} onChange={e => setSpotName(e.target.value)} required />
        <input type="text" placeholder="Recommended Point" value={recommendedPoint} onChange={e => setRecommendedPoint(e.target.value)} required />
        <input type="text" placeholder="Recommended Food" value={recommendedFood} onChange={e => setRecommendedFood(e.target.value)} required />
        <textarea placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} required />
        <input type="file" multiple onChange={handleFileChange} required />
        <input type="hidden" value={latitude} required />
        <input type="hidden" value={longitude} required />
        <button type="submit">投稿</button>
      </form>
      <MapContainer center={[36.2048, 138.2529]} zoom={5} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
      </MapContainer>
    </div>
  );
};

export default Post;
