import { reactive } from 'vue';

/**
 * Alert Service for managing application-wide alerts
 * 
 * This service provides methods to show and hide different types of alerts
 * throughout the application, ensuring consistent alert behavior and styling.
 */
const alertState = reactive({
  alerts: []
});

const alertService = {
  /**
   * Show an alert
   * @param {Object} options - Alert options
   * @param {string} options.id - Unique identifier for the alert (optional, auto-generated if not provided)
   * @param {string} options.type - Alert type: 'info', 'success', 'warning', 'error' (default: 'info')
   * @param {string} options.title - Alert title (optional)
   * @param {string} options.message - Alert message
   * @param {boolean} options.dismissible - Whether the alert can be dismissed (default: true)
   * @param {boolean} options.autoClose - Whether to auto close the alert (default: false)
   * @param {number} options.duration - Duration in ms before auto-closing (default: 5000)
   * @returns {string} - The alert ID
   */
  show(options) {
    const {
      id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type = 'info',
      title = '',
      message,
      dismissible = true,
      autoClose = false,
      duration = 5000
    } = options;

    // Check if alert with this ID already exists
    const existingAlertIndex = alertState.alerts.findIndex(alert => alert.id === id);
    
    if (existingAlertIndex !== -1) {
      // Update existing alert
      alertState.alerts[existingAlertIndex] = {
        id,
        type,
        title,
        message,
        dismissible,
        autoClose,
        duration,
        show: true
      };
    } else {
      // Add new alert
      alertState.alerts.push({
        id,
        type,
        title,
        message,
        dismissible,
        autoClose,
        duration,
        show: true
      });
    }

    // Auto-close if needed
    if (autoClose) {
      setTimeout(() => {
        this.hide(id);
      }, duration);
    }

    return id;
  },

  /**
   * Hide an alert by ID
   * @param {string} id - Alert ID
   */
  hide(id) {
    const alertIndex = alertState.alerts.findIndex(alert => alert.id === id);
    if (alertIndex !== -1) {
      // Set show to false first for animation purposes
      alertState.alerts[alertIndex].show = false;
      
      // Remove after a short delay to allow for animation
      setTimeout(() => {
        const currentIndex = alertState.alerts.findIndex(alert => alert.id === id);
        if (currentIndex !== -1) {
          alertState.alerts.splice(currentIndex, 1);
        }
      }, 300);
    }
  },

  /**
   * Hide all alerts
   */
  hideAll() {
    // Set all alerts to not show first
    alertState.alerts.forEach(alert => {
      alert.show = false;
    });
    
    // Remove all alerts after a short delay
    setTimeout(() => {
      alertState.alerts.splice(0, alertState.alerts.length);
    }, 300);
  },

  /**
   * Show an info alert
   * @param {string} message - Alert message
   * @param {string} title - Alert title (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {string} - The alert ID
   */
  info(message, title = '', options = {}) {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  },

  /**
   * Show a success alert
   * @param {string} message - Alert message
   * @param {string} title - Alert title (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {string} - The alert ID
   */
  success(message, title = '', options = {}) {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  },

  /**
   * Show a warning alert
   * @param {string} message - Alert message
   * @param {string} title - Alert title (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {string} - The alert ID
   */
  warning(message, title = '', options = {}) {
    return this.show({
      type: 'warning',
      title,
      message,
      ...options
    });
  },

  /**
   * Show an error alert
   * @param {string} message - Alert message
   * @param {string} title - Alert title (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {string} - The alert ID
   */
  error(message, title = '', options = {}) {
    return this.show({
      type: 'error',
      title,
      message,
      ...options
    });
  },

  /**
   * Get all active alerts
   * @returns {Array} - Array of alert objects
   */
  getAlerts() {
    return alertState.alerts;
  }
};

export default alertService;
