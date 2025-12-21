import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreditCard, Calendar, MapPin, Ticket, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { user, cart, clearCart, addNotification } = useApp();
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0 && !booking) {
    return (
      <div className="empty-cart">
        <Ticket size={64} />
        <h2>Your cart is empty</h2>
        <p>Browse events and add tickets to your cart</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    );
  }

  const cartItem = cart[0];
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingData = {
        userId: user.id,
        eventId: cartItem.eventId,
        quantity: cartItem.quantity,
        totalAmount: cartItem.totalPrice,
        paymentMethod: 'Credit Card'
      };

      const newBooking = await api.createBooking(bookingData);
      setBooking(newBooking);
      clearCart();
      setStep(3);
      addNotification({ message: 'Booking confirmed successfully!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Payment failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
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
              <strong>{cartItem.event.title}</strong>
            </div>
            <div className="detail-row">
              <span>Date:</span>
              <strong>{new Date(cartItem.event.date).toLocaleDateString()}</strong>
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
                  <img src={cartItem.event.image} alt={cartItem.event.title} />
                  <div className="event-info">
                    <h3>{cartItem.event.title}</h3>
                    <div className="event-detail">
                      <Calendar size={18} />
                      <span>{new Date(cartItem.event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={18} />
                      <span>{cartItem.event.location}</span>
                    </div>
                    <div className="ticket-info">
                      <span>Tickets: {cartItem.quantity}</span>
                      <span>Price: ₹{cartItem.event.price} each</span>
                    </div>
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
                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
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
                <span>₹{cartItem.event.price}</span>
              </div>
              <div className="summary-item">
                <span>Quantity</span>
                <span>× {cartItem.quantity}</span>
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
