<template>
  <MobileModal 
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="title"
    size="sm"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <p class="text-gray-600">
        {{ message }}
      </p>
      
      <div class="flex justify-end space-x-3 mt-6">
        <MobileButton 
          v-if="showCancelButton" 
          variant="outline" 
          @click="cancel"
        >
          {{ cancelText }}
        </MobileButton>
        <MobileButton 
          :variant="confirmVariant" 
          @click="confirm"
        >
          {{ confirmText }}
        </MobileButton>
      </div>
    </div>
  </MobileModal>
</template>

<script setup>
import MobileModal from '@/components/ui/MobileModal.vue';
import MobileButton from '@/components/ui/MobileButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'secondary', 'success'].includes(value)
  },
  showCancelButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>
