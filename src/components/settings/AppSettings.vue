<template>
  <div class="space-y-4 animate-in slide-in-from-right-4 duration-300">
    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div 
        v-for="setting in settings" 
        :key="setting.id" 
        class="flex items-center justify-between p-6 border-b border-slate-50 last:border-none transition-colors"
      >
        <div class="flex-grow pr-4">
          <p class="font-bold text-slate-700 text-sm">{{ setting.label }}</p>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{{ setting.desc }}</p>
        </div>

        <div 
          @click="toggleSetting(setting)"
          :class="[
            'w-14 h-7 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner',
            setting.value ? 'bg-brand shadow-brand/20' : 'bg-slate-200'
          ]"
        >
          <div 
            :class="[
              'absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm flex items-center justify-center',
              setting.value ? 'left-8' : 'left-1'
            ]"
          >
            <div v-if="setting.value" class="w-1.5 h-1.5 rounded-full bg-brand/40"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6">
      <p class="text-[9px] text-slate-400 font-medium leading-relaxed">
        ※設定は自動的にデバイスへ保存されます。iCloud同期を有効にすると、ブラウザを跨いでコレクションを同期できる予定です（開発中）。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// 親(App.vue)から現在の設定状態を受け取る
const props = defineProps({
  currentSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

// 内部で管理するリスト形式の設定データ
const settings = ref([
  { id: 'dark', label: 'ダークモード', desc: '夜間の利用に最適化', value: false },
  { id: 'ic', label: 'iCloud同期', desc: '複数端末でデータを共有', value: true },
  { id: 'hint', label: '入力ヒントを表示', desc: '登録時に候補を提案', value: true }
])

// 1. 初期化: 親から届いた userSettings を反映
onMounted(() => {
  settings.value.forEach(s => {
    if (s.id === 'dark') s.value = props.currentSettings.darkMode
    // 他の項目も必要に応じてマッピング
  })
})

// 2. スイッチの切り替え
const toggleSetting = (setting) => {
  setting.value = !setting.value
  
  // App.vue 側に変更を通知
  if (setting.id === 'dark') {
    emit('update', { darkMode: setting.value })
  } else {
    // 他の項目（iCloud等）の更新も必要ならここでemit
    emit('update', { [setting.id]: setting.value })
  }
}

// 3. 監視 (予備): プロパティが外部から変わった場合にも対応
watch(() => props.currentSettings.darkMode, (newVal) => {
  const darkSetting = settings.value.find(s => s.id === 'dark')
  if (darkSetting) darkSetting.value = newVal
})
</script>

<style scoped>
/* App.vueで定義した変数をここでも利用 */
.bg-brand {
  background-color: var(--brand-color);
}
.shadow-brand\/20 {
  box-shadow: 0 4px 12px var(--brand-color-light);
}
</style>