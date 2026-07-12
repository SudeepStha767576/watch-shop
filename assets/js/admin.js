// Cricket Shop - Admin JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Confirm before toggling product status
    document.querySelectorAll('.toggle-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            var action = form.dataset.active === '1' ? 'delist' : 'relist';
            if (!confirm('Are you sure you want to ' + action + ' this product?')) {
                e.preventDefault();
            }
        });
    });

    // Confirm before marking order as delivered
    document.querySelectorAll('.deliver-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (!confirm('Mark this order as Delivered?')) {
                e.preventDefault();
            }
        });
    });

    // Image preview on file select
    var imageInput = document.getElementById('product-image');
    if (imageInput) {
        imageInput.addEventListener('change', function () {
            var preview = document.getElementById('image-preview');
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});
