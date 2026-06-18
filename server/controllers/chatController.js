import Product from '../models/Product.js';

export const handleChat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Please provide message history' });
    }

    // 1. Fetch active products with images to ground the AI with rich media details
    const products = await Product.find({ isActive: true }).select('name price brand slug images').populate('category', 'name');
    
    // Format product lists for prompt injection, including image URLs
    const productSummary = products.map(p => {
      const imgUrl = p.images?.[0]?.url || '';
      return `- Name: ${p.name}, Price: $${p.price}, Category: ${p.category?.name || 'Uncategorized'}, Brand: ${p.brand}, Image: ${imgUrl}, Slug: ${p.slug}`;
    }).join('\n');

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      console.warn('GEMINI_API_KEY not configured. Falling back to rule-based auto-helper.');
      const userText = messages[messages.length - 1]?.text || '';
      
      // Look for matches in product name, brand, or category
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(userText.toLowerCase()) || 
        p.brand.toLowerCase().includes(userText.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(userText.toLowerCase())
      ).slice(0, 3);
      
      let reply = "I'm SmartBazar's virtual assistant! To unlock my advanced AI features, please ask the admin to configure GEMINI_API_KEY in the environment.";
      if (matched.length > 0) {
        reply += `\n\nBased on your query, here are some products with their pictures:\n`;
        matched.forEach(p => {
          const img = p.images?.[0]?.url || '';
          reply += `\n[PRODUCT: ${p.name} | ${p.price} | ${img} | ${p.slug}]`;
        });
      } else {
        reply += `\n\nHow can I help you today? You can ask me about our Electronics, Fashion, Home, or Beauty products. (Try checking out our 'SAM10' coupon code for a 10% discount!)`;
      }
      return res.status(200).json({ success: true, reply });
    }

    // Prepare system instructions for e-commerce grounding with token commands
    const systemPrompt = `You are "SmartBazar Assistant", a helpful, friendly AI shopping assistant.
Your goal is to guide customers and recommend products from the list below.
For EVERY product you recommend or mention, you MUST append this exact product card token at the end of your recommendation:
[PRODUCT: Name | Price | Image URL | Slug]
Example: if you recommend the headphones, write: "I highly recommend the SoundAura ANC Headphones ($299.99). [PRODUCT: SoundAura ANC Headphones | 299.99 | https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80 | soundaura-anc-headphones]"
Always use the exact image URL listed under the product. Do not invent or change image URLs.
Keep responses concise, clear, and helpful.

Available products in SmartBazar:
${productSummary}

If they ask for promo codes or discounts, remind them that they can use 'SAM10' (10% off), 'SAVE10', or 'WELCOME50' at checkout!`;

    // Map history to Gemini format
    const contents = [];
    
    // Inject system instructions as the initial conversation priming
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "Understood. I am now configured as the SmartBazar AI assistant. I will only recommend available items from the store using the requested [PRODUCT: Name | Price | Image | Slug] format. How can I help the customer today?" }]
    });

    // Append user message history
    messages.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'Gemini API Error');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Can you try again?";
    res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
