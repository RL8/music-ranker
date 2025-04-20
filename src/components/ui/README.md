# UI Components

This directory contains reusable UI components designed for the music-ranker application with a mobile-first approach.

## MobileHeader

A standardized header component that provides consistent spacing and styling across all views, with special consideration for the sidebar toggle button on mobile devices.

### Basic Usage

```vue
<MobileHeader title="Page Title">
  <!-- Optional actions go here -->
</MobileHeader>
```

### Rich Content Title

For headers that need rich content (like colored text or dynamic content):

```vue
<MobileHeader>
  <template #title>
    Welcome, <span class="text-green-600">{{ username }}</span>!
  </template>
</MobileHeader>
```

### With Action Buttons

```vue
<MobileHeader title="Page Title">
  <template #actions>
    <button class="action-button">
      <i class="settings-icon"></i>
    </button>
  </template>
</MobileHeader>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | String | '' | The header title (not required if using title slot) |

### Slots

| Name | Description |
|------|-------------|
| title | For rich content in the header title |
| actions | For action buttons on the right side of the header |

## Other Components

- **MobileCard**: Card component with consistent styling
- **MobileList**: List component with various display options
- **LazyImage**: Image loading component with optimization
- **PullToRefresh**: Mobile gesture component
- **SwipeAction**: Mobile gesture component
- **TouchFeedback**: Mobile touch feedback component
