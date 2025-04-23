<template>
  <div class="mobile-textarea-container">
    <label v-if="label" :for="id" class="textarea-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :maxlength="maxlength"
      :class="[
        'mobile-textarea',
        { 'is-invalid': error, 'is-disabled': disabled }
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    ></textarea>
    
    <div v-if="maxlength && showCharCount" class="char-count" :class="{ 'text-red-500': isNearLimit }">
      {{ modelValue.length }}/{{ maxlength }}
    </div>
    
    <div v-if="helpText || error" class="textarea-help-text" :class="{ 'text-red-500': error }">
      {{ error || helpText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileTextarea',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 4
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
        return `textarea-${Math.random().toString(36).substring(2, 9)}`;
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
    },
    showCharCount: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isNearLimit() {
      if (!this.maxlength || !this.modelValue) return false;
      return this.modelValue.length > this.maxlength * 0.9;
    }
  },
  emits: ['update:modelValue', 'blur', 'focus']
}
</script>

<style lang="scss" scoped>
.mobile-textarea-container {
  margin-bottom: 1rem;
  position: relative;
}

.textarea-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151; // gray-700
}

.mobile-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1f2937; // gray-800
  background-color: #fff;
  border: 1px solid #d1d5db; // gray-300
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  resize: vertical;
  
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
}

.char-count {
  position: absolute;
  right: 0.5rem;
  bottom: 1.5rem;
  font-size: 0.75rem;
  color: #6b7280; // gray-500
}

.textarea-help-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280; // gray-500
}
</style>
