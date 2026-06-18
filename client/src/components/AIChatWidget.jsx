import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader } from 'lucide-react';
import api from '../services/api.js';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your SmartBazar AI assistant. Ask me anything about our Electronics, Fashion, Home & Living, or Beauty products. I can also help you with discount codes!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chat', {
        messages: [...messages, userMessage]
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse product tokens and render custom cards with images
  const renderMessageContent = (text) => {
    const regex = /\[PRODUCT:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-line leading-relaxed">
            {text.substring(lastIndex, match.index)}
          </p>
        );
      }

      const [_, name, price, imageUrl, slug] = match;
      parts.push(
        <div key={`prod-${match.index}`} className="my-3 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all shadow-md group max-w-[280px] sm:max-w-xs">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'}
            alt={name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          />
          <div className="p-3 text-left space-y-1.5">
            <h5 className="font-bold text-xs text-white line-clamp-2">{name}</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-400">${price}</span>
              <a
                href={`/products/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/products/${slug}`;
                }}
                className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-line leading-relaxed">
          {text.substring(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-line leading-relaxed">{text}</p>;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-slate-955/80 border border-slate-800/80 backdrop-blur-xl w-80 sm:w-96 h-[480px] rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 p-4 flex items-center justify-between border-b border-indigo-500/20 text-white">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/15 p-2 rounded-xl">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="font-display font-bold text-sm leading-tight">SmartBazar AI</h4>
                  <span className="text-[10px] text-indigo-200 font-semibold tracking-wider uppercase">Active Helper</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-left ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    ) : (
                      renderMessageContent(msg.text)
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 text-xs flex items-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Typing response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-900/60 bg-slate-950/40 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SmartBazar AI..."
                className="flex-grow bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/35 transition-all placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all flex items-center justify-center active:scale-95 disabled:active:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center focus:outline-none relative group border border-indigo-500/20"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      </motion.button>
    </div>
  );
};

export default AIChatWidget;
