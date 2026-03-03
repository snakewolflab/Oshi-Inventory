<template>
  <header class="header-blur sticky top-0 z-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
    <div class="flex flex-col items-center gap-1">
      <h1 class="text-[9px] font-black tracking-widest text-slate-400 uppercase leading-none mb-1">My Inventory</h1>
      <div class="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
        推しログ
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div v-if="user" class="hidden sm:block text-right">
        <p class="text-[10px] font-black text-slate-800 leading-none">{{ user.displayName }}</p>
        <p class="text-[8px] font-bold text-slate-400">Collector</p>
      </div>

      <button 
        @click="$emit('logout')" 
        class="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all btn-bounce border border-slate-100 group"
        title="ログアウト"
      >
        <LogOutIcon :size="18" class="group-hover:text-pink-500 transition-colors" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { LogOut as LogOutIcon } from 'lucide-vue-next'

// App.vue からユーザー情報を受け取る
defineProps({
  user: {
    type: Object,
    default: null
  }
})

defineEmits(['logout'])
</script>

<style scoped>
.header-blur {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
}
</style>