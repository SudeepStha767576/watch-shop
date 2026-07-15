    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>TimePiece Nepal</h3>
                    <p>Your trusted destination for premium watches in Nepal. We offer authentic luxury, sports, smart watches, and accessories from top brands.</p>
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <a href="/watch-shop/">Home</a><br>
                    <a href="/watch-shop/products.php?category=luxury">Luxury</a><br>
                    <a href="/watch-shop/products.php?category=sports">Sports</a><br>
                    <a href="/watch-shop/products.php?category=smart-watches">Smart Watches</a><br>
                    <a href="/watch-shop/products.php?category=classic">Classic</a>
                </div>
                <div>
                    <h3>Contact</h3>
                    <p>Kathmandu, Nepal</p>
                    <p>Phone: +977-9800000000</p>
                    <p>Email: info@timepiecenepal.com</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> TimePiece Nepal. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script src="/watch-shop/assets/js/main.js"></script>
    <?php if (isset($is_admin_page) && $is_admin_page): ?>
    <script src="/watch-shop/assets/js/admin.js"></script>
    <?php endif; ?>
</body>
</html>
