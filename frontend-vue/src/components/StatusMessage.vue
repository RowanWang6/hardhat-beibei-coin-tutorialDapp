<template>
  <div
    v-if="message"
    :class="[
      'p-4 rounded-lg font-medium text-center transition-all duration-300 fade-in',
      {
        'status-success': type === 'success',
        'status-error': type === 'error',
        'status-warning': type === 'warning',
      },
    ]"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'warning'
}

withDefaults(defineProps<Props>(), {
  type: 'success',
})
</script>