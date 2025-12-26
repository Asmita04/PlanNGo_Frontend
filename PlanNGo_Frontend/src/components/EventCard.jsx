import { useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-image">
        <img 
          src={event.image || '/api/placeholder/300/300'} 
          alt={event.title || 'Event'}
          onError={(e) => {
            e.target.src = '/api/placeholder/300/300';
          }}
        />
      </div>
      <div className="event-info">
        <h3 className="event-title">{event.title || 'Untitled Event'}</h3>
        <p className="event-location">
          {[event.venue, event.location].filter(Boolean).join(', ') || 'Location TBD'}
        </p>
        <p className="event-price">₹{event.price || 0}</p>
      </div>
    </div>
  );
};

export default EventCard;