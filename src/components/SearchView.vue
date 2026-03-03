<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md py-4">
      <div class="relative group">
        <SearchIcon 
          class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" 
          :size="20" 
        />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="グッズ名や作品名、メモから検索..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all font-bold text-slate-700 outline-none"
        />
      </div>
    </div>

    <section v-if="oshis && oshis.length > 0">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Filter by Oshi</h3>
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        <button 
          v-for="oshi in oshis" 
          :key="oshi.id"
          @click="selectedOshiId = (selectedOshiId === oshi.id ? null : oshi.id)"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all border-2 whitespace-nowrap',
            selectedOshiId === oshi.id 
              ? 'border-brand bg-brand-light text-brand' 
              : 'bg-white border-slate-100 text-slate-400'
          ]"
        >
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: oshi.color }"></div>
          {{ oshi.name }}
        </button>
      </div>
    </section>

    <section>
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Category</h3>
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = (selectedCategory === cat ? '' : cat)"
          :class="[
            'px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border-2',
            selectedCategory === cat 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Results ({{ filteredItems.length }})
        </h3>
        <button v-if="hasActiveFilters" @click="resetFilters" class="text-[9px] font-black text-brand uppercase">Clear All</button>
      </div>

      <div v-if="filteredItems.length > 0" class="grid grid-cols-1 gap-3">
        <div 
          v-for="item in filteredItems" 
          :key="item.id" 
          @click="$emit('item-click', item)"
          class="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div 
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
            :style="{ backgroundColor: item.color || '#e2e8f0' }"
          >
            <component :is="getIcon(item.category)" :size="20" />
          </div>

          <div class="flex-grow min-w-0">
            <h4 class="font-bold text-sm text-slate-800 truncate">{{ item.name }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                {{ item.category }}
              </span>
              <span class="text-[10px] font-bold text-slate-300">{{ item.oshiName }}</span>
            </div>
          </div>
          
          <div class="text-right shrink-0">
            <p class="text-[11px] font-black text-slate-700">¥{{ item.price?.toLocaleString() }}</p>
            <ChevronRightIcon :size="16" class="text-slate-300 ml-auto mt-1" />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-24">
        <div class="inline-flex p-8 bg-slate-50 rounded-full mb-4 text-slate-200">
          <PackageSearchIcon :size="48" />
        </div>
        <p class="text-slate-400 font-bold text-sm">該当するアイテムがありません</p>
        <p class="text-[11px] text-slate-300 mt-2">条件を変えて試してみてください</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search as SearchIcon, 
  ChevronRight as ChevronRightIcon,
  PackageSearch as PackageSearchIcon,
  Box as BoxIcon,
  Image as ImageIcon,
  UserSquare as CardIcon,
  Hash as HashIcon,
  Layers as LayersIcon
} from 'lucide-vue-next'

const props = defineProps({
  items: Array,
  oshis: Array
})

defineEmits(['item-click'])

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedOshiId = ref(null)

const categories = ['Badge', 'Acrylic', 'Photo', 'Card', 'Other']

// 検索と複数フィルターの統合ロジック
const filteredItems = computed(() => {
  return props.items.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchesQuery = !q || 
      item.name.toLowerCase().includes(q) || 
      (item.memo && item.memo.toLowerCase().includes(q))
    
    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    const matchesOshi = !selectedOshiId.value || item.oshiId === selectedOshiId.value
    
    return matchesQuery && matchesCategory && matchesOshi
  })
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedOshiId.value
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedOshiId.value = null
}

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

.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
.bg-brand-light { background-color: var(--brand-color-light); }
</style>