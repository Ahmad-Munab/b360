// Dynamically determine the API base URL
const API_BASE = "https://b360-one.vercel.app";

// Modern Support Widget
class ModernSupportWidget {
  constructor(config) {

    this.config = {
      widgetId: config.widgetId,
      position: config.position || 'bottom-right',
      primaryColor: config.primaryColor || '#6366F1',
      productName: config.productName || 'B360',
      description: config.description || '',
      widgetTitle: config.widgetTitle || 'Chat with us',
      welcomeMessage: config.welcomeMessage || 'Hi! How can I help you today?',
      isActive: config.isActive,
      ...config
    };


    this.isOpen = false;
    this.messages = [];

    if (this.config.isActive) {
      this.init().catch(error => {
        console.error('Widget initialization failed:', error);
        // Fallback to basic initialization
        this.createStyles();
        this.createWidget();
        this.attachEventListeners();
      });
    } else {
    }
  }

  async init() {

    // Load widget config from server if widgetId is provided
    if (this.config.widgetId) {
      await this.loadWidgetConfig();
    }

    // Create styles after config is loaded so they use the correct values
    this.createStyles();

    this.createWidget();

    this.attachEventListeners();

    // Update widget appearance after everything is created
    this.updateWidgetAppearance();

  }

  createStyles() {
    // Remove existing styles if any
    const existingStyle = document.getElementById('modern-support-widget-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'modern-support-widget-styles';
    style.textContent = `
      .modern-support-widget {
        position: fixed;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      .modern-support-widget.bottom-right { bottom: 20px; right: 20px; }
      .modern-support-widget.bottom-left { bottom: 20px; left: 20px; }
      .modern-support-widget.top-right { top: 20px; right: 20px; }
      .modern-support-widget.top-left { top: 20px; left: 20px; }
      
      .widget-trigger-btn {
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 64px;
        height: 64px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .widget-trigger-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.primaryColor}dd);
      }
      
      .widget-popup {
        position: absolute;
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 80px rgba(0,0,0,0.15);
        overflow: hidden;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(0,0,0,0.05);
      }
      
      .widget-popup.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
      }
      
      .widget-popup.bottom-right, .widget-popup.bottom-left { bottom: 80px; }
      .widget-popup.top-right, .widget-popup.top-left { top: 80px; }
      .widget-popup.bottom-right, .widget-popup.top-right { right: 0; }
      .widget-popup.bottom-left, .widget-popup.top-left { left: 0; }
      
      .widget-header {
        background: ${this.config.primaryColor};
        color: white;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 80px;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .header-text {
        flex: 1;
      }

      .close-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      .widget-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
      }
      
      .widget-header p {
        margin: 4px 0 0 0;
        font-size: 14px;
        opacity: 0.9;
        line-height: 1.3;
      }
      
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        background: #f8fafc;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .welcome-screen {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .welcome-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        color: white;
      }

      .welcome-text h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
      }

      .welcome-text p {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
      }
      
      .message {
        display: flex;
        margin-bottom: 16px;
      }

      .message.user {
        justify-content: flex-end;
      }

      .message.assistant {
        justify-content: flex-start;
      }

      .message-content {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }

      .message.user .message-content {
        background: ${this.config.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .message.assistant .message-content {
        background: white;
        color: #1f2937;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      }

      .message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
        text-align: right;
      }

      .message.assistant .message-time {
        text-align: left;
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        max-width: 85%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }

      .typing-dots {
        display: flex;
        gap: 4px;
      }

      .typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #9ca3af;
        animation: typing 1.4s infinite ease-in-out;
      }

      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typing {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
      
      .widget-view {
        display: none;
      }
      
      .widget-view.active {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      
      .chat-input-area {
        padding: 16px 20px;
        background: white;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        align-items: flex-end;
      }

      .chat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 24px;
        padding: 12px 16px;
        font-size: 14px;
        resize: none;
        outline: none;
        transition: border-color 0.2s;
        font-family: inherit;
        line-height: 1.4;
      }

      .chat-input:focus {
        border-color: ${this.config.primaryColor};
        box-shadow: 0 0 0 3px ${this.config.primaryColor}20;
      }

      .send-button {
        background: ${this.config.primaryColor};
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .send-button:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
    `;

    document.head.appendChild(style);


      
      @media (max-width: 480px) {
        .widget-popup {
          width: calc(100vw - 40px);
          max-width: 320px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createWidget() {
    // Create widget container
    this.container = document.createElement('div');
    this.container.className = `modern-support-widget ${this.config.position}`;

    // Create trigger button
    this.button = document.createElement('button');
    this.button.className = 'widget-trigger-btn';
    this.button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `;

    // Create popup
    this.popup = document.createElement('div');
    this.popup.className = `widget-popup ${this.config.position}`;

    this.createChatView();

    this.container.appendChild(this.button);
    this.container.appendChild(this.popup);

    document.body.appendChild(this.container);
  }



  createChatView() {
    this.chatView = document.createElement('div');
    this.chatView.className = 'widget-view widget-chat-view active';

    // Header
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
      <div class="header-content">
        <div class="avatar">
          ${this.config.productName.charAt(0).toUpperCase()}
        </div>
        <div class="header-text">
          <h3>${this.config.productName}</h3>
          <p>${this.config.widgetTitle}</p>
        </div>
      </div>
      <button class="close-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;
    header.querySelector('.close-btn').addEventListener('click', () => this.close());

    // Messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'chat-messages';

    // Add welcome message
    this.showWelcomeMessage();

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'chat-input-area';

    this.chatInput = document.createElement('input');
    this.chatInput.className = 'chat-input';
    this.chatInput.type = 'text';
    this.chatInput.placeholder = 'Type your message...';
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.sendButton = document.createElement('button');
    this.sendButton.className = 'send-button';
    this.sendButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
      </svg>
    `;
    this.sendButton.addEventListener('click', () => this.sendMessage());

    inputContainer.appendChild(this.chatInput);
    inputContainer.appendChild(this.sendButton);

    this.chatView.appendChild(header);
    this.chatView.appendChild(this.messagesContainer);
    this.chatView.appendChild(inputContainer);
    this.popup.appendChild(this.chatView);
  }

  showWelcomeMessage() {
    if (this.messages.length === 0) {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'welcome-screen';
      welcomeDiv.innerHTML = `
        <div>
          <div class="welcome-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="welcome-text">
            <h4>${this.config.welcomeMessage}</h4>
            <p>Ask me anything about ${this.config.productName}</p>
          </div>
        </div>
      `;
      this.messagesContainer.appendChild(welcomeDiv);
    }
  }

  attachEventListeners() {
    this.button.addEventListener('click', () => this.toggle());

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.popup.style.display = 'flex';
    setTimeout(() => {
      this.popup.classList.add('open');
    }, 10);
  }

  close() {
    this.isOpen = false;
    this.popup.classList.remove('open');
    setTimeout(() => {
      this.popup.style.display = 'none';
    }, 300);
  }



  addMessage(type, content) {
    // Remove welcome message if it exists
    const welcomeScreen = this.messagesContainer.querySelector('.welcome-screen');
    if (welcomeScreen) {
      welcomeScreen.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    this.messages.push({ type, content, timestamp: Date.now() });
  }

  showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <span style="font-size: 12px; color: #6b7280;">Typing...</span>
    `;

    messageDiv.appendChild(indicator);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return messageDiv;
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    this.chatInput.value = '';
    this.sendButton.disabled = true;

    // Show typing indicator
    const typingIndicator = this.showTypingIndicator();

    try {
      // Call the actual API
      const response = await this.sendChatMessage(message);

      // Remove typing indicator
      if (this.messagesContainer.contains(typingIndicator)) {
        this.messagesContainer.removeChild(typingIndicator);
      }

      // Add bot response
      this.addMessage('assistant', response);

    } catch (error) {
      console.error('Chat error:', error);
      if (this.messagesContainer.contains(typingIndicator)) {
        this.messagesContainer.removeChild(typingIndicator);
      }
      this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.sendButton.disabled = false;
    }
  }

  async sendChatMessage(message) {
    try {
      // Use relative URL to work with any domain
      const apiUrl = `${API_BASE}/api/widgets/${this.config.widgetId}/chat`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.response || 'Thank you for your message. We\'ll get back to you soon!';
    } catch (error) {
      console.error('Chat error:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  }
}

// Make class available globally
window.ModernSupportWidget = ModernSupportWidget;

// Auto-initialize from script tag data attributes
function autoInitialize() {
  // Look for script tag with data-widget-id
  const scripts = document.querySelectorAll('script[data-widget-id]');

  scripts.forEach(script => {
    const config = {
      widgetId: script.getAttribute('data-widget-id'),
      position: script.getAttribute('data-position') || 'bottom-right',
      primaryColor: script.getAttribute('data-primary-color') || '#6366F1',
      productName: script.getAttribute('data-product-name') || 'B360',
      description: script.getAttribute('data-description') || '',
      widgetTitle: script.getAttribute('data-widget-title') || 'Chat with us',
      welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
      isActive: script.getAttribute('data-is-active') !== 'false',
    };

    if (config.widgetId && config.isActive) {
      new ModernSupportWidget(config);
    }
  });
}

// Make class available globally
window.ModernSupportWidget = ModernSupportWidget;

// Auto-initialize widget
(function() {
  if (typeof window === 'undefined') return;

  // Auto-initialize from script tag data attributes
  function autoInitialize() {
    // Look for script tag with data-widget-id
    const scripts = document.querySelectorAll('script[data-widget-id]');

    scripts.forEach(script => {
      const config = {
        widgetId: script.getAttribute('data-widget-id'),
        position: script.getAttribute('data-position') || 'bottom-right',
        primaryColor: script.getAttribute('data-primary-color') || '#6366F1',
        productName: script.getAttribute('data-product-name') || 'B360',
        description: script.getAttribute('data-description') || '',
        widgetTitle: script.getAttribute('data-widget-title') || 'Chat with us',
        welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
        isActive: script.getAttribute('data-is-active') !== 'false',
      };

      if (config.widgetId && config.isActive) {
        new ModernSupportWidget(config);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitialize);
  } else {
    autoInitialize();
  }
})();