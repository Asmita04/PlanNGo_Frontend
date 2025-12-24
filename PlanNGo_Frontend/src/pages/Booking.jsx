import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreditCard, Calendar, MapPin, Ticket, CheckCircle, Loader } from 'lucide-react';
import Button from '../components/Button';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addNotification } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const eventData = await api.getEventById(id);
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
      addNotification({ message: 'Event not found', type: 'error' });
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={48} />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="empty-cart">
        <Ticket size={64} />
        <h2>Event not found</h2>
        <p>The event you're trying to book doesn't exist</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    );
  }

  const totalAmount = event.price * quantity;
  const availableTickets = event.capacity - event.booked;
  const isSoldOut = availableTickets <= 0;

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingData = {
        userId: user.id,
        eventId: event.id,
        quantity: quantity,
        totalAmount: totalAmount,
        paymentMethod: 'Credit Card'
      };

      const newBooking = await api.createBooking(bookingData);
      setBooking(newBooking);
      setStep(3);
      addNotification({ message: 'Booking confirmed successfully!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Payment failed. Please try again.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  if (step === 3 && booking) {
    return (
      <div className="booking-success">
        <div className="success-card">
          <CheckCircle size={80} className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been booked successfully</p>

          <div className="booking-details">
            <h3>Booking Details</h3>
            <div className="detail-row">
              <span>Booking ID:</span>
              <strong>{booking.ticketNumber}</strong>
            </div>
            <div className="detail-row">
              <span>Event:</span>
              <strong>{event.title}</strong>
            </div>
            <div className="detail-row">
              <span>Date:</span>
              <strong>{new Date(event.date).toLocaleDateString()}</strong>
            </div>
            <div className="detail-row">
              <span>Tickets:</span>
              <strong>{booking.quantity}</strong>
            </div>
            <div className="detail-row">
              <span>Total Paid:</span>
              <strong>₹{booking.totalAmount}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Button onClick={() => navigate('/user/dashboard')}>View My Bookings</Button>
            <Button variant="outline" onClick={() => navigate('/events')}>Browse More Events</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSoldOut) {
    return (
      <div className="empty-cart">
        <Ticket size={64} />
        <h2>Event Sold Out</h2>
        <p>Sorry, this event is completely sold out</p>
        <Button onClick={() => navigate('/events')}>Browse Other Events</Button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Review</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Payment</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Confirmation</p>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-main">
            {step === 1 && (
              <div className="review-section">
                <h2>Review Your Booking</h2>
                <div className="event-summary">
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <div className="event-detail">
                      <Calendar size={18} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                    <div className="tickets-available">
                      <span>Only {availableTickets} tickets left</span>
                    </div>
                  </div>
                </div>
                
                <div className="quantity-section">
                  <h4>Select Quantity</h4>
                  <div className="quantity-controls">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, Math.min(availableTickets, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={availableTickets}
                    />
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                      disabled={quantity >= availableTickets}
                    >
                      +
                    </button>
                  </div>
                  
                </div>
                
                <Button fullWidth onClick={() => setStep(2)}>Proceed to Payment</Button>
              </div>
            )}

            {step === 2 && (
              <div className="payment-section">
                <h2>Payment Information</h2>
                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      required
                      maxLength="19"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        required
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        required
                        maxLength="3"
                      />
                    </div>
                  </div>
                  <Button type="submit" fullWidth disabled={processing}>
                    {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                  </Button>
                </form>
              </div>
            )}
          </div>

          <div className="booking-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Ticket Price</span>
                <span>₹{event.price}</span>
              </div>
              <div className="summary-item">
                <span>Quantity</span>
                <span>× {quantity}</span>
              </div>
              <div className="summary-item">
                <span>Service Fee</span>
                <span>₹0</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
