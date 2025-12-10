// ===================================
// FLOATING CHATBOT WITH GEMINI API
// Visconti's Italian Restaurant
// ===================================

class RestaurantChatbot {
    constructor() {
        this.apiKey = 'AIzaSyCJTqJo2VTzFl3WJXaS7nrYF3OydNrNVCg';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
        this.messageHistory = [];
        this.isOpen = false;
        this.useAPI = true; // Flag to control API usage
        
        this.init();
    }
    
    init() {
        this.createChatElements();
        this.attachEventListeners();
        this.sendBotMessage("Welcome to Visconti's Italian Restaurant! 🍝 I'm here to help you with reservations, menu information, hours, and more. How can I assist you today?");
    }
    
    createChatElements() {
        // Chat button
        const chatButton = document.createElement('button');
        chatButton.className = 'chat-button';
        chatButton.id = 'chatButton';
        chatButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
            </svg>
        `;
        
        // Chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.id = 'chatContainer';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-content">
                    <div class="chat-avatar">
                        <img src="images/logo.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="chat-header-text">
                        <h3>Visconti's Assistant</h3>
                        <p>Online • Ready to help</p>
                    </div>
                </div>
                <button class="chat-close" id="chatClose">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="typing-indicator" id="typingIndicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="chat-suggestions" id="chatSuggestions">
                <button class="suggestion-chip" data-message="What's on your menu?">🍕 Menu highlights</button>
                <button class="suggestion-chip" data-message="What are your opening hours?">🕐 Opening hours</button>
                <button class="suggestion-chip" data-message="How do I make a reservation?">📅 Reservations</button>
                <button class="suggestion-chip" data-message="Tell me about your wine selection">🍷 Wine selection</button>
            </div>
            <div class="chat-input-area">
                <button class="chat-clear" id="clearChatBtn" title="Clear chat">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <input 
                    type="text" 
                    class="chat-input" 
                    id="chatInput" 
                    placeholder="Type a question..."
                    autocomplete="off"
                />
                <button class="chat-send" id="chatSend">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(chatButton);
        document.body.appendChild(chatContainer);
    }
    
    attachEventListeners() {
        const chatButton = document.getElementById('chatButton');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const clearChatBtn = document.getElementById('clearChatBtn');
        
        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.toggleChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        clearChatBtn.addEventListener('click', () => this.clearChat());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Suggestion chips
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const message = chip.getAttribute('data-message');
                this.sendSuggestionMessage(message);
            });
        });
    }
    
    toggleChat() {
        const chatContainer = document.getElementById('chatContainer');
        this.isOpen = !this.isOpen;
        chatContainer.classList.toggle('active');
        
        if (this.isOpen) {
            document.getElementById('chatInput').focus();
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Display user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Process response
        this.processMessage(message);
    }
    
    sendSuggestionMessage(message) {
        // Display user message
        this.addMessage(message, 'user');
        
        // Process response
        this.processMessage(message);
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingIndicator = document.getElementById('typingIndicator');
        
        // Remove all messages except typing indicator
        while (messagesContainer.firstChild && messagesContainer.firstChild !== typingIndicator) {
            messagesContainer.removeChild(messagesContainer.firstChild);
        }
        
        // Reset message history
        this.messageHistory = [];
        
        // Send welcome message again
        this.sendBotMessage("Welcome to Visconti's Italian Restaurant! 🍝 I'm here to help you with reservations, menu information, hours, and more. How can I assist you today?");
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const typingIndicator = document.getElementById('typingIndicator');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'bot' ? '🍝' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${this.formatMessage(text)}</div>
        `;
        
        messagesContainer.insertBefore(messageDiv, typingIndicator);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Convert markdown to HTML for clean display
        let formatted = text;
        
        // Convert **bold** to <strong>bold</strong>
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em>italic</em>
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Convert line breaks to <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Convert bullet points (- item or * item) to proper list items
        formatted = formatted.replace(/^[\-\*]\s+(.+)$/gm, '• $1');
        
        return formatted;
    }
    
    async processMessage(message) {
        // Try Gemini API first, fallback to predefined responses if it fails
        if (this.useAPI) {
            await this.getGeminiResponse(message);
        } else {
            this.getFallbackResponse(message);
        }
    }
    
