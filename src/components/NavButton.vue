<template>
  <button 
    class="flex flex-col items-center justify-center w-12 transition-all duration-300 btn-bounce relative group"
    :class="active ? 'text-brand scale-110' : 'text-slate-300 hover:text-slate-500'"
  >
    <div v-if="active" class="absolute -inset-2 bg-brand-light rounded-full blur-xl opacity-50 -z-10"></div>
    
    <component :is="icons[icon]" :size="24" :stroke-width="active ? 3 : 2" />
    <span class="text-[9px] font-black mt-1 uppercase tracking-tighter transition-all">
      {{ label }}
    </span>

    <div v-if="active" class="w-1 h-1 bg-brand rounded-full mt-0.5 animate-pulse"></div>
  </button>
</template>

<script setup>
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  BarChart as BarChartIcon,
  Layers as LayersIcon, 
  User as UserIcon,
  Crown as PremiumIcon
} from 'lucide-vue-next'

const props = defineProps({
  active: Boolean,
  icon: String,
  label: String
})

const icons = {
  Home: HomeIcon,
  Search: SearchIcon,
  BarChart: BarChartIcon,
  Layers: LayersIcon,
  User: UserIcon,
  Premium: PremiumIcon
}
</script>

<style scoped>
.text-brand { color: var(--brand-color); }
.bg-brand-light { background-color: var(--brand-color-light); }
</style>