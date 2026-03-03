<template>
  <div class="space-y-6">
    <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-md py-2 -mx-4 px-4">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <button 
          @click="activeFilter = 'all'"
          :class="[
            'px-5 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap border-2',
            activeFilter === 'all' 
              ? 'bg-slate-900 border-slate-900 text-white' 
              : 'bg-white border-slate-100 text-slate-400'
          ]"
        >
          All
        </button>

        <button 
          v-for="oshi in oshis" 
          :key="oshi.id"
          @click="activeFilter = oshi.id"
          :class="[
            'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all border-2 whitespace-nowrap',
            activeFilter === oshi.id 
              ? 'border-brand bg-brand-light text-brand' 
              : 'bg-white border-slate-100 text-slate-400'
          ]"
        >
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: oshi.color }"></div>
          {{ oshi.name }}
        </button>
      </div>
    </div>

    <div v-if="filteredItems.length > 0" class="grid grid-cols-1 gap-4">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        @click="$emit('select-item', item)"
        class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
      >
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0" :style="{ backgroundColor: item.color || '#e2e8f0' }">
          <component :is="getIcon(item.category)" :size="20" />
        </div>

        <div class="flex-grow min-w-0">
          <h4 class="font-bold text-slate-800 text-sm truncate">{{ item.name }}</h4>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{{ item.category }}</span>
            <span class="text-[10px] font-bold text-slate-300">| {{ item.condition }}</span>
          </div>
        </div>

        <div class="text-right shrink-0">
          <p class="text-xs font-black text-slate-800">¥{{ item.price?.toLocaleString() || 0 }}</p>
          <p class="text-[9px] font-bold text-slate-300 mt-1">{{ item.date }}</p>
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center space-y-4">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
        <LayersIcon :size="32" />
      </div>
      <p class="text-slate-400 font-bold text-sm">該当するアイテムが見つかりません</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Layers as LayersIcon, 
  Box as BoxIcon, 
  Image as ImageIcon, 
  UserSquare as CardIcon, 
  Hash as HashIcon 
} from 'lucide-vue-next'

const props = defineProps({
  items: Array,
  oshis: Array // App.vueから推しリストを受け取る
})

defineEmits(['select-item'])

const activeFilter = ref('all')

// フィルタリングロジック
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return props.items
  return props.items.filter(item => item.oshiId === activeFilter.value)
})

// カテゴリに応じたアイコン
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
.bg-brand-light { background-color: var(--brand-color-light); }
.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
</style>