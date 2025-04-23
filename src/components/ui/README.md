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

## MobileButton

A standardized button component with consistent styling and behavior across the application. Designed with mobile-first principles for optimal touch targets.

### Basic Usage

```vue
<MobileButton>Click Me</MobileButton>
```

### Variants

```vue
<MobileButton variant="primary">Primary Button</MobileButton>
<MobileButton variant="secondary">Secondary Button</MobileButton>
<MobileButton variant="outline">Outline Button</MobileButton>
<MobileButton variant="text">Text Button</MobileButton>
<MobileButton variant="danger">Danger Button</MobileButton>
```

### Sizes

```vue
<MobileButton size="small">Small Button</MobileButton>
<MobileButton size="medium">Medium Button</MobileButton>
<MobileButton size="large">Large Button</MobileButton>
```

### With Icon

```vue
<MobileButton>
  <template #icon>
    <i class="settings-icon"></i>
  </template>
  Settings
</MobileButton>
```

### Full Width

```vue
<MobileButton :fullWidth="true">Full Width Button</MobileButton>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | String | 'primary' | Button style variant ('primary', 'secondary', 'outline', 'text', 'danger') |
| size | String | 'medium' | Button size ('small', 'medium', 'large') |
| type | String | 'button' | HTML button type attribute ('button', 'submit', 'reset') |
| fullWidth | Boolean | false | Whether the button should take full width of its container |

### Events

| Event | Description |
|-------|-------------|
| click | Emitted when the button is clicked |

### Slots

| Name | Description |
|------|-------------|
| default | Button text content |
| icon | Icon to display before the button text |

## MobileInput

A standardized input component with consistent styling and behavior. Supports various input types and includes validation and help text features.

### Basic Usage

```vue
<MobileInput
  v-model="username"
  label="Username"
  placeholder="Enter your username"
/>
```

### With Help Text and Validation

```vue
<MobileInput
  v-model="email"
  type="email"
  label="Email Address"
  placeholder="example@email.com"
  help-text="We'll never share your email"
  :error="emailError"
  required
/>
```

### With Addon

```vue
<MobileInput
  v-model="profileUrl"
  label="Profile URL"
>
  <template #addon>
    <span>Copy</span>
  </template>
</MobileInput>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | String/Number | '' | The input value (used with v-model) |
| label | String | '' | Input label text |
| type | String | 'text' | HTML input type (text, email, password, etc.) |
| placeholder | String | '' | Input placeholder text |
| helpText | String | '' | Help text displayed below the input |
| error | String | '' | Error message (displays in red and changes input styling) |
| id | String | auto-generated | HTML id attribute for the input |
| disabled | Boolean | false | Whether the input is disabled |
| required | Boolean | false | Whether the input is required |
| maxlength | Number | null | Maximum character length |

### Events

| Event | Description |
|-------|-------------|
| update:modelValue | Emitted when the input value changes |
| blur | Emitted when the input loses focus |
| focus | Emitted when the input gains focus |

### Slots

| Name | Description |
|------|-------------|
| addon | Content to display in the input addon area (right side) |

## MobileTextarea

A standardized textarea component for multi-line text input with character counting and validation.

### Basic Usage

```vue
<MobileTextarea
  v-model="bio"
  label="Bio"
  placeholder="Tell us about yourself"
/>
```

### With Character Count and Maxlength

```vue
<MobileTextarea
  v-model="comment"
  label="Comment"
  placeholder="Leave a comment"
  :maxlength="150"
  :rows="3"
  help-text="Keep it brief and friendly"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | String | '' | The textarea value (used with v-model) |
| label | String | '' | Textarea label text |
| placeholder | String | '' | Textarea placeholder text |
| rows | Number | 4 | Number of visible text rows |
| helpText | String | '' | Help text displayed below the textarea |
| error | String | '' | Error message (displays in red and changes textarea styling) |
| id | String | auto-generated | HTML id attribute for the textarea |
| disabled | Boolean | false | Whether the textarea is disabled |
| required | Boolean | false | Whether the textarea is required |
| maxlength | Number | null | Maximum character length |
| showCharCount | Boolean | true | Whether to show the character count when maxlength is set |

### Events

| Event | Description |
|-------|-------------|
| update:modelValue | Emitted when the textarea value changes |
| blur | Emitted when the textarea loses focus |
| focus | Emitted when the textarea gains focus |

## MobileTabs

A standardized tabs component for consistent tab navigation across the application. Optimized for mobile with horizontal scrolling support.

### Basic Usage

```vue
<MobileTabs
  v-model="activeTab"
  :tabs="[
    { id: 'info', label: 'Information' },
    { id: 'settings', label: 'Settings' },
    { id: 'history', label: 'History' }
  ]"
