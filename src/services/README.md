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
