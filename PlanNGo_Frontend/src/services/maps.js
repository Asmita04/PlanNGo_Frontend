// Google Maps API Service
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

export const mapsService = {
  // Get user's current location
  getUserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  },

  // Geocode address to coordinates
  geocodeAddress: async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    throw new Error('Address not found');
  },

  // Get directions between two points
  getDirections: async (origin, destination, travelMode = 'DRIVING') => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${travelMode.toLowerCase()}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];
      
      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        steps: leg.steps.map(step => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance.text,
          duration: step.duration.text
        })),
        polyline: route.overview_polyline.points
      };
    }
    throw new Error('No route found');
  },

  // Get multiple travel options
  getTravelOptions: async (origin, destination) => {
    const modes = ['DRIVING', 'TRANSIT', 'WALKING', 'BICYCLING'];
    const options = [];

    for (const mode of modes) {
      try {
        const directions = await mapsService.getDirections(origin, destination, mode);
        options.push({
          mode,
          ...directions,
          icon: getIconForMode(mode)
        });
      } catch (error) {
        console.log(`${mode} not available`);
      }
    }

    return options;
  },

  // Generate Google Maps URL
  getMapUrl: (origin, destination) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
  }
};

const getIconForMode = (mode) => {
  const icons = {
    DRIVING: '🚗',
    TRANSIT: '🚌',
    WALKING: '🚶',
    BICYCLING: '🚴'
  };
  return icons[mode] || '📍';
};
