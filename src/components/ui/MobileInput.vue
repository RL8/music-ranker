<template>
  <div class="mobile-input-container">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="input-wrapper" :class="{ 'with-addon': $slots.addon }">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :class="[
          'mobile-input',
          { 'is-invalid': error, 'is-disabled': disabled }
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div v-if="$slots.addon" class="input-addon">
        <slot name="addon"></slot>
      </div>
    </div>
    
    <div v-if="helpText || error" class="input-help-text" :class="{ 'text-red-500': error }">
      {{ error || helpText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substring(2, 9)}`;
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: null
    }
  },
  emits: ['update:modelValue', 'blur', 'focus']
}
</script>

<style lang="scss" scoped>
.mobile-input-container {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151; // gray-700
}

.input-wrapper {
  position: relative;
  display: flex;
  
  &.with-addon {
    .mobile-input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.mobile-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1f2937; // gray-800
  background-color: #fff;
  border: 1px solid #d1d5db; // gray-300
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #22c55e; // green-600
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); // green-600 with opacity
  }
  
  &.is-invalid {
    border-color: #ef4444; // red-500
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); // red-500 with opacity
    }
  }
  
  &.is-disabled {
    background-color: #f3f4f6; // gray-100
    cursor: not-allowed;
  }
  
  // Increase touch target size on mobile
  @media (max-width: 640px) {
    min-height: 2.5rem;
  }
}

.input-addon {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563; // gray-600
  text-align: center;
  background-color: #f3f4f6; // gray-100
  border: 1px solid #d1d5db; // gray-300
  border-left: 0;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.input-help-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280; // gray-500
}
</style>
