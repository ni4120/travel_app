import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from './Header'; 

const customIcon = new L.Icon({
  iconUrl: '/img/cat5.png',
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
    <div className="user-spots">
      <Header/>
      <h2>User's Spots</h2>
      <Link to="/users">ユーザー一覧へ</Link>
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
              <h2>{spot.spotName}</h2>
              <p>{spot.recommendedPoint}</p>
              <p>{spot.recommendedFood}</p>
              <p>{spot.comment}</p>
              {spot.images && JSON.parse(spot.images).map((image, index) => (
                <img key={index} src={`http://localhost:3001${image}`} alt={spot.spotName} style={{ width: "100px", height: "100px" }} />
              ))}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div class="spot">
      {selectedSpot && (
        <div id="spot-info">
          <h2>{selectedSpot.spotName}</h2>
          <p><strong>おすすめポイント:</strong> {selectedSpot.recommendedPoint}</p>
          <p><strong>おすすめの食べ物:</strong> {selectedSpot.recommendedFood}</p>
          <p><strong>感想など:</strong> {selectedSpot.comment}</p>
          {selectedSpot.images && JSON.parse(selectedSpot.images).map((image, index) => (
            <img key={index} src={`http://localhost:3001${image}`} alt={selectedSpot.spotName} style={{ width: "100px", height: "100px" }} />
          ))}
        </div>
      )}
    </div>

    </div>
  );
};

export default UserSpots;
