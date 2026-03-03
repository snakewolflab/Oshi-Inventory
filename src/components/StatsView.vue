<template>
  <div class="space-y-8 pb-20 animate-in fade-in duration-700">
    
    <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-md py-2 -mx-4 px-4">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button 
          @click="activeFilter = 'all'"
          :class="['px-6 py-2.5 rounded-full text-xs font-black transition-all border-2 whitespace-nowrap', 
            activeFilter === 'all' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400']"
        >
          Total Stats
        </button>
        <button 
          v-for="oshi in oshis" :key="oshi.id"
          @click="activeFilter = oshi.id"
          :class="['flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all border-2 whitespace-nowrap',
            activeFilter === oshi.id ? 'border-brand bg-brand-light text-brand' : 'bg-white border-slate-100 text-slate-400']"
        >
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: oshi.color }"></div>
          {{ oshi.name }}
        </button>
      </div>
    </div>

    <div class="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand opacity-20 blur-[50px] rounded-full"></div>
      
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Investment</p>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-black tracking-tighter">¥{{ totalAmount.toLocaleString() }}</span>
          <span class="text-sm font-bold text-slate-400">Total</span>
        </div>
        
        <div class="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
          <div>
            <p class="text-[9px] font-bold text-slate-500 uppercase">Item Count</p>
            <p class="text-lg font-black">{{ filteredItems.length }} <span class="text-[10px] text-slate-500">pcs</span></p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-slate-500 uppercase">Avg Price</p>
            <p class="text-lg font-black">¥{{ avgPrice.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <h3 class="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
        <PieChartIcon :size="18" class="text-brand" />
        Category Breakdown
      </h3>
      
      <div class="space-y-5">
        <div v-for="stat in categoryStats" :key="stat.name" class="space-y-2">
          <div class="flex justify-between items-end">
            <span class="text-xs font-bold text-slate-600">{{ stat.name }}</span>
            <span class="text-[10px] font-black text-slate-400">{{ stat.count }}個 ({{ stat.percent }}%)</span>
          </div>
          <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
            <div 
              class="h-full bg-brand rounded-full transition-all duration-1000" 
              :style="{ width: stat.percent + '%', backgroundColor: activeFilter === 'all' ? '#1e293b' : undefined }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
        <p class="text-[10px] font-black text-indigo-400 uppercase mb-2">Mint Condition</p>
        <p class="text-2xl font-black text-indigo-900">{{ mintCount }}<span class="text-xs ml-1 opacity-50">個</span></p>
        <p class="text-[9px] font-bold text-indigo-300 mt-1">新品・未開封のアイテム</p>
      </div>
      <div class="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100/50">
        <p class="text-[10px] font-black text-rose-400 uppercase mb-2">Used / Others</p>
        <p class="text-2xl font-black text-rose-900">{{ filteredItems.length - mintCount }}<span class="text-xs ml-1 opacity-50">個</span></p>
        <p class="text-[9px] font-bold text-rose-300 mt-1">開封済み・中古アイテム</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PieChart as PieChartIcon } from 'lucide-vue-next'

const props = defineProps({
  items: Array,
  oshis: Array
})

const activeFilter = ref('all')

// 1. フィルタリングされたアイテム
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return props.items
  return props.items.filter(item => item.oshiId === activeFilter.value)
})

// 2. 合計金額の計算
const totalAmount = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (item.price || 0), 0)
})

// 3. 平均単価
const avgPrice = computed(() => {
  if (filteredItems.value.length === 0) return 0
  return Math.floor(totalAmount.value / filteredItems.value.length)
})

// 4. カテゴリ別の統計
const categoryStats = computed(() => {
  const categories = ['Badge', 'Acrylic', 'Photo', 'Card', 'Other']
  const total = filteredItems.value.length
  if (total === 0) return []

  return categories.map(cat => {
    const count = filteredItems.value.filter(i => i.category === cat).length
    return {
      name: cat,
      count: count,
      percent: Math.round((count / total) * 100)
    }
  }).filter(s => s.count > 0) // 0個のカテゴリは非表示
})

// 5. 新品・未開封のカウント
const mintCount = computed(() => {
  return filteredItems.value.filter(i => i.condition === '新品・未開封').length
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.bg-brand { background-color: var(--brand-color); }
.bg-brand-light { background-color: var(--brand-color-light); }
.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
</style>