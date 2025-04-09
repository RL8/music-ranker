import { createApp, h } from 'vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const toastService = {
  show(options) {
    const { title, message, duration = 3000, autoClose = true } = options;
    
    // Create a div to mount our toast
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    
    // Create the toast instance
    const toastApp = createApp({
      render() {
        return h(ToastNotification, {
          title,
          message,
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
  }
};

export default toastService;
