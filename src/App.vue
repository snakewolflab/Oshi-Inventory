<template>
  <div class="min-h-screen flex flex-col transition-colors duration-500">
    <AppHeader />

    <main class="flex-grow container mx-auto px-4 pt-6 pb-32 max-w-5xl">
      <transition name="fade" mode="out-in">
        <div :key="currentView">

          <div v-if="currentView === 'home'" class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section class="md:col-span-4">
              <SummaryCard :count="items.length" :progress="Math.min(items.length * 5, 100)" />
            </section>

            <section class="md:col-span-8">
              <div class="flex items-center justify-between mb-6 px-2">
                <h2 class="font-black text-xl text-slate-800 tracking-tight">最近の追加</h2>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ItemCard v-for="item in items.slice(0, 6)" :key="item.id" :item="item" @click="openDetail(item)" />
              </div>
            </section>
          </div>

          <div v-else-if="currentView === 'search'">
            <h2 class="text-2xl font-black px-1 mb-4 text-slate-800 tracking-tight">Search</h2>
            <SearchView :items="items" @select-item="openDetail" />
          </div>

          <div v-else-if="currentView === 'list'">
            <h2 class="text-2xl font-black px-1 mb-6 text-slate-800 tracking-tight">All Collections</h2>
            <ListView :items="items" :oshis="userSettings.oshis" @select-item="openDetail" />
          </div>

          <div v-else-if="currentView === 'user'">
            <h2 class="text-2xl font-black px-1 mb-6 text-slate-800 tracking-tight">Settings</h2>
            <UserView :userSettings="userSettings" :itemCount="items.length" @update-settings="updateSettings"
              @update-locale="updateLocale" @update-app="updateAppSettings" />
          </div>

          <div v-else-if="currentView === 'stats'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-slate-800 tracking-tight">Oshi Analytics</h2>
              <div class="px-3 py-1 bg-brand-light text-brand text-[10px] font-black rounded-full uppercase">Live Data
              </div>
            </div>
            <StatsView :items="items" :oshis="userSettings.oshis" />
          </div>

          <div v-else-if="currentView === 'premium'">
            <h2 class="text-2xl font-black px-1 mb-6 text-slate-800 tracking-tight">Premium</h2>
            <PremiumView :userSettings="userSettings" :items="items" />
          </div>
        </div>
      </transition>
    </main>

    <nav
      class="fixed bottom-0 left-0 right-0 header-blur border-t border-slate-100 px-8 py-2 pb-safe z-50 md:max-w-md md:mx-auto md:mb-6 md:rounded-full md:shadow-2xl md:border">
      <div class="flex justify-between items-center h-14">
        <NavButton @click="currentView = 'home'" :active="currentView === 'home'" icon="Home" label="Home" />
        <NavButton @click="currentView = 'search'" :active="currentView === 'search'" icon="Search" label="Search" />
        <NavButton @click="currentView = 'stats'" :active="currentView === 'stats'" icon="BarChart" label="Stats" />

        <button @click="isAddModalOpen = true" class="relative -translate-y-6 btn-bounce group">
          <div
            class="bg-brand text-white p-4 rounded-2xl shadow-xl border-4 border-white group-hover:opacity-90 transition-all">
            <PlusIcon :size="24" stroke-width="3" />
          </div>
        </button>

        <NavButton @click="currentView = 'list'" :active="currentView === 'list'" icon="Layers" label="List" />
        <NavButton @click="currentView = 'user'" :active="currentView === 'user'" icon="User" label="User" />
        <NavButton @click="currentView = 'premium'" :active="currentView === 'premium'" icon="Premium" label="Premium" />
      </div>
    </nav>

    <AddItemModal :isOpen="isAddModalOpen" :oshis="userSettings.oshis" @close="isAddModalOpen = false"
      @add-item="addItem" />

    <ItemDetailModal :item="selectedItem" @close="closeDetail" @delete-item="deleteItem" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Plus as PlusIcon } from 'lucide-vue-next'

// コンポーネントのインポート
import AppHeader from './components/AppHeader.vue'
import SummaryCard from './components/SummaryCard.vue'
import ItemCard from './components/ItemCard.vue'
import ListView from './components/ListView.vue'
import SearchView from './components/SearchView.vue'
import UserView from './components/UserView.vue'
import NavButton from './components/NavButton.vue'
import AddItemModal from './components/AddItemModal.vue'
import ItemDetailModal from './components/ItemDetailModal.vue'
import StatsView from './components/StatsView.vue'
import PremiumView from './components/PremiumView.vue'

