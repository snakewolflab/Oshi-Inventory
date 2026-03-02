<template>
  <div class="card-glass p-6 rounded-[2.5rem] shadow-sm overflow-hidden relative">
    <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>
    <h3 class="font-bold text-slate-400 text-xs mb-4 uppercase tracking-tighter">Collection Status</h3>
    <div class="flex items-baseline gap-1">
      <span class="text-5xl font-black text-slate-800 tracking-tighter">{{ count }}</span>
      <span class="text-slate-400 font-bold">pcs</span>
    </div>
    <div class="mt-6 flex items-center gap-2">
      <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="text-[10px] font-black text-indigo-600">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup>
defineProps(['count', 'progress'])
</script>