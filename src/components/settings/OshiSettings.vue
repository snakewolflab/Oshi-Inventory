<template>
  <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
    
    <div v-if="userSettings.oshis && userSettings.oshis.length > 0" class="space-y-3">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">My Oshi List</label>
      <div class="flex flex-wrap gap-3">
        <div 
          v-for="oshi in userSettings.oshis" 
          :key="oshi.id"
          @click="selectOshiFromList(oshi)" 
          class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer active:scale-95"
          :class="userSettings.oshiName === oshi.name ? 'border-brand bg-brand-light' : 'border-slate-100 bg-white'"
        >
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-sm" :style="{ backgroundColor: oshi.color }"></div>
          <span class="text-xs font-bold text-slate-700">{{ oshi.name }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
      
      <div class="relative">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">推しの名前を追加・変更</label>
        <input 
          v-model="oshiName" 
          type="text" 
          placeholder="推しの名前を入力..." 
          class="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-brand/20 transition-all outline-none" 
        />
        
        <transition name="fade">
          <div v-if="suggestions.length > 0" class="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              v-for="person in suggestions" 
              :key="person.name"
              @click="applySuggestion(person)"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm whitespace-nowrap hover:border-brand/30 transition-colors active:scale-95"
            >
              <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: person.color }"></div>
              <span class="text-[11px] font-bold text-slate-600">{{ person.name }}</span>
            </button>
          </div>
        </transition>
      </div>

      <div class="pt-4 border-t border-slate-50">
        <div class="flex items-center justify-between mb-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">テーマカラー</label>
          <span class="text-[10px] font-mono text-slate-300">{{ oshiColor.toUpperCase() }}</span>
        </div>
        <div class="flex items-center gap-6">
          <div 
            class="w-20 h-20 rounded-[2.5rem] shadow-xl border-4 border-white transition-all duration-500 flex items-center justify-center text-white" 
            :style="{ backgroundColor: oshiColor }"
          >
            <HeartIcon :size="32" fill="currentColor" class="opacity-30" />
          </div>
          <div class="flex-grow">
            <input 
              v-model="oshiColor" 
              type="color" 
              class="w-full h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden" 
            />
            <p class="text-[9px] text-slate-400 mt-2 font-medium">※色をタップしてカスタムカラーを選択できます</p>
          </div>
        </div>
      </div>
    </div>

    <button 
      @click="handleSave" 
      class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg btn-bounce active:scale-95 transition-transform"
    >
      この推しをメインに設定
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Heart as HeartIcon } from 'lucide-vue-next'
// パスが正しいか確認してください
import oshiConfig from '../../data/oshi-config.json'

const props = defineProps({
  userSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save'])

const oshiName = ref('')
const oshiColor = ref('#6366f1')

// 初期値をセット
onMounted(() => {
  oshiName.value = props.userSettings.oshiName || ''
  oshiColor.value = props.userSettings.oshiColor || '#6366f1'
})

// 🔍 予測変換ロジック
const suggestions = computed(() => {
  const query = oshiName.value.trim().toLowerCase()
  if (!query || query.length < 1) return []

  return oshiConfig.oshi_masters.filter(person => {
    const nameMatch = person.name.toLowerCase().includes(query)
    const groupMatch = person.groups?.some(g => g.toLowerCase().includes(query))
    return nameMatch || groupMatch
  }).slice(0, 5)
})

// 1. リストから既存の推しを選ぶ
const selectOshiFromList = (oshi) => {
  oshiName.value = oshi.name
  oshiColor.value = oshi.color
}

// 2. 予測変換から選ぶ
const applySuggestion = (person) => {
  oshiName.value = person.name
  oshiColor.value = person.color
}

// 保存
const handleSave = () => {
  if (!oshiName.value.trim()) return
  emit('save', { 
    name: oshiName.value, 
    color: oshiColor.value 
  })
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.bg-brand-light { background-color: var(--brand-color-light); }
.border-brand { border-color: var(--brand-color); }
</style>