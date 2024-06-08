// MyPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from './Header';
import './css/MyPage.css';


const customIcon = new L.Icon({
  iconUrl: './img/travel_pin.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MyPage = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/my-spots`, { withCredentials: true });
        setSpots(response.data);
      } catch (error) {
        console.error('Error fetching spots:', error);
        alert('Failed to fetch spots. Please try again later.');
      }
    };
    fetchSpots();
  }, []);

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  const handleDelete = async (spotId) => {
    const confirmed = window.confirm('削除しますか?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3001/api/spots/${spotId}`, { withCredentials: true });
      if (response.data.success) {
        setSpots(spots.filter(spot => spot.id !== spotId));
        setSelectedSpot(null);
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    const stars = document.querySelector(".stars");
    const createStar = () => {
      const starEl = document.createElement("span");
      starEl.className = "star";
      const minSize = 1;
      const maxSize = 2;
      const size = Math.random() * (maxSize - minSize) + minSize;
      starEl.style.width = `${size}px`;
      starEl.style.height = `${size}px`;
      starEl.style.left = `${Math.random() * 100}%`;
      starEl.style.top = `${Math.random() * 100}%`;
      starEl.style.animationDelay = `${Math.random() * 10}s`;
      stars.appendChild(starEl);
    };

    for (let i = 0; i <= 500; i++) {
      createStar();
    }
  }, []);

  return (
    <div className="stars">
      <Header />
      <img src="./img/city.png" className="city"></img>
      <div className="mt-8 lg:mt-6 px-4 lg:px-16">
        <h2 className="text-2xl mb-4 text-center">My Spots</h2>
        <div className="w-full mb-8">
          <MapContainer center={[36.2048, 138.2529]} zoom={5} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {spots.map(spot => (
              <Marker
                key={spot.id}
                position={[spot.latitude, spot.longitude]}
                icon={customIcon}
                eventHandlers={{ click: () => handleMarkerClick(spot) }}
              >
                <Popup>
                  <h2 className="font-bold">{spot.spotName}</h2>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="text-center mt-8">
          {selectedSpot && (
            <div className="text-left inline-block w-full lg:w-1/2 mx-auto bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold">{selectedSpot.spotName}</h2>
              <p><strong>おすすめポイント:</strong> {selectedSpot.recommendedPoint}</p>
              <p><strong>おすすめの食べ物:</strong> {selectedSpot.recommendedFood}</p>
              <p><strong>感想など:</strong> {selectedSpot.comment}</p>
              {selectedSpot.images && JSON.parse(selectedSpot.images).map((image, index) => (
                <img key={index} src={`http://localhost:3001${image}`} alt={selectedSpot.spotName} className="w-64 block mx-auto my-2" />
              ))}
              <button onClick={() => handleDelete(selectedSpot.id)} className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
