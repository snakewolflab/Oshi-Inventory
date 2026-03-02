<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-grow container mx-auto px-4 pt-6 pb-32 max-w-5xl">
      <transition name="fade" mode="out-in">
        <div :key="currentView">
          
          <div v-if="currentView === 'home'" class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section class="md:col-span-4">
              <SummaryCard :count="items.length" :progress="65" />
            </section>
            
            <section class="md:col-span-8">
              <div class="flex items-center justify-between mb-6 px-2">
                <h2 class="font-black text-xl text-slate-800 tracking-tight">最近の追加</h2>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ItemCard 
                  v-for="item in items" 
                  :key="item.id" 
                  :item="item" 
                  @click="openDetail(item)" 
                />
              </div>
            </section>
          </div>

          <div v-else-if="currentView === 'search'">
            <h2 class="text-2xl font-black px-1 mb-4 text-slate-800 tracking-tight">Search</h2>
            <SearchView :items="items" @select-item="openDetail" />
          </div>

          <div v-else-if="currentView === 'list'">
            <h2 class="text-2xl font-black px-1 mb-6 text-slate-800 tracking-tight">All Collections</h2>
            <ListView :items="items" @select-item="openDetail" />
          </div>

          <div v-else-if="currentView === 'user'">
            <h2 class="text-2xl font-black px-1 mb-6 text-slate-800 tracking-tight">Settings</h2>
            <UserView :itemCount="items.length" />
          </div>

        </div>
      </transition>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 header-blur border-t border-slate-100 px-8 py-2 pb-safe z-50 md:max-w-md md:mx-auto md:mb-6 md:rounded-full md:shadow-2xl md:border">
      <div class="flex justify-between items-center h-14">
        <NavButton @click="currentView = 'home'" :active="currentView === 'home'" icon="Home" label="Home" />
        <NavButton @click="currentView = 'search'" :active="currentView === 'search'" icon="Search" label="Search" />
        
        <button @click="isAddModalOpen = true" class="relative -translate-y-6 btn-bounce group">
          <div class="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border-4 border-white group-hover:bg-indigo-600 transition-colors">
            <PlusIcon :size="24" stroke-width="3" />
          </div>
        </button>

        <NavButton @click="currentView = 'list'" :active="currentView === 'list'" icon="Layers" label="List" />
        <NavButton @click="currentView = 'user'" :active="currentView === 'user'" icon="User" label="User" />
      </div>
    </nav>

    <AddItemModal :isOpen="isAddModalOpen" @close="isAddModalOpen = false" />
    <ItemDetailModal :item="selectedItem" @close="closeDetail" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

// 1. 画面表示状態の管理
const currentView = ref('home')
const isAddModalOpen = ref(false)
const selectedItem = ref(null)

// 2. データ管理 (本来はPiniaやLocalStorageで管理)
const items = ref([
  { id: 1, name: '2024アニバーサリー缶バッジ', category: 'Badge', date: '2024.03.01', color: 'bg-pink-400' },
  { id: 2, name: '夏制服Ver. アクリルスタンド', category: 'Acrylic', date: '2024.02.15', color: 'bg-indigo-400' },
  { id: 3, name: '限定撮り下ろしチェキ(サイン有)', category: 'Photo', date: '2024.02.10', color: 'bg-amber-400' },
  { id: 4, name: '公式ペンライト Vol.2', category: 'Light', date: '2024.01.28', color: 'bg-emerald-400' },
  { id: 5, name: 'ラバーキーホルダー', category: 'Keyring', date: '2024.01.20', color: 'bg-rose-400' },
  { id: 6, name: 'ライブTシャツ Lサイズ', category: 'Wear', date: '2024.01.15', color: 'bg-sky-400' },
])

// 3. 詳細表示ロジック
const openDetail = (item) => {
  selectedItem.value = item
}
const closeDetail = () => {
  selectedItem.value = null
}
</script>

<style>
/* 画面遷移のフェードアニメーション */
.fade-enter-active, .fade-leave-active {
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

/* ヘッダーのぼかし効果 */
.header-blur {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
}

/* iPhone等のセーフエリア対応用 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>