<template>
  <div class="space-y-6">
    <div class="sticky top-16 z-30 bg-slate-50/80 backdrop-blur-md py-2">
      <div class="relative group">
        <SearchIcon 
          class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
          :size="20" 
        />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="グッズ名や作品名で検索..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
        />
      </div>
    </div>

    <section>
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Quick Filter</h3>
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = (selectedCategory === cat ? '' : cat)"
          :class="[
            'px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
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
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Results ({{ filteredItems.length }})</h3>
      </div>

      <div v-if="filteredItems.length > 0" class="grid grid-cols-1 gap-3">
        <div 
          v-for="item in filteredItems" 
          :key="item.id" 
          @click="$emit('item-click', item)"
          class="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div :class="`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white shrink-0 opacity-60`">
            <ImageIcon :size="20" />
          </div>
          <div class="flex-grow min-w-0">
            <h4 class="font-bold text-sm text-slate-800 truncate">{{ item.name }}</h4>
            <p class="text-[10px] text-slate-400 font-bold uppercase">{{ item.category }}</p>
          </div>
          <ChevronRightIcon :size="16" class="text-slate-300" />
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="inline-flex p-6 bg-slate-100 rounded-full mb-4">
          <PackageSearchIcon :size="40" class="text-slate-300" />
        </div>
        <p class="text-slate-400 font-bold text-sm">見つかりませんでした</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search as SearchIcon, 
  Image as ImageIcon, 
  ChevronRight as ChevronRightIcon,
  PackageSearch as PackageSearchIcon 
} from 'lucide-vue-next'

defineEmits(['item-click'])
const props = defineProps({
  items: Array
})

const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ['Badge', 'Acrylic', 'Photo', 'Light', 'Wear', 'Keyring']

// 検索とフィルターのロジック
const filteredItems = computed(() => {
  return props.items.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value ? item.category === selectedCategory.value : true
    return matchesQuery && matchesCategory
  })
})
</script>

<style scoped>
/* 横スクロールのバーを隠す（モダンなUI用） */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>