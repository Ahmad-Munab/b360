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
      /* CSS Reset and Isolation for Widget */
      .modern-support-widget, .modern-support-widget * {
        all: unset;
        box-sizing: border-box;
      }

      .modern-support-widget {
        position: fixed !important;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;
        text-align: left !important;
        direction: ltr !important;
      }

      .modern-support-widget.bottom-right { bottom: 24px !important; right: 24px !important; }
      .modern-support-widget.bottom-left { bottom: 24px !important; left: 24px !important; }
      .modern-support-widget.top-right { top: 24px !important; right: 24px !important; }
      .modern-support-widget.top-left { top: 24px !important; left: 24px !important; }

      .widget-trigger-btn {
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 28px !important;
        padding: 14px 20px !important;
        cursor: pointer !important;
        box-shadow: 0 6px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        border: 2px solid rgba(255,255,255,0.2) !important;
        min-height: 56px !important;
        white-space: nowrap !important;
        text-decoration: none !important;
        outline: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }

      .widget-trigger-btn:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15) !important;
        filter: brightness(1.05) !important;
      }

      .widget-trigger-btn:active {
        transform: translateY(-1px) !important;
        transition: all 0.1s !important;
      }

      .widget-popup {
        position: absolute !important;
        width: 360px !important;
        background: #ffffff !important;
        border-radius: 20px !important;
        box-shadow: 0 25px 80px rgba(0,0,0,0.15), 0 10px 40px rgba(0,0,0,0.1) !important;
        overflow: hidden !important;
        transform: translateY(24px) scale(0.94) !important;
        opacity: 0 !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        pointer-events: none !important;
        max-height: 520px !important;
        display: flex !important;
        flex-direction: column !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
      }

      .widget-popup.open {
        transform: translateY(0) scale(1) !important;
        opacity: 1 !important;
        pointer-events: all !important;
      }

      .widget-popup.bottom-right, .widget-popup.bottom-left { bottom: 76px !important; }
      .widget-popup.top-right, .widget-popup.top-left { top: 76px !important; }
      .widget-popup.bottom-right, .widget-popup.top-right { right: 0 !important; }
      .widget-popup.bottom-left, .widget-popup.top-left { left: 0 !important; }

      .widget-header {
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        padding: 24px 28px !important;
        display: flex !important;
        align-items: center !important;
        gap: 16px !important;
        min-height: 88px !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .widget-header::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%) !important;
        pointer-events: none !important;
      }

      .widget-header h3 {
        margin: 0 !important;
        font-size: 20px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .widget-header p {
        margin: 6px 0 0 0 !important;
        font-size: 15px !important;
        opacity: 0.95 !important;
        line-height: 1.4 !important;
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .back-btn {
        background: none !important;
        border: none !important;
        color: #ffffff !important;
        cursor: pointer !important;
        padding: 10px !important;
        border-radius: 12px !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-right: 8px !important;
        position: relative !important;
        z-index: 2 !important;
        min-width: 40px !important;
        min-height: 40px !important;
      }

      .back-btn:hover {
        background: rgba(255,255,255,0.15) !important;
        transform: scale(1.05) !important;
      }

      .back-btn:active {
        transform: scale(0.95) !important;
      }

      .widget-options {
        padding: 28px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        background: #ffffff !important;
      }

      .widget-option {
        background: #f8fafc !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 16px !important;
        padding: 20px !important;
        cursor: pointer !important;
        text-align: left !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: flex !important;
        align-items: center !important;
        gap: 18px !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .widget-option::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%) !important;
        opacity: 0 !important;
        transition: opacity 0.3s !important;
        pointer-events: none !important;
      }

      .widget-option:hover {
        background: #f1f5f9 !important;
        border-color: ${this.config.primaryColor} !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
      }

      .widget-option:hover::before {
        opacity: 1 !important;
      }

      .option-icon {
        padding: 12px !important;
        border-radius: 14px !important;
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 48px !important;
        height: 48px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .option-icon svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: #ffffff !important;
        width: 20px !important;
        height: 20px !important;
      }

      .option-content {
        flex: 1 !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .option-title {
        font-weight: 700 !important;
        font-size: 16px !important;
        color: #1e293b !important;
        margin: 0 0 6px 0 !important;
        line-height: 1.3 !important;
      }

      .option-desc {
        font-size: 14px !important;
        color: #64748b !important;
        margin: 0 !important;
        line-height: 1.4 !important;
        font-weight: 500 !important;
      }

      .widget-view {
        display: none !important;
      }

      .widget-view.active {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 !important;
      }

      .widget-chat {
        display: flex !important;
        flex-direction: column !important;
        height: 420px !important;
        background: #ffffff !important;
      }

      .chat-messages {
        flex: 1 !important;
        padding: 24px !important;
        overflow-y: auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        background: #f8fafc !important;
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e1 #f1f5f9 !important;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px !important;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: #f1f5f9 !important;
        border-radius: 3px !important;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 3px !important;
      }

      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: #94a3b8 !important;
      }

      .chat-message {
        max-width: 80% !important;
        padding: 14px 18px !important;
        border-radius: 20px !important;
        font-size: 15px !important;
        line-height: 1.5 !important;
        word-wrap: break-word !important;
        font-weight: 500 !important;
        position: relative !important;
      }

      .chat-message.user {
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        align-self: flex-end !important;
        border-bottom-right-radius: 6px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
      }

      .chat-message.bot {
        background: #ffffff !important;
        color: #1f2937 !important;
        align-self: flex-start !important;
        border: 2px solid #e5e7eb !important;
        border-bottom-left-radius: 6px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
      }

      .chat-input-container {
        padding: 24px !important;
        border-top: 2px solid #e5e7eb !important;
        background: #ffffff !important;
        display: flex !important;
        gap: 16px !important;
        align-items: center !important;
      }

      .chat-input {
        flex: 1 !important;
        border: 2px solid #d1d5db !important;
        border-radius: 24px !important;
        padding: 14px 20px !important;
        font-size: 15px !important;
        outline: none !important;
        resize: none !important;
        min-height: 24px !important;
        max-height: 120px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: #ffffff !important;
        color: #1f2937 !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        overflow-y: auto !important;
        scrollbar-width: none !important; /* Firefox */
      }

      .chat-input::-webkit-scrollbar { width: 0 !important; height: 0 !important; }

      .chat-input::placeholder {
        color: #9ca3af !important;
        font-weight: 400 !important;
      }

      .chat-input:focus {
        border-color: ${this.config.primaryColor} !important;
        box-shadow: 0 0 0 4px ${this.config.primaryColor}20 !important;
        background: #ffffff !important;
      }

      .chat-send-btn {
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 50% !important;
        width: 52px !important;
        height: 52px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        flex-shrink: 0 !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .chat-send-btn::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%) !important;
        opacity: 0 !important;
        transition: opacity 0.3s !important;
      }

      .chat-send-btn:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        filter: brightness(1.05) !important;
      }

      .chat-send-btn:hover::before {
        opacity: 1 !important;
      }

      .chat-send-btn:active {
        transform: scale(0.95) !important;
        transition: all 0.1s !important;
      }

      .chat-send-btn:disabled {
        background: #9ca3af !important;
        cursor: not-allowed !important;
        transform: none !important;
        filter: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
      }

      .chat-send-btn:disabled::before {
        opacity: 0 !important;
      }

      .chat-send-btn svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: #ffffff !important;
        width: 20px !important;
        height: 20px !important;
        stroke-width: 2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
      }
      .chat-send-btn svg path {
        stroke-width: 2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
      }

      .widget-trigger-btn svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: #ffffff !important;
        width: 20px !important;
        height: 20px !important;
      }

      .back-btn svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: #ffffff !important;
        width: 20px !important;
        height: 20px !important;
      }

      .widget-form {
        padding: 28px !important;
        background: #ffffff !important;
      }

      .form-label {
        display: block !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        color: #1f2937 !important;
        margin-bottom: 12px !important;
        line-height: 1.3 !important;
      }

      .form-textarea {
        width: 100% !important;
        border: 2px solid #d1d5db !important;
        border-radius: 16px !important;
        padding: 16px 20px !important;
        font-size: 15px !important;
        resize: vertical !important;
        min-height: 120px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        box-sizing: border-box !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: #ffffff !important;
        color: #1f2937 !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
      }

      .form-textarea::placeholder {
        color: #9ca3af !important;
        font-weight: 400 !important;
      }

      .form-textarea:focus {
        outline: none !important;
        border-color: ${this.config.primaryColor} !important;
        box-shadow: 0 0 0 4px ${this.config.primaryColor}20 !important;
        background: #ffffff !important;
      }

      .form-submit-btn {
        background: ${this.config.primaryColor} !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 16px !important;
        padding: 18px 28px !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        margin-top: 20px !important;
        width: 100% !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        position: relative !important;
        overflow: hidden !important;
        min-height: 56px !important;
      }

      .form-submit-btn::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%) !important;
        opacity: 0 !important;
        transition: opacity 0.3s !important;
      }

      .form-submit-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        filter: brightness(1.05) !important;
      }

      .form-submit-btn:hover::before {
        opacity: 1 !important;
      }

      .form-submit-btn:active {
        transform: translateY(0) !important;
        transition: all 0.1s !important;
      }

      .form-submit-btn:disabled {
        background: #9ca3af !important;
        cursor: not-allowed !important;
        transform: none !important;
        filter: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
      }

      .form-submit-btn:disabled::before {
        opacity: 0 !important;
      }

      .success-message {
        text-align: center !important;
        padding: 48px 28px !important;
        background: #ffffff !important;
      }

      .success-icon {
        font-size: 64px !important;
        margin-bottom: 20px !important;
        color: #10b981 !important;
      }

      .success-title {
        font-size: 20px !important;
        font-weight: 700 !important;
        color: #059669 !important;
        margin: 0 0 12px 0 !important;
        line-height: 1.3 !important;
      }

      .success-desc {
        font-size: 16px !important;
        color: #6b7280 !important;
        margin: 0 !important;
        line-height: 1.4 !important;
        font-weight: 500 !important;
      }

      .typing-indicator {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 14px 18px !important;
        background: #ffffff !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 20px !important;
        border-bottom-left-radius: 6px !important;
        max-width: 80% !important;
        align-self: flex-start !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
      }

      .typing-dot {
        width: 10px !important;
        height: 10px !important;
        background: #9ca3af !important;
        border-radius: 50% !important;
        animation: typing 1.6s infinite ease-in-out !important;
      }

      .typing-dot:nth-child(1) { animation-delay: -0.32s !important; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s !important; }
      .typing-dot:nth-child(3) { animation-delay: 0s !important; }

      @keyframes typing {
        0%, 80%, 100% {
          transform: scale(0.7) !important;
          opacity: 0.4 !important;
        }
        40% {
          transform: scale(1.1) !important;
          opacity: 1 !important;
        }
      }

      @media (max-width: 480px) {
        .modern-support-widget.bottom-right,
        .modern-support-widget.bottom-left {
          bottom: 16px !important;
        }
        .modern-support-widget.bottom-right,
        .modern-support-widget.bottom-left {
          right: 16px !important;
          left: 16px !important;
        }

        .widget-popup {
          width: calc(100vw - 32px) !important;
          max-width: 360px !important;
        }

        .widget-trigger-btn {
          padding: 12px 16px !important;
          font-size: 14px !important;
          min-height: 48px !important;
        }

        .widget-options {
          padding: 20px !important;
          gap: 12px !important;
        }

        .widget-option {
          padding: 16px !important;
          gap: 14px !important;
        }

        .option-icon {
          min-width: 40px !important;
          height: 40px !important;
          padding: 10px !important;
        }

        .option-title {
          font-size: 15px !important;
        }

        .option-desc {
          font-size: 13px !important;
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
    const triggerIcon = this.createIconElement();
    this.button.innerHTML = `
      ${triggerIcon}
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

  createIconElement() {
    // Check icon type and return appropriate HTML
    if (this.config.iconType === 'image' && this.config.customIcon) {
      return `<img src="${this.config.customIcon}" alt="Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`;
    } else if (this.config.iconType === 'emoji' && this.config.iconEmoji) {
      return `<div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">${this.config.iconEmoji}</div>`;
    } else {
      // Default icon - first letter of product name
      const firstLetter = (this.config.productName || 'B').charAt(0).toUpperCase();
      return `<div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">${firstLetter}</div>`;
    }
  }

  createMainView() {
    this.mainView = document.createElement('div');
    this.mainView.className = 'widget-view widget-main-view active';

    // Header
    const header = document.createElement('div');
    header.className = 'widget-header';

    // Create icon element
    const iconElement = this.createIconElement();

    header.innerHTML = `
      ${iconElement}
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
      const iconHtml = option.icon ? `<div class="option-icon">${option.icon}</div>` : '';
      button.innerHTML = `
        ${iconHtml}
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

    const iconElement = this.createIconElement();

    header.innerHTML = `
      <button class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      ${iconElement}
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
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
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
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
(function () {
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