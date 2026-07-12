    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>Cricket Shop Nepal</h3>
                    <p>Your trusted destination for premium cricket equipment in Nepal. We offer authentic bats, balls, protective gear, and accessories from top brands.</p>
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <a href="/cricket-shop/">Home</a><br>
                    <a href="/cricket-shop/products.php?category=bats">Bats</a><br>
                    <a href="/cricket-shop/products.php?category=balls">Balls</a><br>
                    <a href="/cricket-shop/products.php?category=gloves">Gloves</a><br>
                    <a href="/cricket-shop/products.php?category=pads">Pads</a>
                </div>
                <div>
                    <h3>Contact</h3>
                    <p>Kathmandu, Nepal</p>
                    <p>Phone: +977-9800000000</p>
                    <p>Email: info@cricketshop.com.np</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Cricket Shop Nepal. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script src="/cricket-shop/assets/js/main.js"></script>
    <?php if (isset($is_admin_page) && $is_admin_page): ?>
    <script src="/cricket-shop/assets/js/admin.js"></script>
    <?php endif; ?>
</body>
</html>
