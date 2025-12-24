import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './EventCard.css';

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useApp();

  if (!event) return null;

  const handleCardClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-image">
              <img 
                src={event.image || '/api/placeholder/400/300'} 
                alt={event.title || 'Event'}
              />
            </div>
            <div className="modal-details">
              <h2>{event.title || 'Untitled Event'}</h2>
              {event.organizer && <p className="modal-organizer">by {event.organizer}</p>}
              {event.description && <p className="modal-description">{event.description}</p>}
              <div className="modal-info">
                {event.date && <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>}
                {event.time && <p><strong>Time:</strong> {event.time}</p>}
                {(event.venue || event.location) && (
                  <p><strong>Location:</strong> {[event.venue, event.location].filter(Boolean).join(', ')}</p>
                )}
                <p><strong>Price:</strong> ₹{event.price || 0}</p>
                {event.capacity && (
                  <p><strong>Availability:</strong> {event.capacity - (event.booked || 0)} tickets left</p>
                )}
              </div>
              <button 
                className="modal-book-btn"
                onClick={() => {
                  closeModal();
                  if (!user) {
                    navigate('/login');
                  } else {
                    navigate(`/booking?eventId=${event.id}`);
                  }
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;