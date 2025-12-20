import { Calendar, MapPin, DollarSign, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, user } = useApp();
  const isFavorite = favorites.includes(event.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleFavorite(event.id);
  };

  return (
    <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div className="event-card-image">
        <img src={event.image} alt={event.title} />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
        >
          <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
        <span className="event-category">{event.category}</span>
      </div>
      
      <div className="event-card-content">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="event-detail">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="event-footer">
          <div className="event-price">
            <DollarSign size={18} />
            <span>${event.price}</span>
          </div>
          <div className="event-capacity">
            <Users size={16} />
            <span>{event.booked}/{event.capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
