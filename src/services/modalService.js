import { reactive } from 'vue';

/**
 * Modal Service for managing application-wide modals
 * 
 * This service provides methods to show and hide different modals
 * throughout the application, ensuring consistent modal behavior and styling.
 */
const modalState = reactive({
  modals: {}
});

const modalService = {
  /**
   * Show a modal
   * @param {Object} options - Modal options
   * @param {string} options.id - Unique identifier for the modal
   * @param {string} options.title - Modal title (optional)
   * @param {string} options.component - Vue component to render in the modal
   * @param {Object} options.props - Props to pass to the component (optional)
   * @param {string} options.size - Modal size: 'sm', 'md', 'lg', 'xl', 'full' (default: 'md')
   * @param {boolean} options.showCloseButton - Whether to show the close button (default: true)
   * @param {boolean} options.closeOnBackdrop - Whether to close when clicking backdrop (default: true)
   * @param {boolean} options.closeOnEsc - Whether to close when pressing ESC (default: true)
   * @param {Function} options.onClose - Callback function when modal is closed (optional)
   * @returns {string} - The modal ID
   */
  show(options) {
    const {
      id = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title = '',
      component = null,
      props = {},
      size = 'md',
      showCloseButton = true,
      closeOnBackdrop = true,
      closeOnEsc = true,
      onClose = null
    } = options;

    // Create or update modal
    modalState.modals[id] = {
      id,
      title,
      component,
      props,
      size,
      showCloseButton,
      closeOnBackdrop,
      closeOnEsc,
      onClose,
      show: true
    };

    return id;
  },

  /**
   * Hide a modal by ID
   * @param {string} id - Modal ID
   */
  hide(id) {
    if (modalState.modals[id]) {
      // Call onClose callback if provided
      if (typeof modalState.modals[id].onClose === 'function') {
        modalState.modals[id].onClose();
      }
      
      // Remove modal
      delete modalState.modals[id];
    }
  },

  /**
   * Hide all modals
   */
  hideAll() {
    // Call onClose callbacks for all modals
    Object.values(modalState.modals).forEach(modal => {
      if (typeof modal.onClose === 'function') {
        modal.onClose();
      }
    });
    
    // Clear all modals
    modalState.modals = {};
  },

  /**
   * Update a modal's properties
   * @param {string} id - Modal ID
   * @param {Object} updates - Properties to update
   */
  update(id, updates) {
    if (modalState.modals[id]) {
      modalState.modals[id] = {
        ...modalState.modals[id],
        ...updates
      };
    }
  },

  /**
   * Get a modal by ID
   * @param {string} id - Modal ID
   * @returns {Object|null} - Modal object or null if not found
   */
  getModal(id) {
    return modalState.modals[id] || null;
  },

  /**
   * Get all modals
   * @returns {Object} - Object containing all modals
   */
  getModals() {
    return modalState.modals;
  },

  /**
   * Check if a modal is open
   * @param {string} id - Modal ID
   * @returns {boolean} - True if modal is open, false otherwise
   */
  isOpen(id) {
    return !!modalState.modals[id];
  }
};

export default modalService;
