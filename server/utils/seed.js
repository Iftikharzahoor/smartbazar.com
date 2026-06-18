import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

const categoriesData = [
  { name: 'Electronics', description: 'Premium tech, gadgets, laptops and mobile phones' },
  { name: 'Fashion & Apparel', description: 'Trendy clothes, shoes, and luxury bags' },
  { name: 'Home & Living', description: 'Furniture, kitchenware, and decor accessories' },
  { name: 'Beauty & Wellness', description: 'Skincare products, perfumes, and health essentials' }
];

const couponsData = [
  { code: 'SAVE10', discountType: 'percent', discountAmount: 10, expiryDate: new Date('2030-12-31') },
  { code: 'WELCOME50', discountType: 'fixed', discountAmount: 50, expiryDate: new Date('2030-12-31') }
];

const seedDB = async () => {
  try {
    // 1. Establish DB link
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopmern';
    console.log(`Connecting to database to seed: ${dbUri}`);
    await mongoose.connect(dbUri);
    console.log('Database connected successfully for seeding.');

    // 2. Clean out old data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    console.log('Cleaned old collections data successfully.');

    // 3. Seed Categories
    const categories = await Category.create(categoriesData);
    console.log('Categories seeded.');

    // Find category IDs
    const electronicsId = categories.find(c => c.name === 'Electronics')._id;
    const fashionId = categories.find(c => c.name === 'Fashion & Apparel')._id;
    const homeId = categories.find(c => c.name === 'Home & Living')._id;
    const beautyId = categories.find(c => c.name === 'Beauty & Wellness')._id;

    // 4. Seed Products
    const productsData = [
      {
        name: 'SoundAura ANC Headphones',
        description: 'Premium over-ear wireless headphones offering hybrid active noise cancellation, studio-grade audio acoustics, and dynamic spatial audio tuning.',
        price: 299.99,
        discountPrice: 249.99,
        category: electronicsId,
        brand: 'SoundAura',
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', public_id: 'sound-aura-anc' }
        ],
        stock: 120,
        isFeatured: true,
        features: ['45dB Hybrid Active Noise Cancellation', 'Hi-Res Wireless Audio Certified', '40-Hour Playback Time', 'Ultra-Comfort Memory Foam Cups'],
        specifications: [
          { key: 'Bluetooth', value: 'Version 5.3' },
          { key: 'Driver Size', value: '40mm Neodymium' },
          { key: 'Battery Life', value: '40 Hours (ANC On)' },
          { key: 'Weight', value: '250g' }
        ],
        tags: ['audio', 'headphones', 'anc', 'wireless']
      },
      {
        name: 'Vanguard Chrono Sport Watch',
        description: 'Water-resistant luxury chronograph sport watch featuring a sleek obsidian titanium bezel, sapphire crystal glass cover, and comfortable breathable silicone strap.',
        price: 189.99,
        category: fashionId,
        brand: 'Vanguard',
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-chrono-watch' }
        ],
        stock: 80,
        isFeatured: true,
        features: ['Scratch-Resistant Sapphire Crystal', '50m Water Resistance (5 ATM)', 'Luminous Quartz Dial Hands', 'Dual-Time Zone Subdials'],
        specifications: [
          { key: 'Case Material', value: 'Grade-5 Titanium' },
          { key: 'Strap Material', value: 'Silicone Rubber' },
          { key: 'Movement', value: 'Japanese Quartz' },
          { key: 'Warranty', value: '2 Years Global' }
        ],
        tags: ['watch', 'fashion', 'accessories', 'sport']
      },
      {
        name: 'Sahu Signature Denim Shirt',
        description: 'Classic washed denim shirt built for rugged durability and timeless casual style. Handcrafted from heavyweight cotton denim with premium brass snaps.',
        price: 69.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-denim-shirt' }
        ],
        stock: 140,
        isFeatured: true,
        features: ['100% Heavyweight Cotton Denim', 'Reinforced Double-Needle Stitching', 'Premium Brass Button Snaps', 'Dual Front Flap Chest Pockets'],
        specifications: [
          { key: 'Material', value: '100% Indigo Denim Cotton' },
          { key: 'Fit', value: 'Timeless Regular Fit' },
          { key: 'Weight', value: '8.5 oz Heavyweight' },
          { key: 'Care Instructions', value: 'Wash Separately In Cold Water' }
        ],
        variants: [
          { size: 'S', color: 'Indigo Blue', stock: 15 },
          { size: 'M', color: 'Indigo Blue', stock: 25 },
          { size: 'L', color: 'Indigo Blue', stock: 20 },
          { size: 'XL', color: 'Indigo Blue', stock: 10 },
          { size: 'S', color: 'Light Wash', stock: 12 },
          { size: 'M', color: 'Light Wash', stock: 28 },
          { size: 'L', color: 'Light Wash', stock: 20 },
          { size: 'XL', color: 'Light Wash', stock: 10 }
        ],
        tags: ['shirt', 'denim', 'cotton', 'fashion', 'sahu', 'blue']
      },
      {
        name: 'Sahu Premium Linen Summer Shirt',
        description: 'Ultra-breathable summer shirt crafted from premium certified European linen. Light, airy, and designed with a relaxed casual look for sunny getaways.',
        price: 64.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-linen-shirt' }
        ],
        stock: 210,
        isFeatured: true,
        features: ['100% Certified Organic European Linen', 'Breathable Cool-Weave Technology', 'Stylish Roll-Up Sleeve Tabs', 'Pre-Washed For Maximum Softness'],
        specifications: [
          { key: 'Material', value: '100% Organic Linen' },
          { key: 'Fit', value: 'Relaxed Comfort Fit' },
          { key: 'Collar Style', value: 'Mandarin Collar (Band Collar)' },
          { key: 'Seasonality', value: 'Spring / Summer Essential' }
        ],
        variants: [
          { size: 'S', color: 'Sandy Beige', stock: 15 },
          { size: 'M', color: 'Sandy Beige', stock: 25 },
          { size: 'L', color: 'Sandy Beige', stock: 20 },
          { size: 'XL', color: 'Sandy Beige', stock: 10 },
          { size: 'S', color: 'Olive Green', stock: 12 },
          { size: 'M', color: 'Olive Green', stock: 22 },
          { size: 'L', color: 'Olive Green', stock: 18 },
          { size: 'XL', color: 'Olive Green', stock: 8 },
          { size: 'S', color: 'Soft Pink', stock: 10 },
          { size: 'M', color: 'Soft Pink', stock: 30 },
          { size: 'L', color: 'Soft Pink', stock: 25 },
          { size: 'XL', color: 'Soft Pink', stock: 15 }
        ],
        tags: ['shirt', 'linen', 'organic', 'summer', 'fashion', 'sahu']
      },
      {
        name: 'Sahu Royal Silk Satin Shirt',
        description: 'Exquisite silk-satin shirt designed for formal evenings and premium luxury settings. Sleek texture, beautiful high-lustre finish, and a perfect tailored drape.',
        price: 79.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-satin-shirt' }
        ],
        stock: 165,
        isFeatured: true,
        features: ['Premium High-Lustre Silk Satin', 'Elegant French Folded Seams', 'Glossy Color Matching Buttons', 'Comfortable Four-Way Stretch Tech'],
        specifications: [
          { key: 'Material', value: '95% Pure Silk Satin, 5% Elastane' },
          { key: 'Fit', value: 'Tailored Luxury Fit' },
          { key: 'Collar Style', value: 'Classic French Spread Collar' },
          { key: 'Care Instructions', value: 'Dry Clean Only' }
        ],
        variants: [
          { size: 'S', color: 'Midnight Black', stock: 10 },
          { size: 'M', color: 'Midnight Black', stock: 20 },
          { size: 'L', color: 'Midnight Black', stock: 15 },
          { size: 'XL', color: 'Midnight Black', stock: 10 },
          { size: 'S', color: 'Royal Blue', stock: 12 },
          { size: 'M', color: 'Royal Blue', stock: 22 },
          { size: 'L', color: 'Royal Blue', stock: 18 },
          { size: 'XL', color: 'Royal Blue', stock: 8 },
          { size: 'S', color: 'Emerald Green', stock: 8 },
          { size: 'M', color: 'Emerald Green', stock: 18 },
          { size: 'L', color: 'Emerald Green', stock: 14 },
          { size: 'XL', color: 'Emerald Green', stock: 10 }
        ],
        tags: ['shirt', 'silk', 'satin', 'luxury', 'formal', 'sahu']
      },
      {
        name: 'Sahu Streetwear Oversized Flannel',
        description: 'Thick, ultra-cozy flannel shirt featuring classic plaid layouts. Engineered with a contemporary oversized fit, perfect for layering in casual streetwear styles.',
        price: 54.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-flannel-shirt' }
        ],
        stock: 128,
        isFeatured: true,
        features: ['Premium Double-Brushed Cotton Flannel', 'Oversized Streetwear Boxy Cut', 'Warm Dual-Layer Fabric Structure', 'Dual Buttoned Flap Chest Pockets'],
        specifications: [
          { key: 'Material', value: '100% Double-Brushed Cotton' },
          { key: 'Fit', value: 'Relaxed Boxy Oversized' },
          { key: 'Thickness', value: 'Heavyweight Flannel' },
          { key: 'Collar Style', value: 'Classic Point Collar' }
        ],
        variants: [
          { size: 'M', color: 'Red Plaid', stock: 25 },
          { size: 'L', color: 'Red Plaid', stock: 20 },
          { size: 'XL', color: 'Red Plaid', stock: 15 },
          { size: 'M', color: 'Grey Plaid', stock: 30 },
          { size: 'L', color: 'Grey Plaid', stock: 23 },
          { size: 'XL', color: 'Grey Plaid', stock: 15 }
        ],
        tags: ['shirt', 'flannel', 'plaid', 'streetwear', 'oversized', 'sahu']
      },
      {
        name: 'Sahu Classic Polo Knit Shirt',
        description: 'Classic knit shirt featuring refined polo aesthetics. Hand-knitted with high-grade pique cotton mesh structure for superior cooling and sports flexibility.',
        price: 49.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-polo-shirt' }
        ],
        stock: 175,
        isFeatured: true,
        features: ['100% Knitted Pique Combed Cotton', 'Refined Dual-Button Neck Placket', 'Ribbed Elasticated Short Sleeve Cuffs', 'Moisture-Wicking Breathable Mesh'],
        specifications: [
          { key: 'Material', value: '100% Pique Combed Cotton' },
          { key: 'Fit', value: 'Athletic Modern Fit' },
          { key: 'Collar Style', value: 'Flat-Knit Ribbed Polo Collar' },
          { key: 'Activity Type', value: 'Casual / Golf Sports Wear' }
        ],
        variants: [
          { size: 'S', color: 'Burgundy', stock: 15 },
          { size: 'M', color: 'Burgundy', stock: 25 },
          { size: 'L', color: 'Burgundy', stock: 15 },
          { size: 'XL', color: 'Burgundy', stock: 10 },
          { size: 'S', color: 'Navy Blue', stock: 12 },
          { size: 'M', color: 'Navy Blue', stock: 22 },
          { size: 'L', color: 'Navy Blue', stock: 18 },
          { size: 'XL', color: 'Navy Blue', stock: 8 },
          { size: 'S', color: 'Forest Green', stock: 10 },
          { size: 'M', color: 'Forest Green', stock: 20 },
          { size: 'L', color: 'Forest Green', stock: 15 },
          { size: 'XL', color: 'Forest Green', stock: 5 }
        ],
        tags: ['shirt', 'polo', 'knit', 'cotton', 'athletic', 'sahu']
      },
      {
        name: 'Minimalist Walnut Coffee Table',
        description: 'Handcrafted solid walnut wood coffee table. Seamless minimalist design elements with low profile support structures, perfect for modern Scandinavian-inspired living rooms.',
        price: 450.00,
        discountPrice: 399.00,
        category: homeId,
        brand: 'WoodSmith',
        images: [
          { url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', public_id: 'walnut-coffee-table' }
        ],
        stock: 12,
        isFeatured: false,
        features: ['100% Solid Natural Walnut Wood', 'Eco-Friendly Protective Matte Finish', 'Heavy-Duty Sturdy Support Beams', 'Quick 10-Minute Tools Assembly'],
        specifications: [
          { key: 'Dimensions', value: '120cm x 60cm x 40cm' },
          { key: 'Weight Capacity', value: '150 lbs' },
          { key: 'Wood Origin', value: 'Sustainable North American Forestry' }
        ],
        tags: ['furniture', 'wood', 'living-room', 'table']
      },
      {
        name: 'GlowElixir Vitamin C Serum',
        description: 'Advanced skin brightening serum formulated with pure organic 15% Vitamin C, rich hyaluronic acid, and nourishing Vitamin E for glowing daily skin complexions.',
        price: 49.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [
          { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', public_id: 'glow-elixir-serum' }
        ],
        stock: 250,
        isFeatured: false,
        features: ['15% Pure Active Vitamin C', 'Enriched with Plant-Derived Hyaluronic Acid', '100% Vegan and Cruelty-Free', 'Fragrance-Free Formulation'],
        specifications: [
          { key: 'Volume', value: '30ml / 1.0 fl oz' },
          { key: 'Skin Type', value: 'All (Including Sensitive Skin)' },
          { key: 'Frequency', value: 'Morning / Night Application' }
        ],
        tags: ['beauty', 'skincare', 'serum', 'glow']
      },
      {
        name: 'Louis Vuitton Premium Signature Beanie',
        description: 'Ultra-luxurious woolen knitted beanie featuring the iconic LV embroidered logo motif. Soft, warm, and highly fashionable for winter styling.',
        price: 149.99,
        category: fashionId,
        brand: 'Louis Vuitton',
        images: [
          { url: '/images/lv-beanie.jpg', public_id: 'lv-beanie' }
        ],
        stock: 50,
        isFeatured: true,
        features: ['100% Premium Lambswool', 'Iconic LV Monogram Embroidery', 'Ribbed Fold-Over Cuff Design', 'Pre-Shrunk Premium Fit'],
        specifications: [
          { key: 'Material', value: '100% Wool' },
          { key: 'Fit', value: 'Comfort Stretch Fit' },
          { key: 'Care', value: 'Hand Wash Only' }
        ],
        variants: [
          { size: 'M', color: 'Multicolor Selection', stock: 50 }
        ],
        tags: ['hat', 'beanie', 'fashion', 'lv', 'luxury']
      },
      {
        name: 'Chanel Classic CC Knitted Beanie',
        description: 'Exquisite ribbed knit beanie adorned with the classic CC logo patch. Provides unmatched warmth and style for high-end winter wear.',
        price: 169.99,
        category: fashionId,
        brand: 'Chanel',
        images: [
          { url: '/images/chanel-beanie.jpg', public_id: 'chanel-beanie' }
        ],
        stock: 45,
        isFeatured: true,
        features: ['Premium Cashmere Blend', 'Elegant Embroidered CC Logo', 'Soft Double-Knit Layering', 'Breathable Active Flex'],
        specifications: [
          { key: 'Material', value: 'Cashmere Blend' },
          { key: 'Fit', value: 'One Size Fits All' },
          { key: 'Care', value: 'Dry Clean Recommended' }
        ],
        variants: [
          { size: 'M', color: 'Trio Classic', stock: 45 }
        ],
        tags: ['hat', 'beanie', 'fashion', 'chanel', 'luxury']
      },
      {
        name: 'Miu Miu Mohair Ribbed Beanie',
        description: 'Soft brushed mohair blend beanie featuring the signature modern Miu Miu text embroidery logo. Cozy texture and premium comfort.',
        price: 129.99,
        category: fashionId,
        brand: 'Miu Miu',
        images: [
          { url: '/images/miumiu-beanie.png', public_id: 'miumiu-beanie' }
        ],
        stock: 35,
        isFeatured: true,
        features: ['Premium Mohair Blend Brushed Yarn', 'Signature Embroidered Text Logo', 'Thick Ribbed Construction', 'Lightweight & Fluffy Feel'],
        specifications: [
          { key: 'Material', value: 'Mohair Blend' },
          { key: 'Fit', value: 'Comfort Knit Fit' },
          { key: 'Care', value: 'Hand Wash Cold' }
        ],
        variants: [
          { size: 'M', color: 'Heather Grey', stock: 35 }
        ],
        tags: ['hat', 'beanie', 'fashion', 'miumiu', 'luxury']
      },
      {
        name: 'Dior Oblique Pattern Beanie',
        description: 'Luxury jacquard wool beanie showcasing the iconic Dior Oblique print allover pattern with contrast fold-over cuff and gold thread details.',
        price: 159.99,
        category: fashionId,
        brand: 'Dior',
        images: [
          { url: '/images/dior1-beanie.png', public_id: 'dior1-beanie' }
        ],
        stock: 40,
        isFeatured: true,
        features: ['Allover Dior Oblique Jacquard', 'Premium Gold Thread Accent Logo', 'Heavyweight Premium Knit', 'Fold-Over Contrast Cuff'],
        specifications: [
          { key: 'Material', value: '100% Fine Merino Wool' },
          { key: 'Fit', value: 'Sleek Fit' },
          { key: 'Care', value: 'Dry Clean Only' }
        ],
        variants: [
          { size: 'M', color: 'Multicolor Jacquard', stock: 40 }
        ],
        tags: ['hat', 'beanie', 'fashion', 'dior', 'luxury']
      },
      {
        name: 'Christian Dior Signature Beanie',
        description: 'Allover print Christian Dior knit beanie with solid ribbed band border. Elegant modern luxury sportswear streetwear winter collection.',
        price: 179.99,
        category: fashionId,
        brand: 'Dior',
        images: [
          { url: '/images/dior2-beanie.png', public_id: 'dior2-beanie' }
        ],
        stock: 30,
        isFeatured: true,
        features: ['Allover Dior Print Pattern', 'Bold Solid Ribbed Band Border', 'Double Layer Insulated Yarn', 'Premium Winter Collector Beanie'],
        specifications: [
          { key: 'Material', value: 'Pure Merino Wool Blend' },
          { key: 'Fit', value: 'Comfort Streetwear Fit' },
          { key: 'Care', value: 'Dry Clean Only' }
        ],
        variants: [
          { size: 'M', color: 'Signature Knit', stock: 30 }
        ],
        tags: ['hat', 'beanie', 'fashion', 'dior', 'luxury']
      },
      {
        name: 'ElectroPulse Smart Fitness Band',
        description: 'Next-gen fitness band with a vibrant AMOLED display, 24/7 heart rate tracking, sleep monitoring, and multi-sport activity tracking with 14-day battery life.',
        price: 59.99,
        category: electronicsId,
        brand: 'ElectroPulse',
        images: [
          { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80', public_id: 'electropulse-fitness-band' }
        ],
        stock: 150,
        isFeatured: false,
        features: ['1.47" AMOLED Touch Display', 'SpO2 & Continuous Heart Rate Tracking', '5 ATM Water Resistance', 'Up to 14 Days Battery Life'],
        specifications: [
          { key: 'Screen Size', value: '1.47 Inches' },
          { key: 'Water Resistance', value: '50 Meters' },
          { key: 'Battery Capacity', value: '200 mAh' }
        ],
        tags: ['electronics', 'fitness', 'smart-band', 'wearable']
      },
      {
        name: 'AuraGlow LED Desk Lamp',
        description: 'Modern minimalist desk lamp featuring touch control, adjustable brightness levels, multiple color temperature modes, and a built-in wireless smartphone charger.',
        price: 45.00,
        category: homeId,
        brand: 'AuraGlow',
        images: [
          { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-desk-lamp' }
        ],
        stock: 95,
        isFeatured: false,
        features: ['5 Brightness & 5 Color Temp Modes', 'Qi-Certified Wireless Charger Base', 'Auto-Off Timer (30/60 mins)', 'Eye-Caring Diffused LED Light'],
        specifications: [
          { key: 'Power Consumption', value: '12W' },
          { key: 'Wireless Charging Output', value: '10W Fast Charging' },
          { key: 'Lifespan', value: '50,000 Hours' }
        ],
        tags: ['home', 'lamp', 'desk-decor', 'lighting']
      },
      {
        name: 'Sahu Urban Leather Jacket',
        description: 'Premium handcrafted faux leather jacket featuring a sleek modern fit, asymmetric zipper closure, double chest pockets, and comfortable inner lining.',
        price: 120.00,
        category: fashionId,
        brand: 'SahuFashion',
        images: [
          { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-leather-jacket' }
        ],
        stock: 60,
        isFeatured: true,
        features: ['Handcrafted High-Quality Faux Leather', 'Asymmetric Front YKK Zipper', 'Quilted Shoulder Panels', 'Warm Polyester Satin Lining'],
        specifications: [
          { key: 'Material', value: 'Faux Leather / Polyester' },
          { key: 'Fit', value: 'Slim Tailored Fit' },
          { key: 'Style', value: 'Biker Style' }
        ],
        variants: [
          { size: 'M', color: 'Midnight Black', stock: 20 },
          { size: 'L', color: 'Midnight Black', stock: 25 },
          { size: 'XL', color: 'Midnight Black', stock: 15 }
        ],
        tags: ['jacket', 'leather', 'fashion', 'outerwear', 'sahu']
      },
      {
        name: 'HydraBoost Face Moisturizer',
        description: 'Daily oil-free gel moisturizer formulated with purified hyaluronic acid to instantly hydrate dry skin, lock in moisture, and leave skin looking smooth and supple.',
        price: 24.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [
          { url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80', public_id: 'hydraboost-moisturizer' }
        ],
        stock: 300,
        isFeatured: false,
        features: ['Purified Hyaluronic Acid Formula', 'Clinically Proven 48-Hour Hydration', 'Non-Comedogenic & Oil-Free', 'Lightweight Fast-Absorbing Gel'],
        specifications: [
          { key: 'Volume', value: '50ml / 1.7 fl oz' },
          { key: 'Skin Type', value: 'Dry / Combination' },
          { key: 'Dermatologist Tested', value: 'Yes' }
        ],
        tags: ['beauty', 'skincare', 'moisturizer', 'hydration']
      }
    ];

    const seededProducts = await Product.create(productsData);
    console.log('Products seeded.');

    // 5. Seed Coupons
    await Coupon.create(couponsData);
    console.log('Promo coupons seeded.');

    // 6. Seed Users
    // Administrator User Account
    const adminUser = await User.create({
      name: 'Iftikhar Zahoor',
      email: 'zahooriftikhar296@gmail.com',
      password: 'admin12345', // Bcrypt pre-save hashes this automatically
      role: 'admin',
      isVerified: true,
      avatar: '/user_photo.png'
    });

    // Test Customer User Account
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@shopmern.com',
      password: 'customer12345', // Bcrypt pre-save hashes this automatically
      role: 'user',
      isVerified: true,
      avatar: 'https://res.cloudinary.com/mock-cloudinary/image/upload/v1/avatars/customer.png',
      phone: '+1 555-0199',
      addresses: [
        {
          street: '123 E-Commerce Way',
          city: 'Tech City',
          state: 'California',
          postalCode: '90210',
          country: 'United States',
          isDefault: true
        }
      ]
    });
    console.log('Admin and Customer accounts seeded successfully.');

    // 7. Seed Orders
    const ordersData = [
      {
        user: customerUser._id,
        orderItems: [
          {
            name: seededProducts[0].name,
            qty: 1,
            image: seededProducts[0].images[0].url,
            price: seededProducts[0].price,
            product: seededProducts[0]._id
          },
          {
            name: seededProducts[1].name,
            qty: 2,
            image: seededProducts[1].images[0].url,
            price: seededProducts[1].price,
            product: seededProducts[1]._id
          }
        ],
        shippingAddress: {
          street: '123 E-Commerce Way',
          city: 'Tech City',
          state: 'California',
          postalCode: '90210',
          country: 'United States'
        },
        paymentMethod: 'stripe',
        itemsPrice: seededProducts[0].price + (seededProducts[1].price * 2),
        taxPrice: 15.00,
        shippingPrice: 10.00,
        totalPrice: seededProducts[0].price + (seededProducts[1].price * 2) + 15.00 + 10.00,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        status: 'processing'
      },
      {
        user: customerUser._id,
        orderItems: [
          {
            name: seededProducts[2].name,
            qty: 1,
            image: seededProducts[2].images[0].url,
            price: seededProducts[2].price,
            product: seededProducts[2]._id,
            size: 'L',
            color: 'Indigo Blue'
          }
        ],
        shippingAddress: {
          street: '123 E-Commerce Way',
          city: 'Tech City',
          state: 'California',
          postalCode: '90210',
          country: 'United States'
        },
        paymentMethod: 'cod',
        itemsPrice: seededProducts[2].price,
        taxPrice: 5.00,
        shippingPrice: 5.00,
        totalPrice: seededProducts[2].price + 10.00,
        isPaid: false,
        isDelivered: false,
        status: 'pending'
      }
    ];

    await Order.create(ordersData);
    console.log('Orders seeded successfully.');

    console.log('All collections seeded flawlessly. Exiting...');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
