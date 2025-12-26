import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreditCard, Calendar, MapPin, Ticket, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { user, addNotification, bookingState, clearBooking } = useApp();
  const [step, setStep] = useState(2); // Start directly at payment step
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!bookingState.event) {
    return (
      <div className="empty-cart">
        <Ticket size={64} />
        <h2>No event selected</h2>
        <p>Please select an event to book tickets</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    );
  }

  const { event, quantity, totalPrice } = bookingState;

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-checkout-js');
        if (existingScript) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        
        script.onerror = () => {
          console.warn('Razorpay script failed to load');
          setRazorpayLoaded(false);
          resolve(false);
        };
        
        document.head.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      addNotification({ message: 'Payment gateway unavailable. Please disable ad blocker and try again.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const options = {
        key: 'rzp_test_Rv0f4eyqBgZIGr',
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'PlanNGo',
        description: `Booking for ${event.title}`,
        image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: false,
          paylater: false,
          qr: true
        },
        handler: async (response) => {
          try {
            const bookingData = {
              userId: user.id,
              eventId: event.id,
              quantity: quantity,
              totalAmount: totalPrice,
              paymentMethod: 'Razorpay',
              paymentId: response.razorpay_payment_id || 'demo_payment_' + Date.now()
            };

            const newBooking = await api.createBooking(bookingData);
            setBooking(newBooking);
            clearBooking();
            setStep(3);
            addNotification({ message: 'Payment successful! Booking confirmed.', type: 'success' });
          } catch (error) {
            addNotification({ message: 'Booking failed', type: 'error' });
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            addNotification({ message: 'Payment cancelled', type: 'info' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        addNotification({ 
          message: `Payment failed: ${response.error?.description || 'Unknown error'}`, 
          type: 'error' 
        });
      });
      
      rzp.open();
    } catch (error) {
      addNotification({ message: 'Failed to initiate payment', type: 'error' });
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

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Payment</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Confirmation</p>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-main">
            {step === 2 && (
              <div className="payment-section">
                <h2>Payment</h2>
                <div className="order-summary-main">
                  <h3>Order Summary</h3>
                  <div className="event-details-summary">
                    <h4>{event.title}</h4>
                    <p>{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                  </div>
                  <div className="summary-item">
                    <span>Ticket Price (×{quantity})</span>
                    <span>₹{event.price * quantity}</span>
                  </div>
                  <div className="summary-item">
                    <span>Service Fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="summary-total">
                    <span>Total Amount</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <Button 
                    fullWidth 
                    disabled={loading || !window.Razorpay}
                    onClick={handleRazorpayPayment}
                    icon={<CreditCard size={20} />}
                  >
                    {loading ? 'Processing...' : 'Pay Securely'}
                  </Button>
                  
                  {!window.Razorpay && (
                    <div className="payment-warning">
                      <p>⚠️ Payment gateway blocked. Please disable ad blocker and refresh the page.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="booking-sidebar">
            <div className="order-summary">
              <h3>Booking Details</h3>
              <div className="event-info-sidebar">
                <img src={event.image} alt={event.title} className="event-thumb" />
                <div>
                  <h4>{event.title}</h4>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.location}</p>
                </div>
              </div>
              <div className="summary-item">
                <span>Tickets</span>
                <span>×{quantity}</span>
              </div>
              <div className="summary-item">
                <span>Price per ticket</span>
                <span>₹{event.price}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;