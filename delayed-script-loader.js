// Load script after page load
window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'non-critical-script.js';
    document.head.appendChild(script);
});
