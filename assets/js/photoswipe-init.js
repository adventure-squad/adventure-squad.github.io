document.addEventListener('DOMContentLoaded', function() {
  // Wait for PhotoSwipeLightbox to be available
  if (window.PhotoSwipeLightbox && window.DynamicCaption) {
    // Try to find the existing PhotoSwipeLightbox instance
    var lightbox = window.pswpLightbox || null;

    // If not found, you may need to create it (but most themes expose it)
    if (lightbox) {
      // Register the dynamic caption plugin
      lightbox.addFilter('uiRegister', function(ui) {
        ui.push({
          name: 'dynamic-caption',
          order: 9,
          isButton: false,
          appendTo: 'root',
          html: '',
          onInit: (el, pswp) => {
            new DynamicCaption(pswp, el);
          }
        });
        return ui;
      });
    }
  }
});