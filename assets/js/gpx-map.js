// GPX Map Configuration
const GPX_MAP_CONFIG = {
    // Replace with your Thunderforest API key
    thunderforestApiKey: '07c7b93fa6074ea8afb0f389d54a69c0',
    
    // Default map options
    defaultHeight: '400px',
    defaultRouteColor: '#ff4444',
    defaultRouteWeight: 4,
    defaultRouteOpacity: 0.8,
    
    // Icon URLs
    startIconUrl: '/assets/images/icons/marker.svg',
    endIconUrl: '/assets/images/icons/marker.svg',
    shadowUrl: null
};

// Main function to create GPX map
function createGPXMap(options) {
    const {
        mapId,
        gpxFile,
        useThunderforest = true,
        routeColor = GPX_MAP_CONFIG.defaultRouteColor,
        routeWeight = GPX_MAP_CONFIG.defaultRouteWeight,
        routeOpacity = GPX_MAP_CONFIG.defaultRouteOpacity
    } = options;

    // Initialize the map
    const map = L.map(mapId);

    // Choose tile layer
    if (useThunderforest && GPX_MAP_CONFIG.thunderforestApiKey !== 'YOUR_API_KEY') {
        // Thunderforest Outdoors tiles
        L.tileLayer(`https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${GPX_MAP_CONFIG.thunderforestApiKey}`, {
            attribution: 'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            maxZoom: 18
        }).addTo(map);
    } else {
        // Fallback to OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
    }

    // Define a custom icon for start/end markers
    const markerIcon = L.icon({
        iconUrl: GPX_MAP_CONFIG.startIconUrl,
        iconSize: [32, 32],      // Larger size for start/end
        iconAnchor: [16, 32],    // Bottom center
        popupAnchor: [0, -32],
        className: ''
    });

    // Define a small custom icon for waypoints
    const waypointIcon = L.icon({
        iconUrl: '/assets/images/icons/pin.svg',
        iconSize: [16, 16],      // Smaller size for waypoints
        iconAnchor: [8, 16],     // Bottom center
        popupAnchor: [0, -16],
        className: ''
    });

    // Load and display the GPX route
    const gpx = new L.GPX(gpxFile, {
        async: true,
        marker_options: {
            startIconUrl: GPX_MAP_CONFIG.startIconUrl,
            endIconUrl: GPX_MAP_CONFIG.endIconUrl,
            shadowUrl: GPX_MAP_CONFIG.shadowUrl,
            wptIconUrls: {
                '': '/assets/images/icons/pin.svg'
            },
            icon: markerIcon,      // For start/end
            wptIcon: waypointIcon  // For waypoints
        },
        polyline_options: {
            color: routeColor,
            weight: routeWeight,
            opacity: routeOpacity
        }
    });

    // Fit map to GPX route when loaded
    gpx.on('loaded', function(e) {
        map.fitBounds(e.target.getBounds(), {padding: [10, 10]});
    });

    // Add GPX to map
    gpx.addTo(map);

    return map;
}

// Convenience function for standard setup
function initGPXMap(mapId, gpxFile, options = {}) {
    document.addEventListener('DOMContentLoaded', function() {
        createGPXMap({
            mapId: mapId,
            gpxFile: gpxFile,
            ...options
        });
    });
}