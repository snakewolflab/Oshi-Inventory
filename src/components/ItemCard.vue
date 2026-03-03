<template>
  <div class="group cursor-pointer" @click="$emit('click')">
    <div class="aspect-[3/4] bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-2 relative btn-bounce transition-all duration-300 group-hover:shadow-md">
      
      <span class="absolute top-3 left-3 px-2 py-1 bg-white/95 backdrop-blur text-[8px] font-black rounded-lg shadow-sm z-10 uppercase tracking-widest text-slate-700">
        {{ item.category }}
      </span>

      <div 
        class="w-full h-full flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110"
        :style="{ backgroundColor: item.color || '#e2e8f0' }"
      >
        <ImageIcon :size="40" stroke-width="1.2" class="opacity-40 group-hover:opacity-60 transition-opacity" />
        
        <div v-if="item.price" class="absolute bottom-3 right-3 px-2 py-0.5 bg-black/20 backdrop-blur-md rounded-lg">
          <p class="text-[9px] font-black text-white">¥{{ item.price.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="px-2 space-y-0.5">
      <h4 class="text-[11px] font-black text-slate-800 truncate tracking-tight">{{ item.name }}</h4>
      
      <div class="flex items-center justify-between">
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ item.oshiName || 'No Link' }}</p>
        <p class="text-[9px] font-medium text-slate-300">{{ item.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Image as ImageIcon } from 'lucide-vue-next'

defineEmits(['click'])
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* App.vueで定義したbtn-bounceを利用 */
.btn-bounce:active {
  transform: scale(0.96);
}
</style>