// --- 1. アプリの状態管理 ---
const currentView = ref('home')
const isAddModalOpen = ref(false)
const selectedItem = ref(null)

// --- 2. データ管理 (LocalStorage連動) ---
const items = ref([])
const userSettings = ref({
  plan: 'Free', // 'Free' | 'Basic' | 'Pro' | 'Master'
  oshis: [],
  oshiName: '',
  oshiColor: '#6366f1', // デフォルト: Indigo
  language: 'ja',
  region: 'Japan (JP)',
  darkMode: false
})

// --- 3. 推し色の動的反映ロジック ---
const applyThemeColor = (color) => {
  if (!color) return
  document.documentElement.style.setProperty('--brand-color', color)
  // 背景用に透明度15%のカラーも生成
  document.documentElement.style.setProperty('--brand-color-light', `${color}26`)
}

// --- 4. ライフサイクル (読み込み) ---
onMounted(() => {
  // アイテム読み込み
  const savedItems = localStorage.getItem('oshilog_items')
  if (savedItems) items.value = JSON.parse(savedItems)

  // 設定読み込み
  const savedSettings = localStorage.getItem('oshilog_settings')
  if (savedSettings) {
    userSettings.value = JSON.parse(savedSettings)
    // 保存されていた色とモードを即時反映
    applyThemeColor(userSettings.value.oshiColor)
    document.documentElement.classList.toggle('dark', userSettings.value.darkMode)
  }
})

// --- 5. 永続化 (保存) ---
watch(items, (newVal) => {
  localStorage.setItem('oshilog_items', JSON.stringify(newVal))
}, { deep: true })

watch(userSettings, (newVal) => {
  localStorage.setItem('oshilog_settings', JSON.stringify(newVal))
  // 色が変わったらテーマを更新
  applyThemeColor(newVal.oshiColor)
  document.documentElement.classList.toggle('dark', newVal.darkMode)
}, { deep: true })

// --- 6. アクション関数 ---
const openDetail = (item) => { selectedItem.value = item }
const closeDetail = () => { selectedItem.value = null }

// 設定の更新
const updateSettings = (data) => {
  // 1. 基本設定の更新
  userSettings.value.oshiName = data.name
  userSettings.value.oshiColor = data.color

  // 2. oshis 配列が存在しない場合の初期化（エラー防止のガード）
  if (!userSettings.value.oshis) {
    userSettings.value.oshis = []
  }

  // 3. 重複チェックと追加 (safe-check)
  const exists = userSettings.value.oshis.some(o => o.name === data.name)
  if (!exists && data.name) {
    userSettings.value.oshis.push({
      id: Date.now(),
      name: data.name,
      color: data.color
    })
  }
}

const updateLocale = (data) => {
  userSettings.value.language = data.lang
  userSettings.value.region = data.region
}

const updateAppSettings = (data) => {
  userSettings.value.darkMode = data.darkMode
}

// アイテムの操作
const addItem = (newItem) => {
  items.value.unshift({
    id: Date.now(),
    ...newItem,
    // アイテム自体の色も、デフォルトで今の推し色（のクラス）にしても良い
    color: 'bg-brand'
  })
}

const deleteItem = (id) => {
  if (confirm('このアイテムを削除してもよろしいですか？')) {
    items.value = items.value.filter(item => item.id !== id)
    selectedItem.value = null
  }
}

// App.vue 内
const updatePlan = (data) => {
  userSettings.value.plan = data.plan
  // ここでサーバーに決済情報を送るなどの処理が入る想定
  saveSettings() 
  alert(`${data.plan} プランへアップグレードしました！`)
}
</script>

<style>
/* CSS変数とカスタムクラス */
:root {
  --brand-color: #6366f1;
  --brand-color-light: rgba(99, 102, 241, 0.15);
}

.bg-brand {
  background-color: var(--brand-color) !important;
}

.text-brand {
  color: var(--brand-color) !important;
}

.border-brand {
  border-color: var(--brand-color) !important;
}

.bg-brand-light {
  background-color: var(--brand-color-light) !important;
}

/* 画面遷移アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ヘッダーぼかし */
.header-blur {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
}

/* ダークモード時の調整 (簡易) */
.dark body {
  background-color: #0f172a;
  color: white;
}

.dark .header-blur {
  background-color: rgba(15, 23, 42, 0.85);
  border-color: #1e293b;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>