    getFallbackResponse(message) {
        this.showTypingIndicator();
        
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // Reservation queries
        if (lowerMessage.includes('reserv') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
            response = "🍽️ We'd love to have you! For reservations:\n\n📞 Call us at 509-548-1213 (Leavenworth)\n👥 For parties of 7+, please call directly\n📅 You can also use our online reservation form on this page\n\nWe recommend booking ahead for groups of 4 or more!";
        }
        // Hours queries
        else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close') || lowerMessage.includes('time')) {
            response = "🕐 Our Hours:\n\n🍝 Leavenworth Location:\n• Lunch: 11:30 AM - 2:30 PM (Mon-Fri)\n• Dinner: 5:00 PM - 10:00 PM (Daily)\n\n📍 We're located at 636 Front St, Leavenworth, WA 98826";
        }
        // Menu queries
        else if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish') || lowerMessage.includes('pizza')) {
            response = "🍕 Our Menu Highlights:\n\n• Wood-Fired Pizzas 🔥\n• Authentic Italian Classics 🍝\n• Fresh Pasta & Risotto\n• Seafood & Meat Dishes\n• Premium Wine Selection 🍷\n\nAll dishes follow 'Old World' cooking traditions with fresh, local ingredients!";
        }
        // Wine queries
        else if (lowerMessage.includes('wine') || lowerMessage.includes('drink') || lowerMessage.includes('beverage')) {
            response = "🍷 We offer a broad and carefully curated selection of premium wines to complement your Italian dining experience. Our wine list features both Italian and international selections. Ask your server for recommendations!";
        }
        // Location queries
        else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
            response = "📍 Our Locations:\n\n🏔️ Leavenworth:\n636 Front St, Leavenworth, WA 98826\n☎️ 509-548-1213\n\n🌆 Wenatchee:\nReservations via OpenTable\n\nEmail: info@viscontis.com";
        }
        // Contact queries
        else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
            response = "📞 Contact Us:\n\n☎️ Phone: 509-548-1213\n📧 Email: info@viscontis.com\n👔 CEO: dancarr@viscontis.com\n\nWe're here to help!";
        }
        // Greeting
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! 👋 Welcome to Visconti's Italian Restaurant! How can I assist you today? Feel free to ask about our menu, hours, reservations, or anything else!";
        }
        // Default response
        else {
            response = "I'm here to help! 😊 You can ask me about:\n\n🍕 Our menu and specialties\n🕐 Opening hours\n📅 Making reservations\n🍷 Wine selection\n📍 Locations and contact info\n\nWhat would you like to know?";
        }
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.sendBotMessage(response);
        }, 800);
    }
    
    async getGeminiResponse(userMessage) {
        this.showTypingIndicator();
        
        try {
            const context = `You are a friendly and intelligent AI assistant for Visconti's Italian Restaurant. You should be conversational, warm, and helpful.

IMPORTANT INSTRUCTIONS:
- Answer ALL questions naturally and conversationally, not just restaurant-related ones
- For casual questions (like "how are you", "what's up", etc.), respond warmly and then gently guide the conversation back to how you can help with the restaurant
- For restaurant questions, provide accurate, helpful information
- Keep responses concise (under 100 words) but informative
- Use emojis occasionally to add warmth, but don't overdo it
- Be professional yet friendly
- If you don't know something specific, be honest and suggest they contact the restaurant directly

RESTAURANT INFORMATION:
📍 Locations:
   - Leavenworth: 636 Front St, Leavenworth, WA 98826
   - Wenatchee: Available (reservations via OpenTable)

📞 Contact:
   - Phone: 509-548-1213 (Leavenworth)
   - Email: info@viscontis.com
   - CEO: dancarr@viscontis.com

🕐 Hours (Leavenworth):
   - Lunch: 11:30 AM - 2:30 PM (Monday-Friday)
   - Dinner: 5:00 PM - 10:00 PM (Daily)

🍝 Menu Highlights:
   - Authentic Italian cuisine with "Old World" cooking traditions
   - Wood-fired pizzas
   - Fresh pasta, risotto, seafood, and meat dishes
   - Premium wine selection (Italian and international)
   - Gluten-free pasta options available
   - Can add grilled chicken, shrimp, Italian sausage, or top sirloin to dishes

📅 Reservations:
   - Recommended for groups of 4 or more
   - Required for parties of 7+ (must call directly)
   - Online reservation form available on website

🎉 Services:
   - Catering
   - Private dining
   - Special events

User's question: ${userMessage}

Respond naturally and helpfully:`;
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: context
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 250,
                        topP: 0.95,
                    }
                })
            });

            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;
            
            this.hideTypingIndicator();
            this.sendBotMessage(botResponse);
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            // Switch to fallback mode
            this.useAPI = false;
            this.hideTypingIndicator();
            // Use fallback response instead
            this.getFallbackResponse(userMessage);
        }
    }
    
    sendBotMessage(message) {
        this.addMessage(message, 'bot');
    }
    
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.add('active');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.remove('active');
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RestaurantChatbot();
    });
} else {
    new RestaurantChatbot();
}
