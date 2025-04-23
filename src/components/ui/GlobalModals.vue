<template>
  <div class="global-modals-container">
    <component
      v-for="(modal, id) in modals"
      :key="id"
      :is="modal.component"
      v-bind="modal.props"
      v-model="modal.show"
      @close="closeModal(id)"
    />
  </div>
</template>

<script setup>
import { computed, markRaw, defineAsyncComponent } from 'vue';
import modalService from '@/services/modalService';

// Get modals from the modal service
const modals = computed(() => modalService.getModals());

// Close a modal
const closeModal = (id) => {
  modalService.hide(id);
};
</script>

<style scoped>
.global-modals-container {
  /* This container is invisible and just holds the modals */
}
</style>
