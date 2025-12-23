import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, MapPin, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Button from '../components/Button';
import './Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationForm, setLocationForm] = useState({ name: '', country: '', timezone: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const analyticsData = await api.getAdminAnalytics();
      setAnalytics(analyticsData);
      
      const usersData = await api.getAllUsers();
      setUsers(usersData);
      
      const eventsData = await api.getEvents();
      setEvents(eventsData);
      
      const locationsData = await api.getPredefinedLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleApproveEvent = async (id) => {
    try {
      await api.approveEvent(id);
      loadData();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleRejectEvent = async (id) => {
    try {
      await api.rejectEvent(id);
      loadData();
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await api.addLocation(locationForm);
      setShowLocationModal(false);
      setLocationForm({ name: '', country: '', timezone: '' });
      loadData();
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage platform users and events</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <TrendingUp size={20} />
            Overview
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={20} />
            Users
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            <Calendar size={20} />
            Events
          </button>
          <button className={activeTab === 'locations' ? 'active' : ''} onClick={() => setActiveTab('locations')}>
            <MapPin size={20} />
            Locations
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && analytics && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#dbeafe' }}>
                    <Users size={24} color="#3b82f6" />
                  </div>
                  <div className="stat-info">
                    <p>Total Users</p>
                    <h3>{analytics.totalUsers}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#ede9fe' }}>
                    <Calendar size={24} color="#6366f1" />
                  </div>
                  <div className="stat-info">
                    <p>Total Events</p>
                    <h3>{analytics.totalEvents}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#d1fae5' }}>
                    <DollarSign size={24} color="#10b981" />
                  </div>
                  <div className="stat-info">
                    <p>Total Revenue</p>
                    <h3>${analytics.totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fef3c7' }}>
                    <TrendingUp size={24} color="#f59e0b" />
                  </div>
                  <div className="stat-info">
                    <p>Pending Approvals</p>
                    <h3>{analytics.pendingApprovals}</h3>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h3>Events by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h2>All Users</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <img src={user.avatar} alt={user.name} />
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>{user.role}</span>
                        </td>
                        <td>
                          <Button size="sm" variant="outline">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <h2>All Events</h2>
              <div className="events-table">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Bookings</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id}>
                        <td>
                          <div className="event-cell">
                            <img src={event.image} alt={event.title} />
                            <span>{event.title}</span>
                          </div>
                        </td>
                        <td>{event.organizer}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.booked}/{event.capacity}</td>
                        <td>
                          <span className={`status-badge ${event.status}`}>{event.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {event.status === 'pending' && (
                              <>
                                <button className="icon-btn success" onClick={() => handleApproveEvent(event.id)}>
                                  <CheckCircle size={16} />
                                </button>
                                <button className="icon-btn danger" onClick={() => handleRejectEvent(event.id)}>
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            {event.status !== 'pending' && (
                              <Button size="sm" variant="outline">View</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="locations-section">
              <div className="section-header">
                <h2>Predefined Locations</h2>
                <Button icon={<Plus size={20} />} onClick={() => setShowLocationModal(true)}>
                  Add Location
                </Button>
              </div>
              <div className="locations-grid">
                {locations.map(location => (
                  <div key={location.id} className="location-card">
                    <MapPin size={24} />
                    <h4>{location.name}</h4>
                    <p>{location.country}</p>
                    <small>Timezone: {location.timezone}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Location</h2>
            <form onSubmit={handleAddLocation} className="location-form">
              <div className="form-group">
                <label>Location Name</label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={locationForm.country}
                  onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                  placeholder="e.g., USA"
                  required
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={locationForm.timezone}
                  onChange={(e) => setLocationForm({ ...locationForm, timezone: e.target.value })}
                  required
                >
                  <option value="">Select Timezone</option>
                  <option value="EST">Eastern (EST)</option>
                  <option value="CST">Central (CST)</option>
                  <option value="MST">Mountain (MST)</option>
                  <option value="PST">Pacific (PST)</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => setShowLocationModal(false)}>Cancel</Button>
                <Button type="submit">Add Location</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
