<template>
  <header class="header-blur sticky top-0 z-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
    <div class="w-10">
      <button class="p-2 hover:bg-slate-100 rounded-full btn-bounce"><MenuIcon :size="20" class="text-slate-600" /></button>
    </div>
    <div class="flex flex-col items-center">
      <h1 class="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none mb-1">My Inventory</h1>
      <div class="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">推しログ</div>
    </div>
    <div class="w-10 flex justify-end">
      <button class="p-2 hover:bg-slate-100 rounded-full btn-bounce relative">
        <BellIcon :size="20" class="text-slate-600" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { Menu as MenuIcon, Bell as BellIcon } from 'lucide-vue-next'
</script>