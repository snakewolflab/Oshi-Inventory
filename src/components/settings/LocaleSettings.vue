<template>
  <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      
      <div class="p-6 border-b border-slate-50">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">Display Language</label>
        <div class="grid grid-cols-1 gap-2">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            @click="selectedLang = lang.code"
            :class="[
              'flex items-center justify-between p-4 rounded-2xl transition-all border',
              selectedLang === lang.code 
                ? 'bg-brand-light border-brand/20 ring-1 ring-brand/10' 
                : 'bg-slate-50 border-transparent hover:bg-slate-100'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ lang.flag }}</span>
              <span class="font-bold text-sm" :class="selectedLang === lang.code ? 'text-brand' : 'text-slate-700'">
                {{ lang.name }}
              </span>
            </div>
            <div v-if="selectedLang === lang.code" class="w-5 h-5 bg-brand rounded-full flex items-center justify-center shadow-sm">
              <CheckIcon :size="12" class="text-white" stroke-width="4" />
            </div>
          </button>
        </div>
      </div>

      <div class="p-6">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">Region / Location</label>
        <div class="relative group">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <GlobeIcon :size="18" />
          </div>
          <select 
            v-model="selectedRegion"
            class="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
          >
            <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <ChevronDownIcon :size="18" />
          </div>
        </div>
        <p class="mt-4 text-[10px] text-slate-400 font-medium px-2 leading-relaxed">
          ※地域設定を変更すると、通貨単位や日付の表示形式が自動的に調整されます。
        </p>
      </div>

    </div>

    <button 
      @click="handleSave"
      class="w-full py-4 bg-brand text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all btn-bounce"
    >
      設定を適用する
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Check as CheckIcon, Globe as GlobeIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next'

// 親(App.vue)から現在の設定を受け取る
const props = defineProps({
  currentLang: String,
  currentRegion: String
})

const emit = defineEmits(['save'])

const selectedLang = ref('ja')
const selectedRegion = ref('Japan (JP)')

// 初期化時に親のデータを反映
onMounted(() => {
  if (props.currentLang) selectedLang.value = props.currentLang
  if (props.currentRegion) selectedRegion.value = props.currentRegion
})

const languages = [
  { name: '日本語', code: 'ja', flag: '🇯🇵' },
  { name: 'English', code: 'en', flag: '🇺🇸' },
  { name: '한국어', code: 'ko', flag: '🇰🇷' },
  { name: '简体中文', code: 'zh', flag: '🇨🇳' }
]

const regions = [
  'Japan (JP)',
  'United States (US)',
  'South Korea (KR)',
  'United Kingdom (UK)',
  'Taiwan (TW)',
  'Other'
]

// 保存実行
const handleSave = () => {
  emit('save', {
    lang: selectedLang.value,
    region: selectedRegion.value
  })
  // ユーザーへのフィードバック
  alert('Language and Region settings updated!')
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* 背景色のブランドカラー対応 */
.bg-brand-light {
  background-color: var(--brand-color-light);
}
.bg-brand {
  background-color: var(--brand-color);
}
.text-brand {
  color: var(--brand-color);
}
.border-brand {
  border-color: var(--brand-color);
}
</style>