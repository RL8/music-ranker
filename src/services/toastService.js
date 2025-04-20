import { createApp, h } from 'vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const toastService = {
  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.title - Toast title
   * @param {string} options.message - Toast message (optional)
   * @param {string} options.type - Toast type: 'success', 'error', 'info', 'warning' (default: 'info')
   * @param {number} options.duration - Duration in ms (default: 3000)
   * @param {boolean} options.autoClose - Whether to auto close the toast (default: true)
   * @returns {Object} - Object with close method
   */
  show(options) {
    const { 
      title, 
      message = '', 
      type = 'info', 
      duration = 3000, 
      autoClose = true 
    } = options;
    
    // Create a div to mount our toast
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    
    // Create the toast instance
    const toastApp = createApp({
      render() {
        return h(ToastNotification, {
          title,
          message,
          type,
          duration,
          autoClose
        });
      }
    });
    
    // Mount the toast
    const toastInstance = toastApp.mount(mountPoint);
    
    // Return a function to programmatically close the toast
    const close = () => {
      // Simply unmount the component instead of trying to call hide()
      toastApp.unmount();
      document.body.removeChild(mountPoint);
    };
    
    // Auto cleanup after duration
    if (autoClose) {
      setTimeout(() => {
        close();
      }, duration);
    }
    
    return { close };
  },

  /**
   * Show a success toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message (optional)
   * @param {number} duration - Duration in ms (default: 3000)
   * @returns {Object} - Object with close method
   */
  success(title, message = '', duration = 3000) {
    return this.show({
      title,
      message,
      type: 'success',
      duration
    });
  },

  /**
   * Show an error toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message (optional)
   * @param {number} duration - Duration in ms (default: 4000)
   * @returns {Object} - Object with close method
   */
  error(title, message = '', duration = 4000) {
    return this.show({
      title,
      message,
      type: 'error',
      duration
    });
  },

  /**
   * Show an info toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message (optional)
   * @param {number} duration - Duration in ms (default: 3000)
   * @returns {Object} - Object with close method
   */
  info(title, message = '', duration = 3000) {
    return this.show({
      title,
      message,
      type: 'info',
      duration
    });
  },

  /**
   * Show a warning toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message (optional)
   * @param {number} duration - Duration in ms (default: 3500)
   * @returns {Object} - Object with close method
   */
  warning(title, message = '', duration = 3500) {
    return this.show({
      title,
      message,
      type: 'warning',
      duration
    });
  }
};

export default toastService;
