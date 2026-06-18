import Product from '../models/Product.js';

export const handleChat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Please provide message history' });
    }

    // 1. Fetch active products to ground the AI with real store details
    const products = await Product.find({ isActive: true }).select('name price brand slug').populate('category', 'name');
    
    // Format product lists for prompt injection
    const productSummary = products.map(p => 
      `- Name: ${p.name}, Price: $${p.price}, Category: ${p.category?.name || 'Uncategorized'}, Brand: ${p.brand}, Link: /products/slug/${p.slug}`
    ).join('\n');

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      console.warn('GEMINI_API_KEY not configured. Falling back to rule-based auto-helper.');
      const userText = messages[messages.length - 1]?.text || '';
      const matched = products.filter(p => p.name.toLowerCase().includes(userText.toLowerCase()) || p.brand.toLowerCase().includes(userText.toLowerCase())).slice(0, 3);
      
      let reply = "I'm SmartBazar's virtual assistant! To unlock my advanced AI features, please ask the admin to configure GEMINI_API_KEY in the environment.";
      if (matched.length > 0) {
        reply += `\n\nBased on your query, here are some products you might like:\n` + matched.map(p => `* **${p.name}** ($${p.price})`).join('\n');
      } else {
        reply += `\n\nHow can I help you today? You can ask me about our Electronics, Fashion, Home, or Beauty products. (Try checking out our 'SAM10' coupon code for a 10% discount!)`;
      }
      return res.status(200).json({ success: true, reply });
    }

    // Prepare system instructions for e-commerce grounding
    const systemPrompt = `You are "SmartBazar Assistant", a helpful, friendly AI shopping assistant.
Your goal is to guide customers and recommend products from the list below.
You must only recommend products that exist in the catalog.
Always include the product price and direct the user to their catalog links if they are interested.
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
      parts: [{ text: "Understood. I am now configured as the SmartBazar AI assistant. I will only recommend available items from the store. How can I help the customer today?" }]
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
