import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
  return (
    <div className="event-card" onClick={() => onClick && onClick(event)}>
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <div className="event-price">${event.price}</div>
      </div>
      
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-organizer">by {event.organizer}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="detail-item">
            <Users size={16} />
            <span>{event.capacity} capacity</span>
          </div>
        </div>
        
        <div className="event-category">{event.category}</div>
      </div>
    </div>
  );
};

export default EventCard;