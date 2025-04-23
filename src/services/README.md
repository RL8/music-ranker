# Services

This directory contains service modules that provide functionality across the music-ranker application.

## Toast Service

A centralized notification service that provides consistent toast notifications throughout the application.

### Basic Usage

```javascript
import toastService from '@/services/toastService';

// Show an info toast
toastService.info('Information', 'This is an informational message');

// Show a success toast
toastService.success('Success', 'Operation completed successfully');

// Show an error toast
toastService.error('Error', 'Something went wrong');

// Show a warning toast
toastService.warning('Warning', 'Please be careful');
```

### Type-Specific Methods

| Method | Description | Default Duration |
|--------|-------------|------------------|
| `success(title, message, duration)` | Green success notification | 3000ms |
| `error(title, message, duration)` | Red error notification | 4000ms |
| `info(title, message, duration)` | Gray info notification | 3000ms |
| `warning(title, message, duration)` | Yellow warning notification | 3500ms |

### Advanced Usage

For more control, you can use the base `show` method:

```javascript
toastService.show({
  title: 'Custom Toast',
  message: 'This is a custom toast message',
  type: 'info', // 'success', 'error', 'info', 'warning'
  duration: 5000,
  autoClose: true
});
```

### Programmatic Control

All methods return an object with a `close` method that can be used to close the toast programmatically:

```javascript
const toast = toastService.info('Processing', 'Please wait...');

// Later, when the operation is complete
toast.close();
```

## Alert Service

A centralized service for managing in-page alerts throughout the application. Unlike toast notifications which are temporary, alerts can remain on the page until dismissed by the user or programmatically.

### Basic Usage

```javascript
import alertService from '@/services/alertService';

// Show an info alert
alertService.info('This is an informational message', 'Information');

// Show a success alert
alertService.success('Operation completed successfully', 'Success');

// Show an error alert
alertService.error('Something went wrong', 'Error');

// Show a warning alert
alertService.warning('Please be careful', 'Warning');
```

### Type-Specific Methods

| Method | Description | Auto-Close Default |
|--------|-------------|-------------------|
| `success(message, title, options)` | Green success alert | false |
| `error(message, title, options)` | Red error alert | false |
| `info(message, title, options)` | Blue info alert | false |
| `warning(message, title, options)` | Yellow warning alert | false |

### Advanced Usage

For more control, you can use the base `show` method:

```javascript
const alertId = alertService.show({
  type: 'info', // 'success', 'error', 'info', 'warning'
  title: 'Custom Alert',
  message: 'This is a custom alert message',
  dismissible: true,
  autoClose: true,
  duration: 5000
});
```

### Programmatic Control

All methods return an alert ID that can be used to hide the alert programmatically:

```javascript
const alertId = alertService.info('Processing your request...', 'Please Wait');

// Later, when the operation is complete
alertService.hide(alertId);

// To hide all alerts
alertService.hideAll();
```

### Integration with UI

The alert service is integrated with the `GlobalAlerts` component which is included in `App.vue`. This component automatically displays all alerts created through the alert service.

### When to Use Alerts vs. Toasts

- **Alerts**: Use for important information that should remain visible until acknowledged by the user or for status updates that are relevant for a longer period.
- **Toasts**: Use for transient notifications that don't require user action and automatically disappear after a short time.

## Modal Service

A centralized service for managing modals throughout the application. This service allows for programmatic control of modals without requiring direct template bindings.

### Basic Usage

```javascript
import modalService from '@/services/modalService';
import YourComponent from '@/components/YourComponent.vue';

// Show a modal with a component
const modalId = modalService.show({
  title: 'Your Modal Title',
  component: YourComponent,
  props: {
    // Props to pass to YourComponent
    someData: 'example data'
  }
});

// Later, hide the modal
modalService.hide(modalId);
```

### Modal Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| id | String | auto-generated | Unique identifier for the modal |
| title | String | '' | Modal title |
| component | Component | null | Vue component to render in the modal |
| props | Object | {} | Props to pass to the component |
| size | String | 'md' | Modal size ('sm', 'md', 'lg', 'xl', 'full') |
| showCloseButton | Boolean | true | Whether to show the close button |
| closeOnBackdrop | Boolean | true | Whether clicking the backdrop closes the modal |
| closeOnEsc | Boolean | true | Whether pressing ESC closes the modal |
| onClose | Function | null | Callback function when modal is closed |

### Methods

| Method | Description |
|--------|-------------|
| `show(options)` | Show a modal with the specified options |
| `hide(id)` | Hide a modal by ID |
| `hideAll()` | Hide all modals |
| `update(id, updates)` | Update a modal's properties |
| `getModal(id)` | Get a modal by ID |
| `getModals()` | Get all modals |
| `isOpen(id)` | Check if a modal is open |

### Integration with UI

The modal service is integrated with the `GlobalModals` component which is included in `App.vue`. This component automatically displays all modals created through the modal service.

### Common Use Cases

1. **Confirmation Dialogs**
   ```javascript
   modalService.show({
     title: 'Confirm Deletion',
     component: ConfirmationDialog,
     props: {
       message: 'Are you sure you want to delete this item?',
       confirmText: 'Delete',
       cancelText: 'Cancel',
       onConfirm: () => {
         // Delete the item
         deleteItem(itemId);
         // Hide the modal
         modalService.hideAll();
       }
     },
     size: 'sm'
   });
   ```

2. **Forms in Modals**
   ```javascript
   modalService.show({
     title: 'Edit Profile',
     component: ProfileForm,
     props: {
       userData: currentUser,
       onSave: (updatedData) => {
         // Save the updated data
         updateUserProfile(updatedData);
         // Hide the modal
         modalService.hideAll();
       }
     },
     size: 'md'
   });
   ```

3. **Detail Views**
   ```javascript
   modalService.show({
     title: 'Album Details',
     component: AlbumDetails,
     props: {
       albumId: selectedAlbumId
     },
     size: 'lg'
   });
   ```

### Best Practices

1. **Component Design**
   - Design modal components to be self-contained with clear props interfaces
   - Handle internal state within the component
   - Emit events or use callbacks for communication with the parent

2. **Modal Management**
   - Use unique IDs for modals that need to be referenced later
   - Close modals when they're no longer needed
   - Consider modal stacking and z-index when showing multiple modals

3. **User Experience**
   - Keep modals focused on a single task or piece of information
   - Provide clear actions and feedback
   - Ensure modals are accessible and keyboard navigable

## Best Practices

1. Use the appropriate toast type for the message context:
   - `success`: For successful operations
   - `error`: For errors and failures
   - `info`: For general information
   - `warning`: For potential issues or cautions

2. Keep messages concise:
   - Title: 1-3 words
   - Message: Brief explanation (optional)

3. Use consistently throughout the application for a unified user experience

### Alert Best Practices

1. Use the appropriate alert type for the context:
   - `success`: For successful operations that users should be aware of
   - `error`: For errors that prevent functionality or require user action
   - `info`: For general information that users should know
   - `warning`: For potential issues that users should be aware of

2. Keep content clear and actionable:
   - Include a clear title that summarizes the alert
   - Provide enough detail in the message for users to understand what's happening
   - For error alerts, include guidance on how to resolve the issue when possible

3. Use dismissible alerts for non-critical information that users can acknowledge and dismiss
