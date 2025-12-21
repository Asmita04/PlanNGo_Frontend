// Mock API Service with realistic data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
    category: "Technology",
    date: "2024-06-15",
    time: "09:00 AM",
    location: "Mumbai",
    venue: "Bandra Kurla Complex",
    price: 2999,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    organizer: "Tech Events Inc",
    organizerId: 2,
    capacity: 500,
    booked: 342,
    status: "approved",
    tags: ["Technology", "Networking", "Innovation"],
    schedule: [
      { time: "09:00 AM", activity: "Registration & Breakfast" },
      { time: "10:00 AM", activity: "Keynote Speech" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "02:00 PM", activity: "Workshops" },
      { time: "05:00 PM", activity: "Networking Session" }
    ]
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Experience three days of amazing music with top artists from around the world.",
    category: "Music",
    date: "2024-07-20",
    time: "06:00 PM",
    location: "Bangalore",
    venue: "Palace Grounds",
    price: 1500,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    organizer: "Music Events Co",
    organizerId: 3,
    capacity: 2000,
    booked: 1850,
    status: "approved",
    tags: ["Music", "Festival", "Entertainment"],
    schedule: [
      { time: "06:00 PM", activity: "Gates Open" },
      { time: "07:00 PM", activity: "Opening Act" },
      { time: "09:00 PM", activity: "Headliner Performance" },
      { time: "11:00 PM", activity: "After Party" }
    ]
  },
  {
    id: 3,
    title: "Art Exhibition: Modern Masters",
    description: "Explore contemporary art from renowned artists in an immersive gallery experience.",
    category: "Art",
    date: "2024-05-10",
    time: "10:00 AM",
    location: "Delhi",
    venue: "National Gallery of Modern Art",
    price: 500,
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800",
    organizer: "Art Gallery Delhi",
    organizerId: 4,
    capacity: 300,
    booked: 156,
    status: "approved",
    tags: ["Art", "Exhibition", "Culture"],
    schedule: [
      { time: "10:00 AM", activity: "Gallery Opens" },
      { time: "02:00 PM", activity: "Guided Tour" },
      { time: "04:00 PM", activity: "Artist Meet & Greet" }
    ]
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    description: "Taste exquisite dishes and wines from world-class chefs and vineyards.",
    category: "Food",
    date: "2024-08-05",
    time: "12:00 PM",
    location: "Pune",
    venue: "Koregaon Park",
    price: 850,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    organizer: "Culinary Events",
    organizerId: 5,
    capacity: 800,
    booked: 623,
    status: "approved",
    tags: ["Food", "Wine", "Culinary"],
    schedule: [
      { time: "12:00 PM", activity: "Festival Opens" },
      { time: "02:00 PM", activity: "Cooking Demonstrations" },
      { time: "05:00 PM", activity: "Wine Tasting" },
      { time: "07:00 PM", activity: "Dinner Service" }
    ]
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors and win funding.",
    category: "Business",
    date: "2024-06-25",
    time: "01:00 PM",
    location: "Hyderabad",
    venue: "HITEC City Convention Center",
    price: 500,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    organizer: "Startup Hub",
    organizerId: 2,
    capacity: 400,
    booked: 287,
    status: "approved",
    tags: ["Business", "Startup", "Investment"],
    schedule: [
      { time: "01:00 PM", activity: "Registration" },
      { time: "02:00 PM", activity: "Pitch Presentations" },
      { time: "05:00 PM", activity: "Judging & Awards" }
    ]
  },
  {
    id: 6,
    title: "Marathon 2024",
    description: "Join thousands of runners in this annual marathon supporting local charities.",
    category: "Sports",
    date: "2024-09-15",
    time: "06:00 AM",
    location: "Chennai",
    venue: "Marina Beach",
    price: 750,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
    organizer: "Sports Events Inc",
    organizerId: 6,
    capacity: 5000,
    booked: 4234,
    status: "approved",
    tags: ["Sports", "Marathon", "Charity"],
    schedule: [
      { time: "06:00 AM", activity: "Check-in Opens" },
      { time: "07:00 AM", activity: "Race Start" },
      { time: "12:00 PM", activity: "Awards Ceremony" }
    ]
  }
];

