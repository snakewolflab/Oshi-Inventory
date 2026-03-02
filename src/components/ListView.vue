<template>
  <div class="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
    >
      <div :class="`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white shrink-0 shadow-inner relative overflow-hidden text-opacity-90`">
        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <ImageIcon :size="28" stroke-width="1.5" />
      </div>

      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-black uppercase tracking-wider">
            {{ item.category }}
          </span>
          <span class="text-[10px] text-slate-300 font-medium">{{ item.date }}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-800 truncate tracking-tight">
          {{ item.name }}
        </h4>
      </div>

      <div class="flex items-center text-slate-300 group-hover:text-indigo-500 transition-colors">
        <ChevronRightIcon :size="20" />
      </div>
    </div>

    <div v-if="items.length === 0" class="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
      <p class="text-slate-400 font-bold text-sm">コレクションがまだありません</p>
    </div>
    
    <div class="h-10"></div>
  </div>
</template>

<script setup>
import { Image as ImageIcon, ChevronRightIcon } from 'lucide-vue-next'

defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>