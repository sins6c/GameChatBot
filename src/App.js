import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Chatbot from './components/chatbot';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

const CLIENT_ID = 'helxhourdhte8jitxmixs6ac5wl574'; // Replace with your Twitch Client ID
const CLIENT_SECRET = '65ndh2sq8gnue1ghrghnkftejikrh9'; // Replace with your Twitch Client Secret
const IGDB_API_URL = 'https://api.igdb.com/v4';


function App() {
  const [showChat, setShowChat] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch IGDB Access Token
  const fetchAccessToken = async () => {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        }),
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      return null;
    }
  };

  // Fetch Game Data from IGDB
  const fetchGames = async () => {
    try {
      const accessToken = await fetchAccessToken();
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(IGDB_API_URL, {
        method: 'POST',
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: 'name,genres,cover.url', // Requesting name, genre, and cover image URL
          limit: 5, // Adjust the number of games to fetch
        }),
      });

      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="App">
      {/* Landing Page Content */}
      <header className="main-header">
      <h1>"Elevate Your Experience with Bulliverse Bot."</h1>
<p>Where Gaming Converges with Innovation.</p>
<h1 style={{fontSize:55}}>A New Era in <br></br> Web3 Gaming</h1>
         {/* Buttons after Web3 Gaming */}
         <div className="button-container">
         <button className="primary-btn">
            <a href="https://app.bullieverse.com/home" target="_blank" rel="noopener noreferrer">
              Explore Bulliverse
            </a>
          </button>

<button className="secondary-btn">
  <a href="https://quickswap.exchange/#/swap?outputCurrency=0x9f95e17b2668afe01f8fbd157068b0a4405cc08d" target="_blank" rel="noopener noreferrer">
    Buy $ BULL
  </a>
</button>

        </div>
      </header>

      {/* Carousel */}
      <div className="carousel-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Slider {...settings}>
            {games.map((game) => (
              <div className="carousel-slide" key={game.id}>
                <img
                  src={`https:${game.cover.url.replace('t_thumb', 't_1080p')}`} // Get the image URL and scale to 1080p
                  alt={game.name}
                  className="carousel-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x300?text=Image+Not+Found'; // Fallback image
                  }}
                />
                <div className="carousel-caption">
                  <h3>{game.name}</h3>
                  <p>{game.genres?.map((genre) => genre.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Chatbot Trigger Button */}
      <button className="chat-trigger" onClick={() => setShowChat(!showChat)}>
        <span>🤖</span>
      </button>

      {/* Chatbot Popup */}
      {showChat && (
        <div className="chat-popup">
          <div className="chat-header">
            <h2>GameBot</h2>
            <button className="close-btn" onClick={() => setShowChat(false)}>
              ✖
            </button>
          </div>
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default App;
