<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <section class="relative">
      <div class="card-glass p-8 rounded-[2.5rem] shadow-xl overflow-hidden border-none ring-1 ring-slate-100">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
        
        <div class="flex items-center gap-6 relative z-10">
          <div class="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <UserIcon :size="40" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">推し活マネージャー</h2>
            <p class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg inline-block mt-1 uppercase">Master Collector</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-8 border-t border-slate-100 pt-6">
          <div class="text-center">
            <p class="text-[10px] font-black text-slate-400 uppercase">Items</p>
            <p class="text-lg font-black text-slate-800">{{ itemCount }}</p>
          </div>
          <div class="text-center border-x border-slate-100">
            <p class="text-[10px] font-black text-slate-400 uppercase">Days</p>
            <p class="text-lg font-black text-slate-800">124</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-black text-slate-400 uppercase">Rank</p>
            <p class="text-lg font-black text-slate-800">S</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Account Settings</h3>
      
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div v-for="(item, index) in menuItems" :key="item.label">
          <button class="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors btn-bounce">
            <div class="flex items-center gap-4">
              <div :class="`p-2.5 rounded-xl ${item.bg} ${item.color}`">
                <component :is="item.icon" :size="20" />
              </div>
              <span class="font-bold text-slate-700 text-sm">{{ item.label }}</span>
            </div>
            <ChevronRightIcon :size="18" class="text-slate-300" />
          </button>
          <div v-if="index !== menuItems.length - 1" class="mx-5 h-[1px] bg-slate-50"></div>
        </div>
      </div>
    </section>

    <section class="px-2">
      <button class="w-full py-4 text-rose-500 font-bold text-sm bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors">
        データをリセットする
      </button>
      <p class="text-center text-[10px] text-slate-300 mt-4 font-medium uppercase tracking-widest">Version 1.0.4 Beta</p>
    </section>
    
    <div class="h-10"></div>
  </div>
</template>

<script setup>
import { 
  User as UserIcon, 
  ChevronRight as ChevronRightIcon, 
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Bell as BellIcon,
  ShieldCheck as ShieldIcon,
  CloudUpload as CloudIcon
} from 'lucide-vue-next'

defineProps({
  itemCount: Number
})

const menuItems = [
  { label: '推し設定の編集', icon: HeartIcon, bg: 'bg-pink-50', color: 'text-pink-500' },
  { label: '通知カスタマイズ', icon: BellIcon, bg: 'bg-indigo-50', color: 'text-indigo-500' },
  { label: 'データ同期・バックアップ', icon: CloudIcon, bg: 'bg-sky-50', color: 'text-sky-500' },
  { label: 'プライバシーポリシー', icon: ShieldIcon, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  { label: 'アプリの基本設定', icon: SettingsIcon, bg: 'bg-slate-50', color: 'text-slate-500' },
]
</script>