>
  <div v-if="activeTab === 'info'">
    Information content goes here
  </div>
  <div v-if="activeTab === 'settings'">
    Settings content goes here
  </div>
  <div v-if="activeTab === 'history'">
    History content goes here
  </div>
</MobileTabs>
```

### With Icons

```vue
<MobileTabs
  v-model="activeTab"
  :tabs="[
    { id: 'profile', label: 'Profile', icon: true },
    { id: 'security', label: 'Security', icon: true }
  ]"
>
  <template #icon-profile>
    <i class="profile-icon"></i>
  </template>
  <template #icon-security>
    <i class="security-icon"></i>
  </template>
  
  <div v-if="activeTab === 'profile'">
    Profile content
  </div>
  <div v-if="activeTab === 'security'">
    Security content
  </div>
</MobileTabs>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | String/Number | required | The active tab ID (used with v-model) |
| tabs | Array | required | Array of tab objects with id, label, and optional icon properties |
| scrollable | Boolean | true | Whether to enable horizontal scrolling for tabs |

### Events

| Event | Description |
|-------|-------------|
| update:modelValue | Emitted when a tab is selected |

### Slots

| Name | Description |
|------|-------------|
| default | The tab content area |
| icon-{tabId} | Custom icon for a specific tab (replace {tabId} with the actual tab ID) |

## MobilePageContainer

A standardized page container component that provides consistent padding and maximum width constraints across all views. Responsive design ensures proper spacing on different screen sizes.

### Basic Usage

```vue
<MobilePageContainer>
  <h1>Page Title</h1>
  <p>Page content goes here</p>
</MobilePageContainer>
```

### Props

None

### Slots

| Name | Description |
|------|-------------|
| default | Page content |

## MobileSection

A standardized section component that provides consistent spacing and styling for content sections within pages. Supports optional title, borders, and shadows.

### Basic Usage

```vue
<MobileSection title="Section Title">
  <p>Section content goes here</p>
</MobileSection>
```

### With Border and Shadow

```vue
<MobileSection 
  title="Important Information" 
  spacing="large"
  :border="true"
  :shadow="true"
>
  <p>This section stands out with a border and shadow</p>
</MobileSection>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | String | '' | Section title (optional) |
| spacing | String | 'medium' | Padding size ('small', 'medium', 'large') |
| border | Boolean | false | Whether to show a border around the section |
| shadow | Boolean | false | Whether to add a shadow to the section |

### Slots

| Name | Description |
|------|-------------|
| default | Section content |

## MobileSpacing

A utility component that provides consistent vertical spacing between elements.

### Basic Usage

```vue
<div>First element</div>
<MobileSpacing size="medium" />
<div>Second element</div>
```

### Different Sizes

```vue
<MobileSpacing size="xs" />  <!-- 8px -->
<MobileSpacing size="small" />  <!-- 16px -->
<MobileSpacing size="medium" />  <!-- 24px -->
<MobileSpacing size="large" />  <!-- 32px -->
<MobileSpacing size="xl" />  <!-- 48px -->
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | String | 'medium' | Spacing size ('xs', 'small', 'medium', 'large', 'xl') |

## MobileAlert

A standardized alert component for displaying notifications, warnings, errors, and informational messages with consistent styling.

### Basic Usage

```vue
<MobileAlert
  type="info"
  message="This is an informational message"
/>
```

### With Title and Dismissible

```vue
<MobileAlert
  type="warning"
  title="Warning"
  message="This action cannot be undone"
  :dismissible="true"
  v-model:show="showWarning"
/>
```

### With Custom Content

```vue
<MobileAlert type="success">
  <template #default>
    Your profile has been updated successfully. 
    <router-link to="/profile" class="font-medium underline">View your profile</router-link>
  </template>
</MobileAlert>
```

### Auto-closing Alert

