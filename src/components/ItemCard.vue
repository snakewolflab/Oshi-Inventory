<template>
  <div class="group cursor-pointer">
    <div class="aspect-[3/4] bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-2 relative btn-bounce">
      <span class="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[9px] font-black rounded-lg shadow-sm z-10 uppercase tracking-widest text-indigo-600">
        {{ item.category }}
      </span>
      <div :class="`w-full h-full ${item.color} flex items-center justify-center text-white opacity-80 group-hover:scale-110 transition-transform duration-500`">
        <ImageIcon :size="40" stroke-width="1.5" />
      </div>
    </div>
    <div class="px-2">
      <h4 class="text-xs font-bold text-slate-800 truncate">{{ item.name }}</h4>
      <p class="text-[10px] font-medium text-slate-400">{{ item.date }}</p>
    </div>
  </div>
</template>

<script setup>
import { Image as ImageIcon } from 'lucide-vue-next'
defineProps(['item'])
</script>