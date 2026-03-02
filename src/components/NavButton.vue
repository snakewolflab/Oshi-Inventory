<template>
  <button 
    class="flex flex-col items-center justify-center w-12 transition-all duration-300 btn-bounce"
    :class="active ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-slate-600'"
  >
    <component :is="icons[icon]" :size="24" />
    <span class="text-[9px] font-black mt-1 uppercase tracking-tighter">{{ label }}</span>
  </button>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  active: Boolean,
  icon: String,
  label: String
})

// 使用するアイコンをマッピング
const icons = {
  Home: LucideIcons.Home,
  Search: LucideIcons.Search,
  Layers: LucideIcons.Layers,
  User: LucideIcons.User
}
</script>