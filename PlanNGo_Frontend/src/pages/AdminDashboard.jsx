import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, CheckCircle, Clock, 
  TrendingUp, BarChart3, PieChart, Activity,
  ArrowUp, ArrowDown, Eye, Filter, DollarSign, XCircle, MapPin, Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart as RechartsPie, Cell, Area, AreaChart, Pie, Legend
} from 'recharts';
import { api } from '../services/api';
import Button from '../components/Button';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

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

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
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
                  <Pie
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
                  </Pie>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
