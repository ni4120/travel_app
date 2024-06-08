import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

const UserSpots = () => {
  const { userId } = useParams();
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      const response = await axios.get(`http://localhost:3001/api/user-spots/${userId}`);
      setSpots(response.data);
    };
    fetchSpots();
  }, [userId]);

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  return (
    <div className="bg-cyan-50 min-h-screen">
      <Header/>
      <h2 className="text-2xl mb-4">User's Spots</h2>
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
      <div class="text-center mt-8 bg-cyan-50">
      {selectedSpot && (
        <div id="text-left inline-block w-full lg:w-1/2 mx-auto">
          <h2 className="text-xl font-bold">{selectedSpot.spotName}</h2>
          <p><strong>おすすめポイント:</strong> {selectedSpot.recommendedPoint}</p>
          <p><strong>おすすめの食べ物:</strong> {selectedSpot.recommendedFood}</p>
          <p><strong>感想など:</strong> {selectedSpot.comment}</p>
          {selectedSpot.images && JSON.parse(selectedSpot.images).map((image, index) => (
            <img key={index} src={`http://localhost:3001${image}`} alt={selectedSpot.spotName} className="w-64 block mx-auto my-2" />
          ))}
        </div>
      )}
    </div>

    </div>
  );
};

export default UserSpots;
