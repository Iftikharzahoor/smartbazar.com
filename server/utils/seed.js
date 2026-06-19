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
  { code: 'WELCOME50', discountType: 'fixed', discountAmount: 50, expiryDate: new Date('2030-12-31') },
  { code: 'SAM10', discountType: 'percent', discountAmount: 10, expiryDate: new Date('2030-12-31') }
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

    // 4. Seed Products (20 products per category, 80 total)
    const productsData = [
      // ELECTRONICS (20 Products)
      {
        name: 'SoundAura ANC Headphones',
        description: 'Premium over-ear wireless headphones offering hybrid active noise cancellation, studio-grade audio acoustics, and dynamic spatial audio tuning.',
        price: 299.99,
        discountPrice: 249.99,
        category: electronicsId,
        brand: 'SoundAura',
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', public_id: 'sound-aura-anc' }],
        stock: 120,
        isFeatured: true,
        features: ['45dB Hybrid Active Noise Cancellation', 'Hi-Res Wireless Audio Certified', '40-Hour Playback Time', 'Ultra-Comfort Memory Foam Cups'],
        specifications: [{ key: 'Bluetooth', value: 'Version 5.3' }, { key: 'Driver Size', value: '40mm Neodymium' }],
        tags: ['audio', 'headphones', 'anc', 'wireless']
      },
      {
        name: 'ElectroPulse Smart Fitness Band',
        description: 'Next-gen fitness band with a vibrant AMOLED display, 24/7 heart rate tracking, sleep monitoring, and multi-sport activity tracking with 14-day battery life.',
        price: 59.99,
        category: electronicsId,
        brand: 'ElectroPulse',
        images: [{ url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80', public_id: 'electropulse-fitness-band' }],
        stock: 150,
        isFeatured: false,
        features: ['1.47" AMOLED Touch Display', 'SpO2 & Continuous Heart Rate Tracking', '5 ATM Water Resistance', 'Up to 14 Days Battery Life'],
        specifications: [{ key: 'Screen Size', value: '1.47 Inches' }, { key: 'Water Resistance', value: '50 Meters' }],
        tags: ['electronics', 'fitness', 'smart-band', 'wearable']
      },
      {
        name: 'NovaCore Wireless Charger Pad',
        description: '15W fast wireless charging pad with safe temperature controls and premium fabric finish. Ideal for modern smartphones and AirPods.',
        price: 29.99,
        category: electronicsId,
        brand: 'NovaCore',
        images: [{ url: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80', public_id: 'novacore-wireless-charger' }],
        stock: 180,
        isFeatured: false,
        features: ['15W Qi-Certified Fast Charging', 'Anti-Slip Premium Fabric Top', 'Multi-Protect Safety Tech', 'Universal iOS & Android Compatible'],
        specifications: [{ key: 'Power Output', value: '5W / 7.5W / 10W / 15W' }, { key: 'Input Interface', value: 'USB Type-C' }],
        tags: ['charger', 'wireless', 'accessories', 'tech']
      },
      {
        name: 'VisionPro Smart Glasses',
        description: 'Sleek smart glasses equipped with HD camera lens, integrated audio bone conduction speakers, and Bluetooth voice assistant integration.',
        price: 399.99,
        discountPrice: 349.99,
        category: electronicsId,
        brand: 'VisionPro',
        images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', public_id: 'visionpro-smart-glasses' }],
        stock: 45,
        isFeatured: true,
        features: ['Full HD video & photo capture', 'Open-Ear Bone Conduction Audio', 'Hands-Free Voice Assistant Control', 'UV400 Polarized Protection Lenses'],
        specifications: [{ key: 'Camera Resolution', value: '1080p Video, 8MP Photo' }, { key: 'Battery Life', value: 'Up to 4 Hours Recording' }],
        tags: ['glasses', 'smart', 'camera', 'audio', 'wearable']
      },
      {
        name: 'ApexSound Mini Bluetooth Speaker',
        description: 'Pocket-sized waterproof Bluetooth speaker delivering surprisingly loud spatial audio with deep bass and a built-in metal utility carabiner.',
        price: 49.99,
        category: electronicsId,
        brand: 'ApexSound',
        images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80', public_id: 'apexsound-mini-speaker' }],
        stock: 220,
        isFeatured: false,
        features: ['IP67 dust and waterproof rating', 'Dynamic Bass Radiator Integration', 'Up to 12 Hours Playing Time', 'Compact Travel Carabiner Case'],
        specifications: [{ key: 'Driver Output', value: '8W RMS' }, { key: 'Bluetooth Range', value: 'Up to 100 feet' }],
        tags: ['speaker', 'audio', 'waterproof', 'portable']
      },
      {
        name: 'VeloSync GPS Cycle Computer',
        description: 'Advanced cycle computer featuring a high-contrast anti-glare screen, preloaded global maps, smart training data tracking, and smartphone sync notifications.',
        price: 149.99,
        category: electronicsId,
        brand: 'VeloSync',
        images: [{ url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', public_id: 'velosync-cycle-computer' }],
        stock: 35,
        isFeatured: false,
        features: ['High-Sensitivity GPS Tracking', 'Customizable Smart Training Fields', 'IPX7 Waterproof Protection', 'Strava Sync & Bluetooth integration'],
        specifications: [{ key: 'Display Size', value: '2.3 Inches' }, { key: 'Battery Capacity', value: 'Up to 20 Hours' }],
        tags: ['gps', 'cycle', 'computer', 'fitness', 'sports']
      },
      {
        name: 'Vanguard Wi-Fi 6 Router',
        description: 'Dual-band gigabit Wi-Fi 6 wireless router offering ultra-high speed performance, low latencies, and massive coverage using 4 external signal antennas.',
        price: 89.99,
        category: electronicsId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1600541519463-9605906eecca?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-wifi6-router' }],
        stock: 90,
        isFeatured: false,
        features: ['Next-Gen Wi-Fi 6 Speeds (1.8Gbps)', '4 High-Gain Omnidirectional Antennas', 'WPA3 Advanced Network Security', 'Easy App-Based Setup Control'],
        specifications: [{ key: 'Ethernet Ports', value: '4 Gigabit LAN Ports' }, { key: 'Processor', value: 'Quad-Core 1.5 GHz' }],
        tags: ['wifi', 'router', 'network', 'internet']
      },
      {
        name: 'SoundAura True Wireless Earbuds',
        description: 'Compact wireless earbuds with smart touch controls, ambient transparent mode, deep bass acoustics, and dual crystal-clear voice microphones.',
        price: 119.99,
        discountPrice: 99.99,
        category: electronicsId,
        brand: 'SoundAura',
        images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', public_id: 'soundaura-tws-earbuds' }],
        stock: 160,
        isFeatured: true,
        features: ['Smart Touch Control Navigation', 'Ambient Active Transparent Mode', 'IPX5 Sweat & Water Resistance', '24 Hours Total Battery with Case'],
        specifications: [{ key: 'Driver Size', value: '10mm Dynamic' }, { key: 'Charging Type', value: 'USB-C & Wireless' }],
        tags: ['audio', 'earbuds', 'wireless', 'music']
      },
      {
        name: 'ApexCapture Ultra HD Webcam',
        description: 'Professional 4K streaming webcam with auto focus, light correction tech, and dual integrated noise reduction microphone system.',
        price: 79.99,
        category: electronicsId,
        brand: 'ApexSound',
        images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', public_id: 'apexcapture-webcam' }],
        stock: 110,
        isFeatured: false,
        features: ['Ultra HD 4K Resolution at 30fps', 'Smart Auto-Focus & Light Correction', 'Dual Noise-Cancelling Microphones', 'Privacy Shutter Shield Cover'],
        specifications: [{ key: 'Resolution', value: '4K Ultra HD' }, { key: 'Field of View', value: '90 Degrees' }],
        tags: ['camera', 'webcam', 'streaming', 'video']
      },
      {
        name: 'NovaCore Ergonomic Mechanical Keyboard',
        description: 'Ultra-responsive mechanical keyboard with red linear switches, customizable RGB backlighting, and a soft memory foam wrist rest.',
        price: 109.99,
        category: electronicsId,
        brand: 'NovaCore',
        images: [{ url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80', public_id: 'novacore-keyboard' }],
        stock: 75,
        isFeatured: false,
        features: ['Linear Red Mechanical Switches', 'Customizable Allover RGB Backlighting', 'Premium Magnetic Wrist Rest Frame', 'Durable Double-Shot PBT Keycaps'],
        specifications: [{ key: 'Keyboard Layout', value: 'Full Size 104 Keys' }, { key: 'Switch Life', value: '50 Million Keystrokes' }],
        tags: ['keyboard', 'gaming', 'mechanical', 'rgb']
      },
      {
        name: 'NovaCore Smart Home Speaker',
        description: 'Compact smart speaker featuring integrated voice assistants, 360-degree room filling audio acoustics, and Wi-Fi streaming capabilities.',
        price: 49.99,
        category: electronicsId,
        brand: 'NovaCore',
        images: [{ url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', public_id: 'novacore-smart-speaker' }],
        stock: 110,
        isFeatured: false,
        features: ['Smart Voice Assistant integration', '360-degree room filling audio', 'Wi-Fi & Bluetooth connectivity', 'Privacy microphone mute button'],
        specifications: [{ key: 'Voice Assistant', value: 'Alexa & Google Assistant' }, { key: 'Connectivity', value: 'Wi-Fi 2.4/5GHz, Bluetooth 5.0' }],
        tags: ['speaker', 'smart-home', 'audio', 'voice-assistant']
      },
      {
        name: 'SoundAura Noise Masking Sleepbuds',
        description: 'Ultra-lightweight earplugs designed to block out sleep disruptions while streaming relaxing sleep acoustics throughout the night.',
        price: 199.99,
        category: electronicsId,
        brand: 'SoundAura',
        images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', public_id: 'soundaura-sleepbuds' }],
        stock: 85,
        isFeatured: false,
        features: ['Engineered sleep-masking sounds', 'Ultra-comfortable overnight fit', '10-hour battery life per charge', 'Sleep monitoring analytics'],
        specifications: [{ key: 'Battery Life', value: 'Up to 10 Hours' }, { key: 'Bluetooth', value: 'Version 5.2' }],
        tags: ['sleep', 'buds', 'audio', 'noise-masking']
      },
      {
        name: 'ApexCapture 4K Action Camera',
        description: 'Rugged and waterproof sport action camera designed for capturing outdoor adventures in high definition 4K resolution at 60fps.',
        price: 249.99,
        category: electronicsId,
        brand: 'ApexSound',
        images: [{ url: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=800&q=80', public_id: 'apexcapture-action-cam' }],
        stock: 65,
        isFeatured: true,
        features: ['Stunning 4K resolution at 60fps', 'Advanced EIS stabilization', 'Waterproof up to 131 feet with case', 'Dual screens for vlogging'],
        specifications: [{ key: 'Video Resolution', value: '4K 60fps' }, { key: 'Sensor', value: 'Sony IMX377' }],
        tags: ['camera', 'action', 'video', 'waterproof']
      },
      {
        name: 'ElectroPulse Bluetooth Smart Scale',
        description: 'Smart bathroom scale that tracks body weight, body fat index, muscle mass, and other metrics with companion app synchronization.',
        price: 39.99,
        category: electronicsId,
        brand: 'ElectroPulse',
        images: [{ url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80', public_id: 'electropulse-smart-scale' }],
        stock: 140,
        isFeatured: false,
        features: ['13 essential body metrics tracking', 'Bluetooth sync with health apps', 'High-precision sensor calibration', 'Tempered glass sleek layout'],
        specifications: [{ key: 'Weight Limit', value: '400 lbs' }, { key: 'Battery', value: '3x AAA Included' }],
        tags: ['fitness', 'scale', 'smart-home', 'health']
      },
      {
        name: 'Vanguard 3-in-1 Charging Station',
        description: 'Convenient space-saving desk charging dock that powers your smartphone, wireless earbuds, and smart watch all at once.',
        price: 34.99,
        category: electronicsId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-charging-station' }],
        stock: 120,
        isFeatured: false,
        features: ['Charges iPhone, Apple Watch, and AirPods simultaneously', '15W fast wireless Qi output', 'Sleek space-saving design', 'Built-in overcharge protection'],
        specifications: [{ key: 'Max Output', value: '15W Wireless' }, { key: 'Connector', value: 'Type-C Input' }],
        tags: ['charger', 'wireless', 'accessories', 'tech']
      },
      {
        name: 'ApexCapture Ring Light with Tripod Stand',
        description: 'Professional 10-inch desktop LED ring light with adjustable color temperatures and phone holder for content creators.',
        price: 29.99,
        category: electronicsId,
        brand: 'ApexSound',
        images: [{ url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', public_id: 'apexcapture-ring-light' }],
        stock: 95,
        isFeatured: false,
        features: ['10-inch dimmable ring light', '3 color temperature modes', 'Extendable sturdy tripod stand', 'Universal rotating phone holder'],
        specifications: [{ key: 'Diameter', value: '10 Inches' }, { key: 'Power Source', value: 'USB Powered' }],
        tags: ['lighting', 'camera', 'streaming', 'accessories']
      },
      {
        name: 'NovaCore USB-C Hub Adapter',
        description: 'Multifunctional aluminum USB Type-C hub adapter featuring 4K HDMI, USB 3.0 ports, and SD card reader slots.',
        price: 24.99,
        category: electronicsId,
        brand: 'NovaCore',
        images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', public_id: 'novacore-usb-c-hub' }],
        stock: 200,
        isFeatured: false,
        features: ['7-in-1 expansion ports', '4K HDMI video output', 'High speed SD/TF card readers', '85W Power Delivery pass-through'],
        specifications: [{ key: 'HDMI Output', value: '4K @ 30Hz' }, { key: 'Data Rate', value: '5 Gbps' }],
        tags: ['adapter', 'hub', 'accessories', 'laptop']
      },
      {
        name: 'ElectroPulse Smart Water Bottle',
        description: 'Intelligent stainless steel insulated water bottle that tracks your water intake and glows to remind you to drink.',
        price: 45.00,
        category: electronicsId,
        brand: 'ElectroPulse',
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', public_id: 'electropulse-water-bottle' }],
        stock: 110,
        isFeatured: false,
        features: ['Glow reminders to hydrate', 'Bluetooth hydration tracking app', 'Double-wall vacuum insulation', 'Rechargeable battery (lasts 10 days)'],
        specifications: [{ key: 'Capacity', value: '20 oz' }, { key: 'Battery Life', value: 'Up to 10 Days' }],
        tags: ['fitness', 'bottle', 'smart-home', 'health']
      },
      {
        name: 'SoundAura Bluetooth Retro Radio',
        description: 'Beautiful vintage-themed wood radio combining retro FM/AM tuning dials with modern wireless Bluetooth audio connectivity.',
        price: 79.99,
        category: electronicsId,
        brand: 'SoundAura',
        images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80', public_id: 'soundaura-retro-radio' }],
        stock: 70,
        isFeatured: true,
        features: ['Vintage wooden design aesthetics', 'Rich, clear sound acoustics', 'FM/AM tuning and Bluetooth 5.0', 'Built-in rechargeable battery'],
        specifications: [{ key: 'Power Output', value: '10W RMS' }, { key: 'Battery Capacity', value: '1800mAh' }],
        tags: ['radio', 'audio', 'retro', 'bluetooth']
      },
      {
        name: 'Vanguard Portable Power Bank 20000mAh',
        description: 'High capacity 20000mAh external battery pack with fast-charging technology for smartphones and USB-powered devices.',
        price: 39.99,
        category: electronicsId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-power-bank' }],
        stock: 150,
        isFeatured: false,
        features: ['Massive 20000mAh battery capacity', '22.5W Super Fast Charging output', 'Dual USB-A and USB-C ports', 'Sleek travel-friendly layout'],
        specifications: [{ key: 'Capacity', value: '20000mAh' }, { key: 'Max Output', value: '22.5W' }],
        tags: ['charger', 'accessories', 'powerbank', 'travel']
      },

      // FASHION & APPAREL (20 Products)
      {
        name: 'Vanguard Chrono Sport Watch',
        description: 'Water-resistant luxury chronograph sport watch featuring a sleek obsidian titanium bezel, sapphire crystal glass cover, and comfortable breathable silicone strap.',
        price: 189.99,
        category: fashionId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-chrono-watch' }],
        stock: 80,
        isFeatured: true,
        features: ['Scratch-Resistant Sapphire Crystal', '50m Water Resistance (5 ATM)', 'Luminous Quartz Dial Hands', 'Dual-Time Zone Subdials'],
        specifications: [{ key: 'Case Material', value: 'Grade-5 Titanium' }, { key: 'Strap Material', value: 'Silicone Rubber' }],
        tags: ['watch', 'fashion', 'accessories', 'sport']
      },
      {
        name: 'Sahu Signature Denim Shirt',
        description: 'Classic washed denim shirt built for rugged durability and timeless casual style. Handcrafted from heavyweight cotton denim with premium brass snaps.',
        price: 69.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-denim-shirt' }],
        stock: 140,
        isFeatured: true,
        features: ['100% Heavyweight Cotton Denim', 'Reinforced Double-Needle Stitching', 'Premium Brass Button Snaps', 'Dual Front Flap Chest Pockets'],
        specifications: [{ key: 'Material', value: '100% Indigo Denim Cotton' }, { key: 'Fit', value: 'Timeless Regular Fit' }],
        tags: ['shirt', 'denim', 'cotton', 'fashion', 'sahu']
      },
      {
        name: 'Sahu Premium Linen Summer Shirt',
        description: 'Ultra-breathable summer shirt crafted from premium certified European linen. Light, airy, and designed with a relaxed casual look for sunny getaways.',
        price: 64.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [{ url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-linen-shirt' }],
        stock: 210,
        isFeatured: true,
        features: ['100% Certified Organic European Linen', 'Breathable Cool-Weave Technology', 'Stylish Roll-Up Sleeve Tabs', 'Pre-Washed For Maximum Softness'],
        specifications: [{ key: 'Material', value: '100% Organic Linen' }, { key: 'Fit', value: 'Relaxed Comfort Fit' }],
        tags: ['shirt', 'linen', 'organic', 'summer', 'fashion', 'sahu']
      },
      {
        name: 'Sahu Royal Silk Satin Shirt',
        description: 'Exquisite silk-satin shirt designed for formal evenings and premium luxury settings. Sleek texture, beautiful high-lustre finish, and a perfect tailored drape.',
        price: 79.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [{ url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-satin-shirt' }],
        stock: 165,
        isFeatured: true,
        features: ['Premium High-Lustre Silk Satin', 'Elegant French Folded Seams', 'Glossy Color Matching Buttons', 'Comfortable Four-Way Stretch Tech'],
        specifications: [{ key: 'Material', value: '95% Pure Silk Satin, 5% Elastane' }, { key: 'Fit', value: 'Tailored Luxury Fit' }],
        tags: ['shirt', 'silk', 'satin', 'luxury', 'formal', 'sahu']
      },
      {
        name: 'Sahu Streetwear Oversized Flannel',
        description: 'Thick, ultra-cozy flannel shirt featuring classic plaid layouts. Engineered with a contemporary oversized fit, perfect for layering in casual streetwear styles.',
        price: 54.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [{ url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-flannel-shirt' }],
        stock: 128,
        isFeatured: true,
        features: ['Premium Double-Brushed Cotton Flannel', 'Oversized Streetwear Boxy Cut', 'Warm Dual-Layer Fabric Structure', 'Dual Buttoned Flap Chest Pockets'],
        specifications: [{ key: 'Material', value: '100% Double-Brushed Cotton' }, { key: 'Fit', value: 'Relaxed Boxy Oversized' }],
        tags: ['shirt', 'flannel', 'plaid', 'streetwear', 'oversized', 'sahu']
      },
      {
        name: 'Sahu Classic Polo Knit Shirt',
        description: 'Classic knit shirt featuring refined polo aesthetics. Hand-knitted with high-grade pique cotton mesh structure for superior cooling and sports flexibility.',
        price: 49.99,
        category: fashionId,
        brand: 'SahuShirts',
        images: [{ url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-polo-shirt' }],
        stock: 175,
        isFeatured: true,
        features: ['100% Knitted Pique Combed Cotton', 'Refined Dual-Button Neck Placket', 'Ribbed Elasticated Short Sleeve Cuffs', 'Moisture-Wicking Breathable Mesh'],
        specifications: [{ key: 'Material', value: '100% Pique Combed Cotton' }, { key: 'Fit', value: 'Athletic Modern Fit' }],
        tags: ['shirt', 'polo', 'knit', 'cotton', 'athletic', 'sahu']
      },
      {
        name: 'Louis Vuitton Premium Signature Beanie',
        description: 'Ultra-luxurious woolen knitted beanie featuring the iconic LV embroidered logo motif. Soft, warm, and highly fashionable for winter styling.',
        price: 149.99,
        category: fashionId,
        brand: 'Louis Vuitton',
        images: [{ url: '/images/lv-beanie.jpg', public_id: 'lv-beanie' }],
        stock: 50,
        isFeatured: true,
        features: ['100% Premium Lambswool', 'Iconic LV Monogram Embroidery', 'Ribbed Fold-Over Cuff Design', 'Pre-Shrunk Premium Fit'],
        specifications: [{ key: 'Material', value: '100% Wool' }, { key: 'Fit', value: 'Comfort Stretch Fit' }],
        tags: ['hat', 'beanie', 'fashion', 'lv', 'luxury']
      },
      {
        name: 'Chanel Classic CC Knitted Beanie',
        description: 'Exquisite ribbed knit beanie adorned with the classic CC logo patch. Provides unmatched warmth and style for high-end winter wear.',
        price: 169.99,
        category: fashionId,
        brand: 'Chanel',
        images: [{ url: '/images/chanel-beanie.jpg', public_id: 'chanel-beanie' }],
        stock: 45,
        isFeatured: true,
        features: ['Premium Cashmere Blend', 'Elegant Embroidered CC Logo', 'Soft Double-Knit Layering', 'Breathable Active Flex'],
        specifications: [{ key: 'Material', value: 'Cashmere Blend' }, { key: 'Fit', value: 'One Size Fits All' }],
        tags: ['hat', 'beanie', 'fashion', 'chanel', 'luxury']
      },
      {
        name: 'Miu Miu Mohair Ribbed Beanie',
        description: 'Soft brushed mohair blend beanie featuring the signature modern Miu Miu text embroidery logo. Cozy texture and premium comfort.',
        price: 129.99,
        category: fashionId,
        brand: 'Miu Miu',
        images: [{ url: '/images/miumiu-beanie.png', public_id: 'miumiu-beanie' }],
        stock: 35,
        isFeatured: true,
        features: ['Premium Mohair Blend Brushed Yarn', 'Signature Embroidered Text Logo', 'Thick Ribbed Construction', 'Lightweight & Fluffy Feel'],
        specifications: [{ key: 'Material', value: 'Mohair Blend' }, { key: 'Fit', value: 'Comfort Knit Fit' }],
        tags: ['hat', 'beanie', 'fashion', 'miumiu', 'luxury']
      },
      {
        name: 'Dior Oblique Pattern Beanie',
        description: 'Luxury jacquard wool beanie showcasing the iconic Dior Oblique print allover pattern with contrast fold-over cuff and gold thread details.',
        price: 159.99,
        category: fashionId,
        brand: 'Dior',
        images: [{ url: '/images/dior1-beanie.png', public_id: 'dior1-beanie' }],
        stock: 40,
        isFeatured: true,
        features: ['Allover Dior Oblique Jacquard', 'Premium Gold Thread Accent Logo', 'Heavyweight Premium Knit', 'Fold-Over Contrast Cuff'],
        specifications: [{ key: 'Material', value: '100% Fine Merino Wool' }, { key: 'Fit', value: 'Sleek Fit' }],
        tags: ['hat', 'beanie', 'fashion', 'dior', 'luxury']
      },
      {
        name: 'Christian Dior Signature Beanie',
        description: 'Allover print Christian Dior knit beanie with solid ribbed band border. Elegant modern luxury sportswear streetwear winter collection.',
        price: 179.99,
        category: fashionId,
        brand: 'Dior',
        images: [{ url: '/images/dior2-beanie.png', public_id: 'dior2-beanie' }],
        stock: 30,
        isFeatured: true,
        features: ['Allover Dior Print Pattern', 'Bold Solid Ribbed Band Border', 'Double Layer Insulated Yarn', 'Premium Winter Collector Beanie'],
        specifications: [{ key: 'Material', value: 'Pure Merino Wool Blend' }, { key: 'Fit', value: 'Comfort Streetwear Fit' }],
        tags: ['hat', 'beanie', 'fashion', 'dior', 'luxury']
      },
      {
        name: 'Sahu Urban Leather Jacket',
        description: 'Premium handcrafted faux leather jacket featuring a sleek modern fit, asymmetric zipper closure, double chest pockets, and comfortable inner lining.',
        price: 120.00,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-leather-jacket' }],
        stock: 60,
        isFeatured: true,
        features: ['Handcrafted High-Quality Faux Leather', 'Asymmetric Front YKK Zipper', 'Quilted Shoulder Panels', 'Warm Polyester Satin Lining'],
        specifications: [{ key: 'Material', value: 'Faux Leather / Polyester' }, { key: 'Fit', value: 'Slim Tailored Fit' }],
        tags: ['jacket', 'leather', 'fashion', 'outerwear', 'sahu']
      },
      {
        name: 'Sahu Urban Cargo Pants',
        description: 'Heavyweight cotton cargo pants featuring multiple utility pockets, elastic drawcord cuffs, and a relaxed boxy streetwear fit.',
        price: 59.99,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-cargo-pants' }],
        stock: 85,
        isFeatured: false,
        features: ['100% Heavyweight Cotton Twill', '6 Utility Cargo Flap Pockets', 'Adjustable Elasticated Drawcord Ankle Cuffs', 'Reinforced Knee Panels for Durability'],
        specifications: [{ key: 'Material', value: '100% Cotton' }, { key: 'Fit', value: 'Relaxed Streetwear Fit' }],
        tags: ['pants', 'cargo', 'streetwear', 'fashion', 'sahu']
      },
      {
        name: 'Vanguard Obsidian Sunglasses',
        description: 'Unisex classic aviator sunglasses featuring scratch-resistant polarized lenses, dynamic gold-tone metal frame, and comfortable nose pads.',
        price: 79.99,
        category: fashionId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-sunglasses' }],
        stock: 120,
        isFeatured: false,
        features: ['UV400 Polarized Protection Lenses', 'Lightweight Premium Metal Frame', 'Reinforced Double-Spring Hinges', 'Scratch-Resistant Lens Coating'],
        specifications: [{ key: 'Frame Material', value: 'Stainless Steel Gold-Plated' }, { key: 'Lens Technology', value: 'Polarized TAC' }],
        tags: ['sunglasses', 'glasses', 'fashion', 'accessories', 'vanguard']
      },
      {
        name: 'Sahu Unisex Cozy Knit Sweater',
        description: 'Soft wool-blend knitted sweater featuring a comfortable relaxed crewneck fit, ribbed cuffs, and textured winter weave.',
        price: 59.99,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-knit-sweater' }],
        stock: 120,
        isFeatured: false,
        features: ['Soft cotton-blend knit texture', 'Ribbed cuffs and hem detailing', 'Classic crewneck modern layout', 'Pre-shrunk for perfect fit'],
        specifications: [{ key: 'Material', value: '60% Cotton, 40% Acrylic' }, { key: 'Fit', value: 'Relaxed Fit' }],
        tags: ['sweater', 'knitwear', 'winter', 'fashion', 'sahu']
      },
      {
        name: 'Sahu Athletic Fleece Joggers',
        description: 'Cozy and stylish fleece joggers designed with an elastic drawcord waist, ribbed ankle cuffs, and secure zippered side pockets.',
        price: 44.99,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-fleece-joggers' }],
        stock: 140,
        isFeatured: false,
        features: ['Premium double-brushed soft fleece', 'Adjustable elastic waistband drawcord', 'Zippered side security pockets', 'Tapered legs with ribbed cuffs'],
        specifications: [{ key: 'Material', value: '80% Cotton, 20% Polyester' }, { key: 'Fit', value: 'Tapered Slim Fit' }],
        tags: ['pants', 'joggers', 'fleece', 'athletic', 'sahu']
      },
      {
        name: 'Vanguard Anti-Theft Travel Backpack',
        description: 'Durable waterproof travel backpack featuring hidden security zippers, built-in USB charging port link, and spacious laptop sleeve.',
        price: 69.99,
        category: fashionId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-travel-backpack' }],
        stock: 90,
        isFeatured: true,
        features: ['Hidden zipper and security pockets', 'Water-resistant durable polyester', 'Built-in USB charging port link', 'Fits up to 15.6" laptop'],
        specifications: [{ key: 'Dimensions', value: '45cm x 30cm x 15cm' }, { key: 'Capacity', value: '25 Liters' }],
        tags: ['backpack', 'travel', 'accessories', 'bag']
      },
      {
        name: 'Sahu Premium Full-Grain Leather Belt',
        description: 'Classic handcrafted dark brown belt made of premium full-grain vegetable tanned leather with a heavy solid brass buckle.',
        price: 34.99,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-leather-belt' }],
        stock: 160,
        isFeatured: false,
        features: ['100% genuine full-grain leather', 'Solid heavy-duty brass buckle', 'Hand-finished edge stitching', 'Versatile casual and formal look'],
        specifications: [{ key: 'Width', value: '1.5 Inches' }, { key: 'Material', value: 'Full Grain Vegetable-Tanned Leather' }],
        tags: ['belt', 'leather', 'accessories', 'fashion', 'sahu']
      },
      {
        name: 'Sahu Everyday Canvas Tote Bag',
        description: 'Heavyweight cotton canvas shopper tote bag featuring reinforced long handles and a secure inside zippered pocket for keys and phone.',
        price: 19.99,
        category: fashionId,
        brand: 'SahuFashion',
        images: [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', public_id: 'sahu-canvas-tote' }],
        stock: 250,
        isFeatured: false,
        features: ['Heavyweight 12oz cotton canvas', 'Reinforced long shoulder straps', 'Internal pocket with secure zipper', 'Eco-friendly and fully reusable'],
        specifications: [{ key: 'Dimensions', value: '40cm x 38cm x 10cm' }, { key: 'Material', value: '100% Cotton Canvas' }],
        tags: ['tote', 'bag', 'canvas', 'accessories', 'sahu']
      },
      {
        name: 'Vanguard Active Running Sneakers',
        description: 'Lightweight sports sneakers designed with a highly breathable mesh upper, supportive responsive foam sole, and anti-slip rubber traction.',
        price: 89.99,
        category: fashionId,
        brand: 'Vanguard',
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', public_id: 'vanguard-running-sneakers' }],
        stock: 75,
        isFeatured: true,
        features: ['Ultra-lightweight breathable mesh', 'Responsive foam cushioning sole', 'Durable non-slip rubber tread', 'Sock-like snug fit design'],
        specifications: [{ key: 'Sole Material', value: 'Phylon Foam & Rubber' }, { key: 'Weight', value: '250g (Single Shoe)' }],
        tags: ['shoes', 'sneakers', 'running', 'sport', 'fashion']
      },

      // HOME & LIVING (20 Products)
      {
        name: 'Minimalist Walnut Coffee Table',
        description: 'Handcrafted solid walnut wood coffee table. Seamless minimalist design elements with low profile support structures, perfect for modern Scandinavian-inspired living rooms.',
        price: 450.00,
        discountPrice: 399.00,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', public_id: 'walnut-coffee-table' }],
        stock: 12,
        isFeatured: false,
        features: ['100% Solid Natural Walnut Wood', 'Eco-Friendly Protective Matte Finish', 'Heavy-Duty Sturdy Support Beams', 'Quick 10-Minute Tools Assembly'],
        specifications: [{ key: 'Dimensions', value: '120cm x 60cm x 40cm' }, { key: 'Weight Capacity', value: '150 lbs' }],
        tags: ['furniture', 'wood', 'living-room', 'table']
      },
      {
        name: 'AuraGlow LED Desk Lamp',
        description: 'Modern minimalist desk lamp featuring touch control, adjustable brightness levels, multiple color temperature modes, and a built-in wireless smartphone charger.',
        price: 45.00,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-desk-lamp' }],
        stock: 95,
        isFeatured: false,
        features: ['5 Brightness & 5 Color Temp Modes', 'Qi-Certified Wireless Charger Base', 'Auto-Off Timer (30/60 mins)', 'Eye-Caring Diffused LED Light'],
        specifications: [{ key: 'Power Consumption', value: '12W' }, { key: 'Wireless Charging Output', value: '10W Fast Charging' }],
        tags: ['home', 'lamp', 'desk-decor', 'lighting']
      },
      {
        name: 'ErgoFlex Mesh Office Chair',
        description: 'Ergonomic high-back office chair with breathable cooling mesh back, adjustable lumbar support, 3D armrests, and dynamic reclining control.',
        price: 249.99,
        discountPrice: 219.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80', public_id: 'ergoflex-office-chair' }],
        stock: 40,
        isFeatured: true,
        features: ['Ergonomic Adjustable Lumbar Support', 'Breathable High-Elastic Mesh Backrest', '3D Adjustable Height Armrests', 'Heavy-Duty Nylon Base with Silent Castors'],
        specifications: [{ key: 'Weight Capacity', value: '300 lbs' }, { key: 'Recline Range', value: '90 - 135 Degrees' }],
        tags: ['chair', 'furniture', 'office', 'ergonomic']
      },
      {
        name: 'HydroZen Ultrasonic Humidifier',
        description: 'Quiet ultrasonic cool mist humidifier with a 4L water tank, customizable essential oil tray, auto shut-off safety, and smart LED display.',
        price: 39.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&w=800&q=80', public_id: 'hydrozen-humidifier' }],
        stock: 130,
        isFeatured: false,
        features: ['4-Liter High Capacity Tank', 'Super Quiet Whisper Operation', 'Essential Oil Aromatherapy Diffuser', 'Auto-Off Safety Sensor Shutoff'],
        specifications: [{ key: 'Mist Output', value: 'Up to 300 ml/h' }, { key: 'Runtime', value: 'Up to 30 Hours (Low Mist)' }],
        tags: ['humidifier', 'home', 'appliance', 'wellness']
      },
      {
        name: 'ThermoKeep Insulated Tumbler',
        description: 'Double-wall vacuum insulated travel tumbler made of premium food-grade stainless steel with a leakproof lid and straw.',
        price: 24.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', public_id: 'thermokeep-tumbler' }],
        stock: 300,
        isFeatured: false,
        features: ['Double-Wall Vacuum Insulation Tech', 'Premium 18/8 Food-Grade Stainless Steel', 'Leakproof Smart Seal Straw Lid', 'Keeps Cold 24 Hours, Hot 12 Hours'],
        specifications: [{ key: 'Capacity', value: '40 oz / 1180 ml' }, { key: 'BPA Free', value: 'Yes' }],
        tags: ['tumbler', 'flask', 'bottle', 'kitchen']
      },
      {
        name: 'BaristaPro Espresso Maker',
        description: 'Compact 15-bar pump espresso coffee machine featuring integrated steam milk frother wand for lattes and double shot filters.',
        price: 199.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1517913967380-c35b1db3014c?auto=format&fit=crop&w=800&q=80', public_id: 'baristapro-espresso' }],
        stock: 25,
        isFeatured: true,
        features: ['15-Bar High Pressure Italian Pump', 'Professional Steam Milk Frother Wand', 'Dual-Filter Espresso Baskets', 'Removable 1.5L Large Water Tank'],
        specifications: [{ key: 'Power Output', value: '1350W' }, { key: 'Water Tank Capacity', value: '1.5 Liters' }],
        tags: ['coffee', 'espresso', 'kitchen', 'appliance']
      },
      {
        name: 'PureBreeze HEPA Air Purifier',
        description: 'High-performance smart air purifier with 3-stage True HEPA filter, air quality auto-sensors, and low noise sleep control mode.',
        price: 129.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80', public_id: 'purebreeze-air-purifier' }],
        stock: 65,
        isFeatured: false,
        features: ['3-Stage True HEPA Filter System', 'Captures 99.97% Particles & Allergens', 'Real-Time Smart Air Quality Sensor', 'Ultra-Quiet 22dB Sleep Mode Operation'],
        specifications: [{ key: 'Coverage Area', value: 'Up to 300 sq. ft.' }, { key: 'CADR Rating', value: '150 CFM' }],
        tags: ['purifier', 'air', 'home', 'appliance']
      },
      {
        name: 'NovaGlow Smart Bulb Pack',
        description: 'Pack of 4 smart LED bulbs compatible with Wi-Fi, customizable color hues, and Google Assistant voice control systems.',
        price: 34.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1550525255-cc1c76d93639?auto=format&fit=crop&w=800&q=80', public_id: 'novaglow-smart-bulbs' }],
        stock: 150,
        isFeatured: false,
        features: ['16 Million Colors + Tunable White Hues', 'No Hub Required (Direct Wi-Fi Setup)', 'Google Assistant & Alexa Voice Control', 'Custom Schedules & Device Grouping'],
        specifications: [{ key: 'Wattage Equivalent', value: '60W (Uses 9W LED)' }, { key: 'Bulb Base Type', value: 'E26 Standard' }],
        tags: ['bulb', 'smart', 'lighting', 'home']
      },
      {
        name: 'Sahu Modern Velvet Accent Chair',
        description: 'Stunning accent armchair upholstered in soft premium velvet fabric with golden metal legs. Ideal for living rooms and bedrooms.',
        price: 179.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', public_id: 'velvet-accent-chair' }],
        stock: 20,
        isFeatured: true,
        features: ['Ultra-Soft Premium Velvet Upholstery', 'Sturdy Golden electroplated Metal Legs', 'High-Density Thick Foam Padding Cushion', 'Ergonomic Curved Backrest Design'],
        specifications: [{ key: 'Seat Width', value: '65 cm' }, { key: 'Weight Limit', value: '250 lbs' }],
        tags: ['chair', 'furniture', 'living-room', 'velvet']
      },
      {
        name: 'EcoBreeze Smart Thermostat',
        description: 'Energy-saving smart thermostat featuring Wi-Fi integration, auto-scheduling, and companion mobile app controls.',
        price: 139.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=80', public_id: 'smart-thermostat' }],
        stock: 50,
        isFeatured: false,
        features: ['Auto-Schedule Learning Technology', 'Saves Up to 15% Heating & Cooling Costs', 'Remote App Temp Control Adjustment', 'Smart Home Ecosystem Integration Ready'],
        specifications: [{ key: 'Display Type', value: 'LCD Color Touchscreen' }, { key: 'Wireless Protocols', value: 'Wi-Fi, Bluetooth' }],
        tags: ['thermostat', 'smart', 'home-automation', 'heating']
      },
      {
        name: 'AuraGlow Smart LED Light Strip',
        description: 'Vibrant RGB app-controlled LED strip lights designed for creating accent lighting under cabinets, behind TVs, or along beds.',
        price: 29.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-smart-strip' }],
        stock: 120,
        isFeatured: false,
        features: ['16 million dimmable colors', 'Smart app & voice control integration', 'Sync lights with music beats', 'Strong self-adhesive backing tape'],
        specifications: [{ key: 'Length', value: '16.4 Feet (5 Meters)' }, { key: 'Connectivity', value: 'Wi-Fi 2.4GHz' }],
        tags: ['lighting', 'led', 'smart-home', 'decor']
      },
      {
        name: 'WoodSmith Solid Oak Cutting Board',
        description: 'Heavy-duty wooden butcher block cutting board made of premium solid oak wood with integrated side juice grooves.',
        price: 39.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&w=800&q=80', public_id: 'woodsmith-cutting-board' }],
        stock: 85,
        isFeatured: false,
        features: ['Handcrafted solid natural oak wood', 'Deep juice groove along borders', 'Pre-treated with food-safe oil', 'Reversible dual-sided cutting area'],
        specifications: [{ key: 'Dimensions', value: '40cm x 30cm x 3cm' }, { key: 'Wood Type', value: 'European White Oak' }],
        tags: ['kitchen', 'wood', 'cutting-board', 'cooking']
      },
      {
        name: 'AuraGlow Electric Gooseneck Kettle',
        description: 'Sleek stainless steel electric kettle with a slender gooseneck spout for precise water pouring control during pour-over coffee brewing.',
        price: 69.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-electric-kettle' }],
        stock: 75,
        isFeatured: true,
        features: ['Precision pour gooseneck spout design', '1200W rapid boiling technology', 'Food-grade premium stainless steel interior', 'Auto shut-off and boil-dry safety'],
        specifications: [{ key: 'Capacity', value: '0.8 Liters' }, { key: 'Power Output', value: '1200W' }],
        tags: ['kitchen', 'kettle', 'coffee', 'tea']
      },
      {
        name: 'WoodSmith Floating Wall Shelves',
        description: 'Set of three decorative wall-mounted floating wood shelves with brackets, adding space-saving organization to living rooms.',
        price: 34.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', public_id: 'woodsmith-floating-shelves' }],
        stock: 110,
        isFeatured: false,
        features: ['Set of 3 rustic pine wood shelves', 'Heavy-duty steel mounting brackets', 'Adds modern storage & organization', 'Easy step-by-step wall installation'],
        specifications: [{ key: 'Sizes', value: 'Large: 16", Medium: 14", Small: 12"' }, { key: 'Max Capacity', value: '40 lbs total' }],
        tags: ['decor', 'furniture', 'shelves', 'living-room']
      },
      {
        name: 'AuraGlow Ceramic Essential Oil Diffuser',
        description: 'Beautiful modern ceramic stone ultrasonic cool mist humidifier and aromatherapy diffuser for essential oils.',
        price: 39.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-ceramic-diffuser' }],
        stock: 95,
        isFeatured: false,
        features: ['Handcrafted ceramic stone cover', 'Silent ultrasonic cool mist spray', 'Continuous and intermittent modes', 'Safety auto-off sensor system'],
        specifications: [{ key: 'Capacity', value: '120 ml' }, { key: 'Runtime', value: 'Up to 8 Hours' }],
        tags: ['decor', 'diffuser', 'wellness', 'home']
      },
      {
        name: 'WoodSmith Orthopedic Memory Foam Pillow',
        description: 'Contoured neck support pillow constructed from high-density memory foam to relieve neck stiffness and promote restful sleep.',
        price: 45.00,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80', public_id: 'woodsmith-foam-pillow' }],
        stock: 150,
        isFeatured: false,
        features: ['Ergonomic contour neck support shape', 'High-density pressure-relieving foam', 'Washable hypoallergenic cover fabric', 'Promotes optimal sleeping alignment'],
        specifications: [{ key: 'Dimensions', value: '60cm x 35cm x 11cm' }, { key: 'Cover Material', value: '60% Polyester, 40% Bamboo' }],
        tags: ['bedding', 'pillow', 'sleep', 'home']
      },
      {
        name: 'AuraGlow Multi-Tier Spice Rack Organizer',
        description: 'Three-tiered step-style standing spice rack organizer crafted from rust-resistant stainless steel for kitchens and pantries.',
        price: 24.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-spice-rack' }],
        stock: 180,
        isFeatured: false,
        features: ['Sleek 3-tier step-style layout', 'Rust-resistant stainless steel frame', 'Anti-slip rubber feet protection', 'Perfect for countertop or pantry'],
        specifications: [{ key: 'Dimensions', value: '35cm x 22cm x 15cm' }, { key: 'Material', value: 'Stainless Steel' }],
        tags: ['kitchen', 'organizer', 'storage', 'cooking']
      },
      {
        name: 'WoodSmith Self-Watering Ceramic Planter',
        description: 'Smart self-watering indoor plant pot made of elegant ceramic with a terracotta reservoir insert to prevent plant root dry out.',
        price: 29.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', public_id: 'woodsmith-watering-planter' }],
        stock: 130,
        isFeatured: false,
        features: ['Elegant ceramic terracotta look', 'Smart self-watering wick mechanism', 'Prevents root rot and overwatering', 'Perfect for indoor herbs & plants'],
        specifications: [{ key: 'Diameter', value: '6 Inches' }, { key: 'Material', value: 'Ceramic & Terracotta' }],
        tags: ['decor', 'planter', 'garden', 'indoor']
      },
      {
        name: 'AuraGlow Digital Kitchen Food Scale',
        description: 'Precise kitchen food scale featuring a tempered glass surface, convenient tare function, and measurements in grams and ounces.',
        price: 19.99,
        category: homeId,
        brand: 'AuraGlow',
        images: [{ url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80', public_id: 'auraglow-kitchen-scale' }],
        stock: 220,
        isFeatured: false,
        features: ['Precise weight measurements (g, oz, ml)', 'Tempered glass touch-sensitive surface', 'Easy-to-use Tare zero-out button', 'Bright backlit digital LCD display'],
        specifications: [{ key: 'Max Capacity', value: '11 lbs / 5 kg' }, { key: 'Accuracy', value: '0.1 oz / 1 g' }],
        tags: ['kitchen', 'scale', 'cooking', 'baking']
      },
      {
        name: 'WoodSmith Turkish Cotton Bath Towel Set',
        description: 'Luxury bathroom towel bundle containing four highly absorbent, thick, and premium combed genuine Turkish cotton towels.',
        price: 49.99,
        category: homeId,
        brand: 'WoodSmith',
        images: [{ url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80', public_id: 'woodsmith-towel-set' }],
        stock: 90,
        isFeatured: true,
        features: ['Set of 4 luxury bath towels', '100% genuine combed Turkish cotton', 'Extra thick, soft, and high absorbency', 'Durable double-stitched hem styling'],
        specifications: [{ key: 'Dimensions', value: '140cm x 70cm' }, { key: 'GSM Rating', value: '600 GSM' }],
        tags: ['bath', 'towels', 'bathroom', 'home']
      },

      // BEAUTY & WELLNESS (20 Products)
      {
        name: 'GlowElixir Vitamin C Serum',
        description: 'Advanced skin brightening serum formulated with pure organic 15% Vitamin C, rich hyaluronic acid, and nourishing Vitamin E for glowing daily skin complexions.',
        price: 49.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', public_id: 'glow-elixir-serum' }],
        stock: 250,
        isFeatured: false,
        features: ['15% Pure Active Vitamin C', 'Enriched with Plant-Derived Hyaluronic Acid', '100% Vegan and Cruelty-Free', 'Fragrance-Free Formulation'],
        specifications: [{ key: 'Volume', value: '30ml / 1.0 fl oz' }, { key: 'Skin Type', value: 'All (Including Sensitive Skin)' }],
        tags: ['beauty', 'skincare', 'serum', 'glow']
      },
      {
        name: 'HydraBoost Face Moisturizer',
        description: 'Daily oil-free gel moisturizer formulated with purified hyaluronic acid to instantly hydrate dry skin, lock in moisture, and leave skin looking smooth and supple.',
        price: 24.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80', public_id: 'hydraboost-moisturizer' }],
        stock: 300,
        isFeatured: false,
        features: ['Purified Hyaluronic Acid Formula', 'Clinically Proven 48-Hour Hydration', 'Non-Comedogenic & Oil-Free', 'Lightweight Fast-Absorbing Gel'],
        specifications: [{ key: 'Volume', value: '50ml / 1.7 fl oz' }, { key: 'Skin Type', value: 'Dry / Combination' }],
        tags: ['beauty', 'skincare', 'moisturizer', 'hydration']
      },
      {
        name: 'RoseHydra Organic Face Mist',
        description: 'Refreshing facial spray infused with organic rosewater and cooling aloe vera extracts to instantly soothe, hydrate, and prep skin.',
        price: 16.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', public_id: 'rosehydra-face-mist' }],
        stock: 180,
        isFeatured: false,
        features: ['100% Organic Steam-Distilled Rosewater', 'Infused with Soothing Aloe Vera Extract', 'Instantly Hydrates, Soothes & Refreshes', 'Use as Makeup Prep or Mid-Day Mist'],
        specifications: [{ key: 'Volume', value: '100ml / 3.4 fl oz' }, { key: 'Alcohol Free', value: 'Yes' }],
        tags: ['mist', 'toner', 'skincare', 'beauty']
      },
      {
        name: 'CharcoalGlow Purifying Clay Mask',
        description: 'Deep pore cleansing clay mask formulated with active bentonite clay and charcoal powder to remove impurities, control oiliness, and refine pores.',
        price: 21.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1567894192231-d22d9c12214d?auto=format&fit=crop&w=800&q=80', public_id: 'charcoalglow-clay-mask' }],
        stock: 140,
        isFeatured: false,
        features: ['Activated Charcoal Powder Pulls Impurities', 'Bentonite and Kaolin Clay Absorb Sebum', 'Exfoliates & Tightens Facial Skin Pores', 'Free of Parabens & Synthetic Dyes'],
        specifications: [{ key: 'Net Weight', value: '120g / 4.2 oz' }, { key: 'Recommended Use', value: '1-2 Times Weekly' }],
        tags: ['mask', 'clay', 'skincare', 'cleansing']
      },
      {
        name: 'ActiveRecovery Muscle Massage Gun',
        description: 'Professional deep tissue percussion massager with 6 speed options, 4 interchangeable heads, and a quiet brushless motor.',
        price: 89.99,
        discountPrice: 79.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1519826314856-4c0792796455?auto=format&fit=crop&w=800&q=80', public_id: 'massage-gun' }],
        stock: 80,
        isFeatured: true,
        features: ['High-Torque Deep Tissue Percussion', '6 Adjustable Intensity Speed Levels', '4 Interchangeable Custom Massage Heads', 'Quiet Brushless Motor Technology (45dB)'],
        specifications: [{ key: 'Battery Life', value: 'Up to 6 Hours per Charge' }, { key: 'Stroke Length', value: '12mm Amplitude' }],
        tags: ['massage', 'recovery', 'fitness', 'wellness']
      },
      {
        name: 'AuraDiffuser Essential Oil Kit',
        description: 'Therapeutic set containing a 300ml silent essential oil mist diffuser and 6 organic lavender and eucalyptus oil bottles.',
        price: 27.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', public_id: 'essential-oil-kit' }],
        stock: 110,
        isFeatured: false,
        features: ['300ml Cool Mist Diffuser Unit', '7-Color Soft Ambient LED Night Lights', 'Includes 6 Organic Essential Oils Set', 'Auto-Shutoff Sensor When Water Runs Out'],
        specifications: [{ key: 'Diffuser Capacity', value: '300 ml' }, { key: 'Essential Oils Included', value: 'Lavender, Eucalyptus, Mint, Orange, Tea Tree, Lemon' }],
        tags: ['diffuser', 'wellness', 'aromatherapy', 'oils']
      },
      {
        name: 'SlickLocks Matte Hair Styling Clay',
        description: 'High hold matte finish hair styling clay enriched with natural organic bentonite clay and nourishing argan oil for men.',
        price: 18.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', public_id: 'slicklocks-hair-clay' }],
        stock: 200,
        isFeatured: false,
        features: ['Strong All-Day Hold Control Factor', 'Natural Clean Matte No-Shine Finish', 'Nourishing Argan Oil and Bentonite Clay', 'Water-Soluble Formula Rinses Out Easily'],
        specifications: [{ key: 'Hold Level', value: 'Strong Hold (4/5)' }, { key: 'Volume', value: '100g / 3.5 oz' }],
        tags: ['hair', 'styling', 'clay', 'mens-grooming']
      },
      {
        name: 'NutriDaily Organic Multivitamins',
        description: 'Premium organic whole-food daily multivitamin supplements for men and women, containing essential minerals and antioxidants.',
        price: 34.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', public_id: 'multivitamins' }],
        stock: 250,
        isFeatured: false,
        features: ['Whole-Food Sourced Organic Multivitamin', 'Contains Essential Minerals & Vitamin D3', 'Rich in Antioxidants & Digestive Enzymes', 'Non-GMO, Gluten-Free & Vegan Certified'],
        specifications: [{ key: 'Servings per Container', value: '60 Veggie Capsules' }, { key: 'Recommended Dosage', value: '2 Capsules Daily' }],
        tags: ['supplements', 'vitamins', 'wellness', 'organic']
      },
      {
        name: 'AquaBalm Organic Lip Treatment',
        description: 'Pack of 3 intensely hydrating organic lip balms enriched with raw shea butter and organic coconut oil.',
        price: 12.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', public_id: 'lip-balm' }],
        stock: 350,
        isFeatured: false,
        features: ['Intensely Hydrates Dry Chapped Lips', 'Enriched with Raw Shea Butter & Beeswax', '100% Organic and Natural Ingredients', 'Includes 3 Scents: Mint, Vanilla, Coconut'],
        specifications: [{ key: 'Net Weight', value: '4.25g per Stick' }, { key: 'Flavor/Scent Pack', value: 'Mint, Coconut, Vanilla' }],
        tags: ['beauty', 'lip-balm', 'hydration', 'skincare']
      },
      {
        name: 'SleepWell Organic Sleep Tea',
        description: 'Therapeutic organic herbal tea blend formulated with chamomile, valerian root, and lavender flowers to promote deep sleep.',
        price: 15.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', public_id: 'sleep-tea' }],
        stock: 190,
        isFeatured: false,
        features: ['Herbal Valerian & Chamomile Blend', 'Promotes Deep Relaxation and Better Sleep', '100% Caffeine-Free Organic Tea Bags', 'Naturally Sweetened with Stevia Leaves'],
        specifications: [{ key: 'Teabags count', value: '30 Tea Bags per Box' }, { key: 'Net Weight', value: '60g / 2.1 oz' }],
        tags: ['tea', 'sleep', 'herbal', 'wellness']
      },
      {
        name: 'GlowElixir Retinol Renewal Cream',
        description: 'Advanced night face cream containing 2.5% active retinol and organic botanical extracts to target fine lines and signs of aging.',
        price: 39.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80', public_id: 'glowelixir-retinol' }],
        stock: 160,
        isFeatured: false,
        features: ['2.5% Active Retinol Liposome complex', 'Formulated with Organic Jojoba Oil', 'Reduces lines and improves skin texture', 'Designed for gentle night-time use'],
        specifications: [{ key: 'Volume', value: '50ml / 1.7 fl oz' }, { key: 'Best Use', value: 'Nightly application' }],
        tags: ['skincare', 'retinol', 'beauty', 'anti-aging']
      },
      {
        name: 'HydraBoost Hydrating Cleansing Gel',
        description: 'Mild, soap-free hydrating facial cleanser gel that sweeps away daily impurities while restoring vital skin moisture.',
        price: 18.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', public_id: 'hydraboost-cleanser' }],
        stock: 240,
        isFeatured: false,
        features: ['Gentle foaming soap-free wash', 'Enriched with skin-loving Hyaluronic Acid', 'Removes daily dirt, makeup, and oil', 'Dermatologist tested formula'],
        specifications: [{ key: 'Volume', value: '200ml / 6.7 fl oz' }, { key: 'pH Level', value: 'Balanced 5.5' }],
        tags: ['skincare', 'cleanser', 'beauty', 'wash']
      },
      {
        name: 'CharcoalGlow Exfoliating Face Scrub',
        description: 'Invigorating facial scrub formulated with activated charcoal and organic walnut shell powder to gently exfoliate and detoxify.',
        price: 15.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1567894192231-d22d9c12214d?auto=format&fit=crop&w=800&q=80', public_id: 'charcoalglow-scrub' }],
        stock: 190,
        isFeatured: false,
        features: ['Natural micro-fine charcoal particles', 'Exfoliates dead cells & unclogs pores', 'Infused with soothing tea tree oil', 'Leaves skin feeling soft and clean'],
        specifications: [{ key: 'Volume', value: '100ml / 3.4 fl oz' }, { key: 'Fragrance', value: 'Fresh Tea Tree' }],
        tags: ['skincare', 'scrub', 'exfoliator', 'beauty']
      },
      {
        name: 'RoseHydra Soothing Jade Roller Set',
        description: 'Authentic green jade roller and heart-shaped Gua Sha scraping massage tool set for skin toning and facial tension release.',
        price: 24.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80', public_id: 'rosehydra-jade-roller' }],
        stock: 150,
        isFeatured: false,
        features: ['100% natural authentic jade stone', 'Dual-sided roller for face and eyes', 'Includes cooling Gua Sha scrape tool', 'Reduces puffiness & boosts circulation'],
        specifications: [{ key: 'Material', value: 'Natural Green Jade & Metal' }, { key: 'Storage', value: 'Keep in fridge for extra cooling' }],
        tags: ['beauty-tools', 'roller', 'massage', 'wellness']
      },
      {
        name: 'ActiveRecovery Yoga Mat & Strap',
        description: 'Thick, non-slip textured TPE yoga and fitness mat with an adjustable cotton shoulder carrying strap.',
        price: 34.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80', public_id: 'activerecovery-yoga-mat' }],
        stock: 120,
        isFeatured: true,
        features: ['High-density 6mm thickness comfort foam', 'Non-slip dual texture surfaces', 'Includes adjustable cotton carrying strap', 'Eco-friendly non-toxic TPE material'],
        specifications: [{ key: 'Dimensions', value: '183cm x 61cm x 0.6cm' }, { key: 'Weight', value: '1.8 lbs' }],
        tags: ['yoga', 'mat', 'fitness', 'wellness']
      },
      {
        name: 'AuraDiffuser Lavender Pillow Mist',
        description: 'Soothing aromatherapy spray blended with organic French lavender to mist on linens and pillows before sleeping.',
        price: 14.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', public_id: 'auradiffuser-pillow-mist' }],
        stock: 210,
        isFeatured: false,
        features: ['Infused with organic lavender essential oil', 'Promotes deep relaxation & calming sleep', 'Spray directly on pillows or bed linens', '100% natural non-staining formulation'],
        specifications: [{ key: 'Volume', value: '100ml / 3.4 fl oz' }, { key: 'Main Ingredient', value: 'Lavender Hydrosol' }],
        tags: ['mist', 'sleep', 'aromatherapy', 'wellness']
      },
      {
        name: 'SlickLocks Organic Argan Hair Oil',
        description: '100% pure cold-pressed Moroccan argan oil that conditions hair ends, controls frizz, and gives an ultra-healthy shine.',
        price: 22.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', public_id: 'slicklocks-argan-oil' }],
        stock: 180,
        isFeatured: false,
        features: ['100% pure cold-pressed argan oil', 'Nourishes dry hair and adds brilliant shine', 'Protects hair from styling heat damage', 'Lightweight and completely non-greasy'],
        specifications: [{ key: 'Volume', value: '60ml / 2.0 fl oz' }, { key: 'Origin', value: 'Morocco' }],
        tags: ['hair', 'oil', 'argan', 'beauty']
      },
      {
        name: 'NutriDaily Premium Collagen Peptides',
        description: 'Unflavored grass-fed bovine collagen powder supplement that supports bone joints, skin elasticity, and hair strength.',
        price: 29.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: '/images/nutridaily-collagen.png', public_id: 'nutridaily-collagen' }],
        stock: 130,
        isFeatured: false,
        features: ['Grass-fed pasture-raised bovine collagen', 'Supports healthy joints, skin, hair, and nails', 'Hydrolyzed formula dissolves instantly', 'Unflavored - mix in hot or cold drinks'],
        specifications: [{ key: 'Net Weight', value: '280g / 10 oz' }, { key: 'Servings', value: '25 Servings' }],
        tags: ['supplements', 'collagen', 'wellness', 'organic']
      },
      {
        name: 'AquaBalm Hydrating Coconut Lip Scrub',
        description: 'Exfoliating organic brown sugar lip scrub enriched with virgin coconut oil to sweep away dry flake skin.',
        price: 9.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', public_id: 'aquabalm-lip-scrub' }],
        stock: 300,
        isFeatured: false,
        features: ['Natural exfoliating organic cane sugar', 'Enriched with virgin coconut oil and shea', 'Gently sweeps away dry skin flakes', 'Leaves lips incredibly soft and prepped'],
        specifications: [{ key: 'Net Weight', value: '20g / 0.7 oz' }, { key: 'Flavor', value: 'Sweet Coconut' }],
        tags: ['skincare', 'scrub', 'lip-balm', 'beauty']
      },
      {
        name: 'SleepWell Weighted Sleep Eye Mask',
        description: 'Premium weighted eye mask wrapped in cooling double-sided satin and filled with micro-beads to soothe eye fatigue.',
        price: 19.99,
        category: beautyId,
        brand: 'GlowElixir',
        images: [{ url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', public_id: 'sleepwell-eye-mask' }],
        stock: 160,
        isFeatured: true,
        features: ['Weighted with natural glass micro-beads', 'Soft luxury double-sided satin fabric', 'Blocks out 100% of light for deep sleep', 'Evenly distributed relaxing pressure'],
        specifications: [{ key: 'Weight', value: '0.5 lbs' }, { key: 'Material', value: '100% Polyester Satin' }],
        tags: ['sleep', 'mask', 'weighted', 'wellness']
      }
    ];

    // Assign incremental distinct createdAt timestamps so they sort sequentially
    const productsWithTimestamps = productsData.map((p, idx) => ({
      ...p,
      createdAt: new Date(Date.now() - (productsData.length - idx) * 1000)
    }));
    const seededProducts = await Product.create(productsWithTimestamps);
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

    // Test Customer User Account (Fatima)
    const fatimaUser = await User.create({
      name: 'Fatima',
      email: 'fatima@shopmern.com',
      password: 'customer12345', // Bcrypt pre-save hashes this automatically
      role: 'user',
      isVerified: true,
      avatar: '/model_pakistani_girl1.png',
      phone: '+92 300-1234567',
      addresses: [
        {
          street: 'House 123, Sector F-11',
          city: 'Islamabad',
          state: 'Federal',
          postalCode: '44000',
          country: 'Pakistan',
          isDefault: true
        }
      ]
    });

    const aliUser = await User.create({
      name: 'Ali Khan',
      email: 'ali@shopmern.com',
      password: 'customer12345',
      role: 'user',
      isVerified: true,
      avatar: '/model_pakistani_boy1.png',
      phone: '+92 321-7654321',
      addresses: [
        {
          street: 'Block 4, Gulshan-e-Iqbal',
          city: 'Karachi',
          state: 'Sindh',
          postalCode: '75300',
          country: 'Pakistan',
          isDefault: true
        }
      ]
    });

    const ayeshaUser = await User.create({
      name: 'Ayesha Ahmed',
      email: 'ayesha@shopmern.com',
      password: 'customer12345',
      role: 'user',
      isVerified: true,
      avatar: '/model_pakistani_girl2.png',
      phone: '+92 333-9876543',
      addresses: [
        {
          street: 'Phase 5, DHA',
          city: 'Lahore',
          state: 'Punjab',
          postalCode: '54000',
          country: 'Pakistan',
          isDefault: true
        }
      ]
    });

    console.log('Admin and Customer accounts seeded successfully.');

    // 7. Seed Orders (Exactly 10 orders)
    const ordersData = [
      {
        user: fatimaUser._id,
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
        shippingAddress: fatimaUser.addresses[0],
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
        user: fatimaUser._id,
        orderItems: [
          {
            name: seededProducts[2].name,
            qty: 1,
            image: seededProducts[2].images[0].url,
            price: seededProducts[2].price,
            product: seededProducts[2]._id
          }
        ],
        shippingAddress: fatimaUser.addresses[0],
        paymentMethod: 'cod',
        itemsPrice: seededProducts[2].price,
        taxPrice: 5.00,
        shippingPrice: 5.00,
        totalPrice: seededProducts[2].price + 10.00,
        isPaid: false,
        isDelivered: false,
        status: 'pending'
      },
      {
        user: aliUser._id,
        orderItems: [
          {
            name: seededProducts[14].name,
            qty: 1,
            image: seededProducts[14].images[0].url,
            price: seededProducts[14].price,
            product: seededProducts[14]._id
          }
        ],
        shippingAddress: aliUser.addresses[0],
        paymentMethod: 'cod',
        itemsPrice: seededProducts[14].price,
        taxPrice: 3.50,
        shippingPrice: 5.00,
        totalPrice: seededProducts[14].price + 8.50,
        isPaid: false,
        isDelivered: false,
        status: 'pending'
      },
      {
        user: ayeshaUser._id,
        orderItems: [
          {
            name: seededProducts[20].name,
            qty: 1,
            image: seededProducts[20].images[0].url,
            price: seededProducts[20].price,
            product: seededProducts[20]._id
          }
        ],
        shippingAddress: ayeshaUser.addresses[0],
        paymentMethod: 'stripe',
        itemsPrice: seededProducts[20].price,
        taxPrice: 18.00,
        shippingPrice: 12.00,
        totalPrice: seededProducts[20].price + 30.00,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'delivered'
      },
      {
        user: fatimaUser._id,
        orderItems: [
          {
            name: seededProducts[40].name,
            qty: 1,
            image: seededProducts[40].images[0].url,
            price: seededProducts[40].price,
            product: seededProducts[40]._id
          }
        ],
        shippingAddress: fatimaUser.addresses[0],
        paymentMethod: 'stripe',
        itemsPrice: seededProducts[40].price,
        taxPrice: 40.00,
        shippingPrice: 25.00,
        totalPrice: seededProducts[40].price + 65.00,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        status: 'processing'
      },
      {
        user: aliUser._id,
        orderItems: [
          {
            name: seededProducts[60].name,
            qty: 3,
            image: seededProducts[60].images[0].url,
            price: seededProducts[60].price,
            product: seededProducts[60]._id
          }
        ],
        shippingAddress: aliUser.addresses[0],
        paymentMethod: 'cod',
        itemsPrice: seededProducts[60].price * 3,
        taxPrice: 15.00,
        shippingPrice: 5.00,
        totalPrice: (seededProducts[60].price * 3) + 20.00,
        isPaid: false,
        isDelivered: false,
        status: 'pending'
      },
      {
        user: ayeshaUser._id,
        orderItems: [
          {
            name: seededProducts[18].name,
            qty: 1,
            image: seededProducts[18].images[0].url,
            price: seededProducts[18].price,
            product: seededProducts[18]._id
          }
        ],
        shippingAddress: ayeshaUser.addresses[0],
        paymentMethod: 'stripe',
        itemsPrice: seededProducts[18].price,
        taxPrice: 8.00,
        shippingPrice: 5.00,
        totalPrice: seededProducts[18].price + 13.00,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        status: 'shipped'
      },
      {
        user: fatimaUser._id,
        orderItems: [
          {
            name: seededProducts[21].name,
            qty: 2,
            image: seededProducts[21].images[0].url,
            price: seededProducts[21].price,
            product: seededProducts[21]._id
          }
        ],
        shippingAddress: fatimaUser.addresses[0],
        paymentMethod: 'cod',
        itemsPrice: seededProducts[21].price * 2,
        taxPrice: 10.00,
        shippingPrice: 5.00,
        totalPrice: (seededProducts[21].price * 2) + 15.00,
        isPaid: false,
        isDelivered: false,
        status: 'pending'
      },
      {
        user: aliUser._id,
        orderItems: [
          {
            name: seededProducts[45].name,
            qty: 1,
            image: seededProducts[45].images[0].url,
            price: seededProducts[45].price,
            product: seededProducts[45]._id
          }
        ],
        shippingAddress: aliUser.addresses[0],
        paymentMethod: 'stripe',
        itemsPrice: seededProducts[45].price,
        taxPrice: 20.00,
        shippingPrice: 15.00,
        totalPrice: seededProducts[45].price + 35.00,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'delivered'
      },
      {
        user: ayeshaUser._id,
        orderItems: [
          {
            name: seededProducts[64].name,
            qty: 1,
            image: seededProducts[64].images[0].url,
            price: seededProducts[64].price,
            product: seededProducts[64]._id
          }
        ],
        shippingAddress: ayeshaUser.addresses[0],
        paymentMethod: 'cod',
        itemsPrice: seededProducts[64].price,
        taxPrice: 3.50,
        shippingPrice: 5.00,
        totalPrice: seededProducts[64].price + 8.50,
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
