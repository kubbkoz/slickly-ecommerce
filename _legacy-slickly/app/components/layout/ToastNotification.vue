<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="toasts.length"
      class="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none safe-bottom"
    >
      <TransitionGroup
        enter-active-class="toast-enter-active"
        leave-active-class="toast-leave-active"
        move-class="transition-transform duration-200"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-2 bg-primary text-on-primary pl-3 pr-4 py-2.5 rounded-default shadow-lg pointer-events-auto max-w-[90vw]"
          role="status"
        >
          <span class="material-symbols-outlined text-secondary-container text-[20px] shrink-0" aria-hidden="true">{{ toast.icon }}</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest truncate">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
