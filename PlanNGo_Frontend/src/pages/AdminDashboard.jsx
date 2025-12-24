import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, CheckCircle, Clock, 
  TrendingUp, BarChart3, PieChart, Activity,
  ArrowUp, ArrowDown, Eye, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart as RechartsPie, Cell, Area, AreaChart
} from 'recharts';
import { api } from '../services/api';
import { Users, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, MapPin, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Button from '../components/Button';
import './Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    verifiedOrganizers: 0,
    activeUsers: 0
  });

  const finalStats = {
    totalEvents: 1250,
    pendingApprovals: 23,
    verifiedOrganizers: 156,
    activeUsers: 8934
  };

  const chartData = [
    { name: 'Jan', events: 65, revenue: 12000 },
    { name: 'Feb', events: 89, revenue: 18000 },
    { name: 'Mar', events: 123, revenue: 25000 },
    { name: 'Apr', events: 156, revenue: 32000 },
    { name: 'May', events: 178, revenue: 38000 },
    { name: 'Jun', events: 201, revenue: 45000 }
  ];

  const pieData = [
    { name: 'Technology', value: 35, color: '#6366f1' },
    { name: 'Music', value: 25, color: '#ec4899' },
    { name: 'Sports', value: 20, color: '#10b981' },
    { name: 'Food', value: 20, color: '#f59e0b' }
  ];

  const recentActivity = [
    { id: 1, action: 'Event approved', user: 'Tech Conference 2024', time: '5 min ago', type: 'success' },
    { id: 2, action: 'New organizer registered', user: 'John Smith', time: '12 min ago', type: 'info' },
    { id: 3, action: 'Payment received', user: 'Music Festival', time: '18 min ago', type: 'success' },
    { id: 4, action: 'Event rejected', user: 'Food Fair', time: '25 min ago', type: 'error' }
  ];

  // Animated counter effect
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationForm, setLocationForm] = useState({ name: '', country: '', timezone: '' });

  useEffect(() => {
    const animateCounters = () => {
      Object.keys(finalStats).forEach(key => {
        let start = 0;
        const end = finalStats[key];
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setStats(prev => ({ ...prev, [key]: end }));
            clearInterval(timer);
          } else {
            setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
          }
        }, 16);
      });
    };

    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  const statCards = [
    { 
      title: 'Total Events', 
      value: stats.totalEvents, 
      icon: Calendar, 
      color: 'from-blue-500 to-purple-600', 
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Pending Approvals', 
      value: stats.pendingApprovals, 
      icon: Clock, 
      color: 'from-orange-500 to-red-500', 
      change: '+5%',
      trend: 'up'
    },
    { 
      title: 'Verified Organizers', 
      value: stats.verifiedOrganizers, 
      icon: CheckCircle, 
      color: 'from-green-500 to-teal-500', 
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers, 
      icon: Users, 
      color: 'from-purple-500 to-pink-500', 
      change: '+15%',
      trend: 'up'
    }
  ];
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
    <div className="admin-dashboard">
      {/* Main Content */}
      <div className="main-content full-width">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your platform.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div className="stat-card-content">
                  <div className="stat-header">
                    <div className={`stat-icon bg-gradient-to-r ${card.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="stat-trend">
                      {card.trend === 'up' ? (
                        <ArrowUp size={16} className="text-green-500" />
                      ) : (
                        <ArrowDown size={16} className="text-red-500" />
                      )}
                      <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {card.change}
                      </span>
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
                  
                  <div className="stat-content">
                    <h3>{card.title}</h3>
                    <motion.p 
                      className="stat-number"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                    >
                      {card.value.toLocaleString()}
                    </motion.p>
                  </div>
                </div>
                
                <div className="stat-card-glow"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-grid">
            {/* Bar Chart */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="chart-header">
                <h3>Events & Revenue Trend</h3>
                <div className="chart-actions">
                  <button className="chart-filter">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorEvents)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="chart-header">
                <h3>Event Categories</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <RechartsPie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    animationBegin={800}
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}</span>
                    <span>{entry.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
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
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="activity-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="activity-header">
            <h3>Recent Activity</h3>
            <button className="view-all">
              <Eye size={16} />
              View All
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                className={`activity-item ${activity.type}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-user">{activity.user}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
