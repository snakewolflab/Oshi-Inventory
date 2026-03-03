<template>
  <div class="space-y-8 pb-32 animate-in fade-in duration-700">
    
    <div class="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-100">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button 
          @click="activeFilter = 'all'"
          :class="['px-6 py-2.5 rounded-full text-[10px] font-black transition-all border-2 whitespace-nowrap uppercase tracking-widest', 
            activeFilter === 'all' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400']"
        >
          All Oshi Stats
        </button>
        <button 
          v-for="oshi in oshis" :key="oshi.id"
          @click="activeFilter = oshi.id"
          :class="['flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black transition-all border-2 whitespace-nowrap uppercase tracking-widest',
            activeFilter === oshi.id ? 'border-brand bg-brand-light text-brand shadow-md' : 'bg-white border-slate-100 text-slate-400']"
        >
          <div class="w-2 h-2 rounded-full shadow-sm" :style="{ backgroundColor: oshi.color }"></div>
          {{ oshi.name }}
        </button>
      </div>
    </div>

    <section class="space-y-6">
      <div class="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand opacity-20 blur-[50px] rounded-full"></div>
        <div class="relative z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Investment</p>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black tracking-tighter">¥{{ totalAmount.toLocaleString() }}</span>
            <span class="text-sm font-bold text-slate-400">{{ activeFilter === 'all' ? 'Total' : 'for Oshi' }}</span>
          </div>
          
          <div class="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
              <p class="text-[9px] font-bold text-slate-500 uppercase">Items</p>
              <p class="text-lg font-black">{{ filteredItems.length }} <span class="text-[10px] text-slate-500">pcs</span></p>
            </div>
            <div>
              <p class="text-[9px] font-bold text-slate-500 uppercase">Avg Price</p>
              <p class="text-lg font-black">¥{{ avgPrice.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
        <h3 class="text-[10px] font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <PieChartIcon :size="14" class="text-brand" />
          Category Breakdown
        </h3>
        <div class="space-y-4">
          <div v-for="stat in categoryStats" :key="stat.name" class="space-y-1.5">
            <div class="flex justify-between items-end">
              <span class="text-[11px] font-bold text-slate-600">{{ stat.name }}</span>
              <span class="text-[10px] font-black text-slate-400">{{ stat.count }}pcs ({{ stat.percent }}%)</span>
            </div>
            <div class="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand rounded-full transition-all duration-1000" 
                :style="{ width: stat.percent + '%', backgroundColor: activeFilter === 'all' ? '#1e293b' : undefined }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <div class="flex bg-slate-200/50 p-1 rounded-xl">
          <button 
            v-for="option in sortOptions" 
            :key="option.value"
            @click="sortBy = option.value"
            :class="[
              'px-3 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-tighter',
              sortBy === option.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-500'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
        <SortIcon :size="14" class="text-slate-300" />
      </div>

      <div v-if="sortedItems.length > 0" class="grid grid-cols-1 gap-3">
        <div 
          v-for="item in sortedItems" 
          :key="item.id"
          @click="$emit('select-item', item)"
          class="group bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all hover:shadow-md"
        >
          <div 
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover:scale-105" 
            :style="{ backgroundColor: item.color || '#e2e8f0' }"
          >
            <component :is="getIcon(item.category)" :size="20" />
          </div>

          <div class="flex-grow min-w-0">
            <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-brand transition-colors">
              {{ item.name }}
            </h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {{ item.category }}
              </span>
              <span v-if="item.condition" class="text-[9px] font-bold text-slate-300 truncate">
                {{ item.condition }}
              </span>
            </div>
          </div>

          <div class="text-right shrink-0">
            <p class="text-xs font-black text-slate-900">
              ¥{{ item.price?.toLocaleString() || 0 }}
            </p>
            <p class="text-[9px] font-bold text-slate-300 mt-1 uppercase">
              {{ item.date }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="py-20 text-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
          <LayersIcon :size="32" />
        </div>
        <p class="text-slate-400 font-bold text-sm">No items found</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  PieChart as PieChartIcon,
  Layers as LayersIcon, 
  Box as BoxIcon, 
  Image as ImageIcon, 
  UserSquare as CardIcon, 
  Hash as HashIcon,
  ArrowUpDown as SortIcon
} from 'lucide-vue-next'

const props = defineProps({
  items: Array,
  oshis: Array
})

defineEmits(['select-item'])

// 状態管理
const activeFilter = ref('all')
const sortBy = ref('newest')

const sortOptions = [
  { label: 'お迎え順', value: 'newest' },
  { label: '価格順', value: 'price-desc' },
  { label: '名前順', value: 'name' }
]

// 1. フィルタリング（共通）
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return props.items
  return props.items.filter(item => item.oshiId === activeFilter.value)
})

// 2. 統計計算
const totalAmount = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (item.price || 0), 0)
})

const avgPrice = computed(() => {
  if (filteredItems.value.length === 0) return 0
  return Math.floor(totalAmount.value / filteredItems.value.length)
})

const categoryStats = computed(() => {
  const categories = ['Badge', 'Acrylic', 'Photo', 'Card', 'Other']
  const total = filteredItems.value.length
  if (total === 0) return []
  return categories.map(cat => {
    const count = filteredItems.value.filter(i => i.category === cat).length
    return { name: cat, count, percent: Math.round((count / total) * 100) }
  }).filter(s => s.count > 0)
})

// 3. ソート済みアイテム（リスト用）
const sortedItems = computed(() => {
  let result = [...filteredItems.value]
  return result.sort((a, b) => {
    if (sortBy.value === 'newest') return b.id - a.id
    if (sortBy.value === 'price-desc') return (b.price || 0) - (a.price || 0)
    if (sortBy.value === 'name') return a.name.localeCompare(b.name, 'ja')
    return 0
  })
})

const getIcon = (cat) => {
  switch (cat) {
    case 'Badge': return HashIcon
    case 'Acrylic': return BoxIcon
    case 'Photo': return ImageIcon
    case 'Card': return CardIcon
    default: return LayersIcon
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.bg-brand { background-color: var(--brand-color); }
.bg-brand-light { background-color: var(--brand-color-light); }
.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
</style>