```vue
<MobileAlert
  type="info"
  message="This alert will disappear in 3 seconds"
  :auto-close="true"
  :duration="3000"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | String | 'info' | Alert type ('info', 'success', 'warning', 'error') |
| title | String | '' | Optional title for the alert |
| message | String | '' | Alert message (not required if using default slot) |
| showIcon | Boolean | true | Whether to show the type icon |
| dismissible | Boolean | false | Whether the alert can be dismissed by the user |
| show | Boolean | true | Controls the visibility of the alert (can be used with v-model:show) |
| autoClose | Boolean | false | Whether the alert should automatically close after a duration |
| duration | Number | 5000 | Duration in milliseconds before auto-closing (if autoClose is true) |

### Events

| Event | Description |
|-------|-------------|
| dismiss | Emitted when the alert is dismissed |
| update:show | Emitted when the show state changes (for v-model binding) |

### Slots

| Name | Description |
|------|-------------|
| default | Custom content for the alert message |

## MobileModal

A standardized modal component for displaying dialogs, forms, and other content in a modal overlay.

### Basic Usage

```vue
<template>
  <MobileButton @click="showModal = true">
    Open Modal
  </MobileButton>
  
  <MobileModal v-model="showModal" title="Example Modal">
    <p>This is the modal content.</p>
  </MobileModal>
</template>

<script setup>
import { ref } from 'vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import MobileModal from '@/components/ui/MobileModal.vue';

const showModal = ref(false);
</script>
```

### With Custom Header and Footer

```vue
<MobileModal v-model="showModal">
  <template #header>
    <div class="flex items-center">
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="text-lg font-medium">Custom Header</h3>
    </div>
  </template>
  
  <p>Modal content goes here.</p>
  
  <template #footer>
    <MobileButton variant="outline" @click="showModal = false">
      Cancel
    </MobileButton>
    <MobileButton variant="primary" @click="saveChanges">
      Save Changes
    </MobileButton>
  </template>
</MobileModal>
```

### Different Sizes

```vue
<MobileModal v-model="showModal" title="Small Modal" size="sm">
  <p>This is a small modal.</p>
</MobileModal>

<MobileModal v-model="showModal" title="Medium Modal" size="md">
  <p>This is a medium modal (default).</p>
</MobileModal>

<MobileModal v-model="showModal" title="Large Modal" size="lg">
  <p>This is a large modal.</p>
</MobileModal>

<MobileModal v-model="showModal" title="Extra Large Modal" size="xl">
  <p>This is an extra large modal.</p>
</MobileModal>

<MobileModal v-model="showModal" title="Full Screen Modal" size="full">
  <p>This is a full screen modal.</p>
</MobileModal>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | Boolean | false | Controls the visibility of the modal (use with v-model) |
| title | String | '' | Modal title (not required if using header slot) |
| size | String | 'md' | Modal size ('sm', 'md', 'lg', 'xl', 'full') |
| showCloseButton | Boolean | true | Whether to show the close button in the header |
| closeOnBackdrop | Boolean | true | Whether clicking the backdrop closes the modal |
| closeOnEsc | Boolean | true | Whether pressing the ESC key closes the modal |

### Events

| Event | Description |
|-------|-------------|
| close | Emitted when the modal is closed |
| update:modelValue | Emitted when the visibility state changes (for v-model binding) |

### Slots

| Name | Description |
|------|-------------|
| default | Modal body content |
| header | Custom header content (replaces the default header) |
| footer | Footer content (buttons, etc.) |

### Using with Modal Service

The MobileModal component can be used with the modalService for programmatic control:

```javascript
import modalService from '@/services/modalService';
import YourComponent from '@/components/YourComponent.vue';

// Show a modal with a component
modalService.show({
  title: 'Your Modal Title',
  component: YourComponent,
  props: {
    // Props to pass to YourComponent
    someData: 'example data'
  },
  size: 'lg',
  onClose: () => {
    console.log('Modal closed');
  }
});
```

## Other Components

- **MobileCard**: Card component with consistent styling
- **MobileList**: Standardized list component with various display options
- **LazyImage**: Image loading component with optimization
- **PullToRefresh**: Mobile gesture component
- **SwipeAction**: Mobile gesture component
- **TouchFeedback**: Mobile touch feedback component
