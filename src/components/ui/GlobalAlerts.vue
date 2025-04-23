<template>
  <div class="global-alerts-container">
    <transition-group name="alert-fade" tag="div">
      <MobileAlert
        v-for="alert in alerts"
        :key="alert.id"
        :type="alert.type"
        :title="alert.title"
        :message="alert.message"
        :dismissible="alert.dismissible"
        :show="alert.show"
        class="mb-2"
        @dismiss="dismissAlert(alert.id)"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import MobileAlert from '@/components/ui/MobileAlert.vue';
import alertService from '@/services/alertService';

// Get alerts from the alert service
const alerts = computed(() => alertService.getAlerts());

// Dismiss an alert
const dismissAlert = (id) => {
  alertService.hide(id);
};

// Clear all alerts when component is unmounted
onUnmounted(() => {
  alertService.hideAll();
});
</script>

<style scoped>
.global-alerts-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  width: calc(100% - 40px);
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
