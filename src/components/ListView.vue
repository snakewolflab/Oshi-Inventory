<template>
  <div class="space-y-3">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div :class="`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white shrink-0 shadow-inner text-opacity-80`">
        <ImageIcon :size="24" />
      </div>

      <div class="flex-grow min-w-0">
        <h4 class="font-bold text-sm text-slate-800 truncate">{{ item.name }}</h4>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">{{ item.category }}</span>
          <span class="text-[10px] text-slate-400 font-medium">{{ item.date }}</span>
        </div>
      </div>

      <ChevronRightIcon :size="18" class="text-slate-300" />
    </div>
  </div>
</template>

<script setup>
import { Image as ImageIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

defineProps({
  items: Array
})
</script>