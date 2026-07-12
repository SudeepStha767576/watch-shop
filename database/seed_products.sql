-- =============================================
-- Demo Product Data for TimePiece Nepal
-- Run this AFTER the main schema SQL
-- =============================================
USE watch_shop;

-- Luxury (category_id = 1)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(1, 'Rolex Submariner Homage', 'Premium automatic diving watch with sapphire crystal glass. 300m water resistance. Stainless steel case with ceramic bezel. Swiss-made movement.', 45999.00, 5, 'watch1.jpg', 1),
(1, 'Omega Seamaster Style', 'Elegant luxury timepiece with automatic movement. Date display, luminous hands, and scratch-resistant sapphire crystal. Leather strap included.', 38999.00, 8, 'watch2.jpg', 1),
(1, 'TAG Heuer Monaco Inspired', 'Iconic square case chronograph watch. Japanese automatic movement with premium finishing. Water resistant to 100m.', 32500.00, 6, 'watch3.jpg', 1),
(1, 'Tissot PRX Premium', 'Elegant dress watch with integrated bracelet design. Powermatic 80 movement with 80-hour power reserve. Swiss made.', 28999.00, 10, 'watch1.jpg', 1);

-- Sports (category_id = 2)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(2, 'G-Shock GA-2100', 'Carbon Core Guard structure for toughness. 200m water resistance, world time, stopwatch, countdown timer. Shock resistant.', 12500.00, 20, 'watch2.jpg', 1),
(2, 'Casio Pro Trek PRW-6600', 'Triple sensor for altitude, barometric pressure, and temperature. Solar powered with Multi-Band 6 atomic timekeeping.', 18999.00, 12, 'watch3.jpg', 1),
(2, 'Garmin Instinct Solar', 'Rugged GPS smartwatch with solar charging. Heart rate monitor, Pulse Ox sensor, ABC sensors. Up to 54 days battery.', 22999.00, 15, 'watch1.jpg', 1),
(2, 'Suunto Core All Black', 'Outdoor watch with altimeter, barometer, compass, and weather functions. Depth meter for snorkeling. Military-grade durability.', 15999.00, 18, 'watch2.jpg', 1);

-- Smart Watches (category_id = 3)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(3, 'Samsung Galaxy Watch 6', 'Advanced health monitoring with BioActive Sensor. Sleep coaching, body composition analysis. Wear OS with Google apps.', 29999.00, 25, 'watch3.jpg', 1),
(3, 'Amazfit GTR 4', 'Premium smartwatch with AMOLED display. GPS, heart rate, SpO2 monitoring. 14-day battery life. 150+ sports modes.', 16999.00, 30, 'watch1.jpg', 1),
(3, 'Noise ColorFit Pro 4', 'Budget-friendly smartwatch with 1.72" display. Bluetooth calling, SpO2, heart rate monitoring. 7-day battery life.', 4999.00, 40, 'watch2.jpg', 1),
(3, 'Xiaomi Watch S1 Pro', 'Sapphire crystal display, stainless steel body. Heart rate, SpO2, stress monitoring. 14-day battery. 117 workout modes.', 13999.00, 20, 'watch3.jpg', 1);

-- Casual (category_id = 4)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(4, 'Daniel Wellington Classic', 'Minimalist design with interchangeable straps. Japanese quartz movement. 3ATM water resistance. Eggshell white dial.', 8999.00, 25, 'watch1.jpg', 1),
(4, 'Fossil Grant Chronograph', 'Roman numeral dial with vintage charm. Genuine leather strap, chronograph function. 50m water resistance.', 11999.00, 15, 'watch2.jpg', 1),
(4, 'Timex Weekender', 'Classic casual watch with INDIGLO backlight. Interchangeable NATO straps. Lightweight and comfortable for everyday wear.', 3999.00, 35, 'watch3.jpg', 1),
(4, 'Skagen Signatur Slim', 'Ultra-thin Scandinavian design. Mesh stainless steel band. Minimalist dial with date window. 5ATM water resistance.', 9499.00, 20, 'watch1.jpg', 1);

-- Classic (category_id = 5)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(5, 'Orient Bambino V2', 'Automatic dress watch with domed crystal. Exhibition caseback showing the movement. 40.5mm case, genuine leather strap.', 14999.00, 12, 'watch2.jpg', 1),
(5, 'Seiko Presage Cocktail Time', 'Stunning textured dial inspired by cocktails. Automatic 4R35 movement. Hardlex crystal. 50m water resistance.', 19999.00, 8, 'watch3.jpg', 1),
(5, 'Citizen Eco-Drive Classic', 'Solar-powered watch that never needs a battery. Sapphire crystal, date display. Stainless steel case and bracelet.', 16500.00, 15, 'watch1.jpg', 1),
(5, 'Hamilton Khaki Field Auto', 'Military-inspired field watch with automatic movement. 80-hour power reserve. Sapphire crystal. 100m water resistance.', 24999.00, 6, 'watch2.jpg', 1);

-- Accessories (category_id = 6)
INSERT INTO products (category_id, name, description, price, quantity, image, is_active) VALUES
(6, 'Watch Box - 12 Slot', 'Premium wooden watch box with glass top display. Velvet lined interior with removable pillows. Lock and key included.', 3499.00, 20, 'accessory1.jpg', 1),
(6, 'Leather Watch Strap - Brown', 'Genuine Italian leather watch strap. Quick-release spring bars. Available in 18mm, 20mm, 22mm widths. Stainless steel buckle.', 1299.00, 50, 'accessory1.jpg', 1),
(6, 'Watch Cleaning Kit', 'Professional watch cleaning set. Includes microfiber cloth, soft brush, cleaning solution, and polishing cloth. Safe for all watch types.', 899.00, 40, 'accessory1.jpg', 1),
(6, 'Automatic Watch Winder', 'Single watch winder with quiet Japanese motor. 4 rotation modes. Suitable for all automatic watches. Piano lacquer finish.', 5999.00, 10, 'accessory1.jpg', 1);
