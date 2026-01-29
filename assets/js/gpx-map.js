// GPX Map Configuration
const GPX_MAP_CONFIG = {
    // Replace with your Thunderforest API key
    thunderforestApiKey: '07c7b93fa6074ea8afb0f389d54a69c0',

    // Default map options
    defaultHeight: '400px',
    defaultRouteColor: '#ff4444',
    defaultRouteWeight: 4,
    defaultRouteOpacity: 0.8
};

// Minimal circle SVG icons as data URLs
const CIRCLE_ICONS = {
    start: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="#22c55e" stroke="#fff" stroke-width="2"/></svg>'),
    end: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="#ff4444" stroke="#fff" stroke-width="2"/></svg>'),
    waypoint: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="4" fill="#fff" stroke="#333" stroke-width="1"/></svg>')
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

    // Load and display the GPX route
    const gpx = new L.GPX(gpxFile, {
        async: true,
        marker_options: {
            startIconUrl: CIRCLE_ICONS.start,
            endIconUrl: CIRCLE_ICONS.end,
            shadowUrl: null,
            wptIconUrls: {
                '': CIRCLE_ICONS.waypoint
            },
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            wptIconSize: [10, 10],
            wptIconAnchor: [5, 5]
        },
        polyline_options: {
            color: routeColor,
            weight: routeWeight,
            opacity: routeOpacity
        }
    });

    // Fit map to GPX route when loaded
    gpx.on('loaded', function(e) {
        map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
    });

    // Handle errors
    gpx.on('error', function(e) {
        console.error('GPX loading error:', e);
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