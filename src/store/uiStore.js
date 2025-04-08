import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  // State: reactive data
  state: () => ({
    isMobileView: false,
    isDarkMode: false,
    sidebarOpen: false,
    activeTab: null,
    toasts: [],
    confirmDialog: {
      show: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: null,
      onCancel: null
    }
  }),

  // Getters: computed properties for the state
  getters: {
    isMobile: (state) => state.isMobileView,
    isDark: (state) => state.isDarkMode,
    getActiveTab: (state) => state.activeTab
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    setMobileView(isMobile) {
      this.isMobileView = isMobile
    },
    
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      
      // Apply dark mode to document
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', this.isDarkMode ? 'dark' : 'light')
    },
    
    initDarkMode() {
      // Check for saved preference or system preference
      const savedMode = localStorage.getItem('darkMode')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      this.isDarkMode = savedMode 
        ? savedMode === 'dark'
        : systemPrefersDark
      
      // Apply initial dark mode setting
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      }
    },
    
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    
    setActiveTab(tabName) {
      this.activeTab = tabName
    },
    
    addToast(toast) {
      const id = Date.now().toString()
      const newToast = {
        id,
        title: toast.title || '',
        message: toast.message || '',
        type: toast.type || 'info', // info, success, warning, error
        duration: toast.duration || 3000,
        timestamp: new Date()
      }
      
      this.toasts.push(newToast)
      
      // Auto-remove toast after duration
      if (newToast.duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, newToast.duration)
      }
      
      return id
    },
    
    removeToast(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },
    
    showConfirmDialog(options) {
      this.confirmDialog = {
        show: true,
        title: options.title || 'Confirm',
        message: options.message || 'Are you sure?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: options.onConfirm || null,
        onCancel: options.onCancel || null
      }
    },
    
    hideConfirmDialog() {
      this.confirmDialog.show = false
    },
    
    confirmDialogAction(confirmed) {
      if (confirmed && typeof this.confirmDialog.onConfirm === 'function') {
        this.confirmDialog.onConfirm()
      } else if (!confirmed && typeof this.confirmDialog.onCancel === 'function') {
        this.confirmDialog.onCancel()
      }
      
      this.hideConfirmDialog()
    }
  }
})
