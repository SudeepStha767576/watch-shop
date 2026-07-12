// Cricket Shop - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Auto-hide flash alerts after 5 seconds
    document.querySelectorAll('.alert').forEach(function (alert) {
        setTimeout(function () {
            alert.style.transition = 'opacity 0.3s';
            alert.style.opacity = '0';
            setTimeout(function () { alert.remove(); }, 300);
        }, 5000);
    });
});
