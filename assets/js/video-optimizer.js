// Mobile Data Video Optimizer
class VideoOptimizer {
  constructor() {
    this.isMobileData = this.detectMobileData();
    this.connectionSpeed = this.getConnectionSpeed();
  }

  // Detect if user is on mobile data
  detectMobileData() {
    // Check if Network Information API is available
    if (!navigator.connection) {
      // Fallback: assume mobile data if on mobile device
      return this.isMobileDevice();
    }

    const connection = navigator.connection;
    
    // Mobile data connection types
    const mobileDataTypes = ['cellular', '2g', '3g', '4g', '5g'];
    
    // Check connection type
    if (connection.type && mobileDataTypes.includes(connection.type)) {
      return true;
    }

    // Check effective connection type for slower connections
    const slowConnections = ['slow-2g', '2g', '3g'];
    if (connection.effectiveType && slowConnections.includes(connection.effectiveType)) {
      return true;
    }

    // Check if connection is metered (mobile data usually is)
    if (connection.saveData === true) {
      return true;
    }

    return false;
  }

  // Get connection speed category
  getConnectionSpeed() {
    if (!navigator.connection) {
      return 'unknown';
    }

    const effectiveType = navigator.connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'very-slow';
      case '3g':
        return 'slow';
      case '4g':
        return 'fast';
      default:
        return 'unknown';
    }
  }

  // Check if device is mobile
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  // Generate optimized Cloudinary URL based on connection
  optimizeVideoUrl(baseUrl) {
    const cloudinaryBasePattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)/;
    
    if (!cloudinaryBasePattern.test(baseUrl)) {
      console.warn('Not a Cloudinary URL, returning original:', baseUrl);
      return baseUrl;
    }

    let optimizations = [];

    if (this.isMobileData) {
      // Mobile data optimizations
      switch (this.connectionSpeed) {
        case 'very-slow':
          optimizations = ['q_auto:low', 'f_auto', 'w_auto:100:400', 'br_200k'];
          break;
        case 'slow':
          optimizations = ['q_auto:low', 'f_auto', 'w_auto:100:600', 'br_800k'];
          break;
        case 'fast':
          optimizations = ['q_auto:low', 'f_auto', 'w_auto:100:800', 'br_1600k'];
          break;
        default:
          optimizations = ['q_auto:low', 'f_auto', 'w_auto:100:600', 'br_3000k'];
      }
    } else {
      // WiFi or wired connection - use higher quality
      optimizations = ['q_auto', 'f_auto'];
    }

    // Add the optimizations to the URL
    return baseUrl.replace('/upload/', `/upload/${optimizations.join(',')}/`);
  }

  // Apply optimizations to all videos on the page
  optimizeAllVideos() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      const sources = video.querySelectorAll('source');
      
      if (sources.length > 0) {
        // Handle video with source elements
        sources.forEach(source => {
          const originalSrc = source.getAttribute('src') || source.getAttribute('data-src');
          if (originalSrc) {
            const optimizedSrc = this.optimizeVideoUrl(originalSrc);
            source.setAttribute('src', optimizedSrc);
          }
        });
      } else {
        // Handle video with direct src
        const originalSrc = video.getAttribute('src') || video.getAttribute('data-src');
        if (originalSrc) {
          const optimizedSrc = this.optimizeVideoUrl(originalSrc);
          video.setAttribute('src', optimizedSrc);
        }
      }

      // Add mobile-specific attributes
      if (this.isMobileData || this.isMobileDevice()) {
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');
        
        // Set poster if not already set
        if (!video.getAttribute('poster') && video.getAttribute('src')) {
          const posterUrl = this.generatePosterUrl(video.getAttribute('src'));
          video.setAttribute('poster', posterUrl);
        }
      }

      // Reload video with new source
      video.load();
    });

    // Log optimization info
    console.log('Video Optimizer:', {
      isMobileData: this.isMobileData,
      connectionSpeed: this.connectionSpeed,
      optimizationsApplied: this.isMobileData ? 'Mobile data optimizations' : 'WiFi quality'
    });
  }

  // Generate poster URL from video URL
  generatePosterUrl(videoSrc) {
    if (!videoSrc.includes('cloudinary.com')) {
      return '';
    }

    return videoSrc
      .replace('/video/upload/', '/image/upload/')
      .replace(/\.(mp4|webm|mov)$/, '.jpg')
      .replace(/\/upload\/[^\/]+\//, '/upload/so_0,f_auto,q_auto,w_400/');
  }

  // Monitor connection changes
  monitorConnectionChanges() {
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        console.log('Connection changed, re-optimizing videos...');
        this.isMobileData = this.detectMobileData();
        this.connectionSpeed = this.getConnectionSpeed();
        this.optimizeAllVideos();
      });
    }
  }
}

// Usage function
function initVideoOptimizer() {
  const optimizer = new VideoOptimizer();
  
  // Apply optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizer.optimizeAllVideos();
      optimizer.monitorConnectionChanges();
    });
  } else {
    optimizer.optimizeAllVideos();
    optimizer.monitorConnectionChanges();
  }
}

// Auto-initialize
initVideoOptimizer();

// Also make optimizer available globally for manual use
window.VideoOptimizer = VideoOptimizer;