const mockUsers = [
  { id: 1, email: "user@test.com", password: "user123", name: "John Doe", role: "user", phone: "+1234567890", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
  { id: 2, email: "organizer@test.com", password: "org123", name: "Jane Smith", role: "organizer", phone: "+1234567891", avatar: "https://ui-avatars.com/api/?name=Jane+Smith" },
  { id: 3, email: "admin@test.com", password: "admin123", name: "Admin User", role: "admin", phone: "+1234567892", avatar: "https://ui-avatars.com/api/?name=Admin+User" }
];

let bookings = [];
let bookingIdCounter = 1;

export const api = {
  // Auth APIs
  login: async (email, password) => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: 'mock-token-' + user.id };
  },

  signup: async (userData) => {
    await delay(500);
    const exists = mockUsers.find(u => u.email === userData.email);
    if (exists) throw new Error('Email already exists');
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      avatar: `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}`
    };
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token: 'mock-token-' + newUser.id };
  },

  // Event APIs
  getEvents: async (filters = {}) => {
    await delay(300);
    let filtered = [...mockEvents];
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(e => e.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(search) || 
        e.description.toLowerCase().includes(search) ||
        e.location.toLowerCase().includes(search)
      );
    }
    if (filters.date) {
      filtered = filtered.filter(e => e.date === filters.date);
    }
    if (filters.priceRange) {
      filtered = filtered.filter(e => e.price >= filters.priceRange[0] && e.price <= filters.priceRange[1]);
    }
    
    return filtered;
  },

  getEventById: async (id) => {
    await delay(300);
    const event = mockEvents.find(e => e.id === parseInt(id));
    if (!event) throw new Error('Event not found');
    return event;
  },

  createEvent: async (eventData) => {
    await delay(500);
    const newEvent = {
      id: mockEvents.length + 1,
      ...eventData,
      booked: 0,
      status: 'pending',
      image: eventData.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  updateEvent: async (id, eventData) => {
    await delay(500);
    const index = mockEvents.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Event not found');
    mockEvents[index] = { ...mockEvents[index], ...eventData };
    return mockEvents[index];
  },

  deleteEvent: async (id) => {
    await delay(500);
    const index = mockEvents.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Event not found');
    mockEvents.splice(index, 1);
    return { success: true };
  },

  // Booking APIs
  createBooking: async (bookingData) => {
    await delay(500);
    const newBooking = {
      id: bookingIdCounter++,
      ...bookingData,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      ticketNumber: `TKT-${Date.now()}`
    };
    bookings.push(newBooking);
    
    // Update event booked count
    const event = mockEvents.find(e => e.id === bookingData.eventId);
    if (event) event.booked += bookingData.quantity;
    
    return newBooking;
  },

  getUserBookings: async (userId) => {
    await delay(300);
    return bookings.filter(b => b.userId === userId).map(booking => ({
      ...booking,
      event: mockEvents.find(e => e.id === booking.eventId)
    }));
  },

  getOrganizerBookings: async (organizerId) => {
    await delay(300);
    const organizerEvents = mockEvents.filter(e => e.organizerId === organizerId);
    return bookings.filter(b => organizerEvents.some(e => e.id === b.eventId));
  },

  // Analytics APIs
  getOrganizerAnalytics: async (organizerId) => {
    await delay(300);
    const organizerEvents = mockEvents.filter(e => e.organizerId === organizerId);
    const totalRevenue = organizerEvents.reduce((sum, e) => sum + (e.price * e.booked), 0);
    const totalBookings = organizerEvents.reduce((sum, e) => sum + e.booked, 0);
    
    return {
      totalEvents: organizerEvents.length,
      totalBookings,
      totalRevenue,
      averageRating: 4.5,
      monthlyData: [
        { month: 'Jan', bookings: 45, revenue: 13500 },
        { month: 'Feb', bookings: 52, revenue: 15600 },
        { month: 'Mar', bookings: 61, revenue: 18300 },
        { month: 'Apr', bookings: 58, revenue: 17400 },
        { month: 'May', bookings: 70, revenue: 21000 },
        { month: 'Jun', bookings: 85, revenue: 25500 }
      ]
    };
  },

  getAdminAnalytics: async () => {
    await delay(300);
    return {
      totalUsers: mockUsers.length,
      totalEvents: mockEvents.length,
      totalBookings: bookings.length,
      totalRevenue: mockEvents.reduce((sum, e) => sum + (e.price * e.booked), 0),
      pendingApprovals: mockEvents.filter(e => e.status === 'pending').length,
      categoryData: [
        { name: 'Technology', value: 25 },
        { name: 'Music', value: 20 },
        { name: 'Sports', value: 18 },
        { name: 'Food', value: 15 },
        { name: 'Art', value: 12 },
        { name: 'Business', value: 10 }
      ]
    };
  },

  // Admin APIs
  getAllUsers: async () => {
    await delay(300);
    return mockUsers.map(({ password, ...user }) => user);
  },

  updateUserStatus: async (userId, status) => {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.status = status;
    return user;
  },

  approveEvent: async (eventId) => {
    await delay(300);
    const event = mockEvents.find(e => e.id === eventId);
    if (event) event.status = 'approved';
    return event;
  },

  rejectEvent: async (eventId) => {
    await delay(300);
    const event = mockEvents.find(e => e.id === eventId);
    if (event) event.status = 'rejected';
    return event;
  }
};
