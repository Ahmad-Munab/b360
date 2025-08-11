// Dynamically determine the API base URL
const API_BASE = "http://localhost:3000";

// Modern Support Widget
class ModernSupportWidget {
  constructor(config) {

    this.config = {
      widgetId: config.widgetId,
      position: config.position,
      primaryColor: config.primaryColor,
      productType: config.productType,
      productName: config.productName,
      features: config.features,
      description: config.description,
      faqs: config.faqs,
      widgetTitle: config.widgetTitle,
      welcomeMessage: config.welcomeMessage,

      isActive: config.isActive,
      ...config
    };


    this.isOpen = false;
    this.currentView = 'main'; // main, chat
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
        border-radius: 25px;
        padding: 12px 16px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .widget-trigger-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      }
      
      .widget-popup {
        position: absolute;
        width: 320px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        overflow: hidden;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        max-height: 500px;
        display: flex;
        flex-direction: column;
      }
      
      .widget-popup.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
      }
      
      .widget-popup.bottom-right, .widget-popup.bottom-left { bottom: 70px; }
      .widget-popup.top-right, .widget-popup.top-left { top: 70px; }
      .widget-popup.bottom-right, .widget-popup.top-right { right: 0; }
      .widget-popup.bottom-left, .widget-popup.top-left { left: 0; }
      
      .widget-header {
        background: ${this.config.primaryColor};
        color: white;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 80px;
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
      
      .back-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 4px;
      }
      
      .back-btn:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .widget-options {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .widget-option {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .widget-option:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        transform: translateY(-1px);
      }
      
      .option-icon {
        padding: 10px;
        border-radius: 10px;
        background: ${this.config.primaryColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
      }
      
      .option-content {
        flex: 1;
      }
      
      .option-title {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
        margin: 0 0 4px 0;
      }
      
      .option-desc {
        font-size: 12px;
        color: #64748b;
        margin: 0;
        line-height: 1.3;
      }
      
      .widget-view {
        display: none;
      }
      
      .widget-view.active {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      
      .widget-chat {
        display: flex;
        flex-direction: column;
        height: 400px;
      }
      
      .chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #fafbfc;
      }
      
      .chat-message {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .chat-message.user {
        background: ${this.config.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      
      .chat-message.bot {
        background: white;
        color: #374151;
        align-self: flex-start;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      }
      
      .chat-input-container {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        background: white;
        display: flex;
        gap: 12px;
        align-items: end;
      }
      
      .chat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 14px;
        outline: none;
        resize: none;
        min-height: 20px;
        max-height: 100px;
        font-family: inherit;
        transition: border-color 0.2s;
      }
      
      .chat-input:focus {
        border-color: ${this.config.primaryColor};
        box-shadow: 0 0 0 3px ${this.config.primaryColor}20;
      }
      
      .chat-send-btn {
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      
      .chat-send-btn:hover {
        background: ${this.config.primaryColor}dd;
        transform: scale(1.05);
      }
      
      .chat-send-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }
      
      .widget-form {
        padding: 24px;
        background: white;
      }
      
      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }
      
      .form-textarea {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 14px;
        resize: vertical;
        min-height: 100px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }
      
      .form-textarea:focus {
        outline: none;
        border-color: ${this.config.primaryColor};
        box-shadow: 0 0 0 3px ${this.config.primaryColor}20;
      }
      
      .form-submit-btn {
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        border-radius: 12px;
        padding: 14px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 16px;
        width: 100%;
        transition: all 0.2s;
      }
      
      .form-submit-btn:hover {
        background: ${this.config.primaryColor}dd;
        transform: translateY(-1px);
      }
      
      .form-submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }
      
      .success-message {
        text-align: center;
        padding: 40px 24px;
      }
      
      .success-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .success-title {
        font-size: 18px;
        font-weight: 600;
        color: #059669;
        margin: 0 0 8px 0;
      }
      
      .success-desc {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        max-width: 85%;
        align-self: flex-start;
      }
      
      .typing-dot {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }
      
      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes typing {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
      
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>${this.config.widgetTitle}</span>
    `;

    // Create popup
    this.popup = document.createElement('div');
    this.popup.className = `widget-popup ${this.config.position}`;

    this.createMainView();
    this.createChatView();
    this.createFormViews();

    this.container.appendChild(this.button);
    this.container.appendChild(this.popup);

    document.body.appendChild(this.container);

  }

  createMainView() {
    this.mainView = document.createElement('div');
    this.mainView.className = 'widget-view widget-main-view active';

    // Header
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
      <div>
        <h3>${this.config.productName}</h3>
        <p>${this.config.welcomeMessage}</p>
      </div>
    `;

    // Options
    const options = document.createElement('div');
    options.className = 'widget-options';

    const availableOptions = this.getAvailableOptions();
    availableOptions.forEach(option => {
      const button = document.createElement('button');
      button.className = 'widget-option';
      button.innerHTML = `
        <div class="option-icon">
          ${option.icon}
        </div>
        <div class="option-content">
          <div class="option-title">${option.title}</div>
          <div class="option-desc">${option.desc}</div>
        </div>
      `;
      button.addEventListener('click', () => this.showView(option.action));
      options.appendChild(button);
    });

    this.mainView.appendChild(header);
    this.mainView.appendChild(options);
    this.popup.appendChild(this.mainView);
  }

  createChatView() {
    this.chatView = document.createElement('div');
    this.chatView.className = 'widget-view widget-chat-view';

    // Header with back button
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
      <button class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <div>
        <h3>Chat with Agent</h3>
        <p>We're here to help you!</p>
      </div>
    `;
    header.querySelector('.back-btn').addEventListener('click', () => this.showView('main'));

    // Chat container
    const chat = document.createElement('div');
    chat.className = 'widget-chat';

    // Messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'chat-messages';

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'chat-input-container';

    this.chatInput = document.createElement('textarea');
    this.chatInput.className = 'chat-input';
    this.chatInput.placeholder = 'Type your message...';
    this.chatInput.rows = 1;
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.chatInput.addEventListener('input', this.autoResizeTextarea);

    this.sendButton = document.createElement('button');
    this.sendButton.className = 'chat-send-btn';
    this.sendButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
      </svg>
    `;
    this.sendButton.addEventListener('click', () => this.sendMessage());

    inputContainer.appendChild(this.chatInput);
    inputContainer.appendChild(this.sendButton);

    chat.appendChild(this.messagesContainer);
    chat.appendChild(inputContainer);

    this.chatView.appendChild(header);
    this.chatView.appendChild(chat);
    this.popup.appendChild(this.chatView);

    // Add initial bot message
    this.addMessage('bot', this.config.welcomeMessage);
  }

  createFormViews() {
    // Feedback and bug report functionality removed
    // Only message functionality is supported
  }

  getAvailableOptions() {
    const options = [];

    // Always show chat option
    options.push({
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
             </svg>`,
      title: 'Talk to Agent',
      desc: 'Start a conversation with our AI assistant',
      action: 'chat'
    });

    return options;
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
      this.showView('main'); // Reset to main view
    }, 300);
  }

  showView(viewName) {
    // Hide all views
    this.popup.querySelectorAll('.widget-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    const targetView = this.popup.querySelector(`.widget-${viewName}-view`);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewName;
      
      // Focus input if chat view
      if (viewName === 'chat' && this.chatInput) {
        setTimeout(() => this.chatInput.focus(), 100);
      }
    }
  }

  addMessage(type, content) {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = content;
    this.messagesContainer.appendChild(message);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    this.messages.push({ type, content, timestamp: Date.now() });
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return indicator;
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    this.chatInput.value = '';
    this.autoResizeTextarea.call(this.chatInput);
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
      this.addMessage('bot', response);

    } catch (error) {
      console.error('Chat error:', error);
      if (this.messagesContainer.contains(typingIndicator)) {
        this.messagesContainer.removeChild(typingIndicator);
      }
      this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.sendButton.disabled = false;
    }
  }



  autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  }

  async loadWidgetConfig() {
    try {
      // Use relative URL to work with any domain
      const apiUrl = `${API_BASE}/api/widgets/${this.config.widgetId}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        // Update config with server data
        Object.assign(this.config, data.widget);
      } else {
        console.warn('ModernSupportWidget: Failed to load config from server, using default config');
      }
    } catch (error) {
      console.error('ModernSupportWidget: Failed to load widget config:', error);
    }
  }

  updateWidgetAppearance() {
    // Update button text
    if (this.button) {
      const span = this.button.querySelector('span');
      if (span) {
        span.textContent = this.config.widgetTitle;
      }
    }

    // Update header content
    const headers = this.popup.querySelectorAll('.widget-header h3');
    headers.forEach(header => {
      if (header.textContent === 'Chat with Agent') return;
      header.textContent = this.config.productName;
    });

    const welcomeMessages = this.popup.querySelectorAll('.widget-header p');
    welcomeMessages.forEach(p => {
      if (p.textContent.includes('We\'re here to help you!')) return;
      p.textContent = this.config.welcomeMessage;
    });
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

// Auto-initialize widget
(function() {
  if (typeof window === 'undefined') return;

  // Make class available globally
  window.ModernSupportWidget = ModernSupportWidget;

  // Auto-initialize from script tag data attributes
  function autoInitialize() {

    // Look for script tag with data-widget-id
    const scripts = document.querySelectorAll('script[data-widget-id]');

    scripts.forEach(script => {
      const widgetId = script.getAttribute('data-widget-id');
      if (widgetId) {
        // Only show widget if status API returns isActive true and 2xx
        fetch(`${API_BASE}/api/widgets/${widgetId}/status`)
          .then(response => {
            if (!response.ok) {
              return null;
            }
            return response.json();
          })
          .then(data => {
            if (data && data.isActive) {
              const config = {
                widgetId: widgetId,
                position: script.getAttribute('data-position'),
                primaryColor: script.getAttribute('data-primary-color'),
                productType: script.getAttribute('data-product-type'),
                productName: script.getAttribute('data-product-name'),
                widgetTitle: script.getAttribute('data-widget-title'),
                welcomeMessage: script.getAttribute('data-welcome-message'),
                isActive: data.isActive
              };
              new ModernSupportWidget(config);
            } else {
            }
          })
          .catch(error => {
            console.error('ModernSupportWidget: Error checking widget status:', error);
            // Do NOT show widget if status API fails
          });
      }
    });

    // Also check for global config
    if (window.ModernSupportWidgetConfig) {
      new ModernSupportWidget(window.ModernSupportWidgetConfig);
    }

    if (scripts.length === 0 && !window.ModernSupportWidgetConfig) {
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitialize);
  } else {
    autoInitialize();
  }
})();