<template>
  <div class="min-h-[60vh]">
    <transition name="slide-fade" mode="out-in">
      <div v-if="!activeSubViewId" class="space-y-6 animate-in fade-in duration-500">

        <div class="px-2 py-4 flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand border-2 border-brand/20 shadow-sm transition-colors duration-500">
            <HeartIcon :size="28" fill="currentColor" class="opacity-80" />
          </div>
          <div>
            <h4 class="font-black text-slate-800 text-lg">{{ userSettings.oshiName || '推し未設定' }}</h4>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Collections: {{ itemCount }} Items
            </p>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <button v-for="item in menuItems" :key="item.id" @click="activeSubViewId = item.id"
            class="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all group active:scale-[0.98]">
            <div class="flex items-center gap-4">
              <div :class="`p-3 rounded-2xl transition-transform group-hover:scale-110 ${item.bg} ${item.color}`">
                <component :is="item.icon" :size="20" />
              </div>
              <span class="font-bold text-slate-700 text-sm">{{ item.label }}</span>
            </div>
            <ChevronRightIcon :size="18" class="text-slate-300 group-hover:text-brand transition-colors" />
          </button>
        </div>

        <div class="px-4 pt-4">
          <button @click="$emit('logout')" class="w-full py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors">
            ログアウト
          </button>
        </div>
      </div>

      <div v-else class="pb-10">
        <div class="flex items-center gap-4 mb-8">
          <button @click="activeSubViewId = null"
            class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:text-brand hover:border-brand/20 transition-all active:scale-90">
            <ArrowLeftIcon :size="20" />
          </button>
          <div>
            <h3 class="text-lg font-black text-slate-800 leading-none">{{ currentTitle }}</h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Preferences</p>
          </div>
        </div>

        <OshiSettings 
          v-if="activeSubViewId === 'oshi'" 
          :userSettings="userSettings" 
          @save="$emit('update-settings', $event)"
          @remove-oshi="$emit('remove-oshi', $event)" 
        />

        <LocaleSettings 
          v-else-if="activeSubViewId === 'locale'" 
          :userSettings="userSettings"
          @save="(data) => $emit('update-locale', data)" 
        />

        <AppSettings 
          v-else-if="activeSubViewId === 'app'" 
          :userSettings="userSettings"
          @update="(data) => $emit('update-app', data)" 
        />

        <div v-else class="py-20 text-center text-slate-300">
          <p class="font-bold">Coming Soon...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ChevronRight as ChevronRightIcon,
  ArrowLeft as ArrowLeftIcon,
  Heart as HeartIcon,
  Settings as SettingsIcon,
  Globe as GlobeIcon
} from 'lucide-vue-next'

// コンポーネント名の統一
import OshiSettings from './settings/OshiSettings.vue'
import AppSettings from './settings/AppSettings.vue'
import LocaleSettings from './settings/LocaleSettings.vue'

const props = defineProps({
  userSettings: {
    type: Object,
    required: true
  },
  itemCount: {
    type: Number,
    default: 0
  }
})

// emitの定義を確実に
defineEmits(['update-settings', 'remove-oshi', 'logout', 'update-locale', 'update-app'])

const activeSubViewId = ref(null)

const menuItems = [
  { id: 'oshi', label: '推し設定', icon: HeartIcon, bg: 'bg-pink-50', color: 'text-pink-500' },
  { id: 'locale', label: '言語・地域設定', icon: GlobeIcon, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  { id: 'app', label: 'アプリの基本設定', icon: SettingsIcon, bg: 'bg-slate-50', color: 'text-slate-500' }
]

const currentTitle = computed(() => {
  return menuItems.find(m => m.id === activeSubViewId.value)?.label || ''
})
</script>