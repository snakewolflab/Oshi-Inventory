<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-grow container mx-auto px-4 pt-6 pb-28 max-w-5xl">
      <transition name="fade" mode="out-in">
        <div :key="currentView">

          <div v-if="currentView === 'home'" class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section class="md:col-span-4">
              <SummaryCard :count="items.length" :progress="65" />
            </section>

            <section class="md:col-span-8">
              <div class="flex items-center justify-between mb-6 px-2">
                <h2 class="font-black text-xl text-slate-800">最近の追加</h2>
                <button class="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <FilterIcon :size="16" class="text-slate-400" />
                </button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ItemCard v-for="item in items" :key="item.id" :item="item" />
              </div>
            </section>
          </div>

          <div v-else-if="currentView === 'search'">
            <h2 class="text-2xl font-black px-1 mb-4 text-slate-800 tracking-tight">Search</h2>
            <SearchView :items="items" />
          </div>

          <div v-else-if="currentView === 'list'">
            <h2 class="text-2xl font-black px-2 mb-6">全コレクション</h2>
            <div class="grid grid-cols-1 gap-3">
              <div v-for="item in items" :key="item.id"
                class="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div
                  :class="`w-14 h-14 rounded-xl ${item.color} opacity-50 flex items-center justify-center text-white`">
                  <ImageIcon :size="20" />
                </div>
                <div class="flex-grow">
                  <h4 class="font-bold text-sm">{{ item.name }}</h4>
                  <p class="text-[10px] text-slate-400">{{ item.category }}</p>
                </div>
                <ChevronRightIcon :size="16" class="text-slate-300" />
              </div>
            </div>
          </div>

        </div>
      </transition>
    </main>

    <nav
      class="fixed bottom-0 left-0 right-0 header-blur border-t border-slate-100 px-8 py-2 pb-safe z-50 md:max-w-md md:mx-auto md:mb-6 md:rounded-full md:shadow-2xl md:border">
      <div class="flex justify-between items-center h-14">
        <NavButton @click="currentView = 'home'" :active="currentView === 'home'" icon="Home" label="Home" />
        <NavButton @click="currentView = 'search'" :active="currentView === 'search'" icon="Search" label="Search" />

        <button @click="isModalOpen = true" class="relative -translate-y-6 btn-bounce group">
          <div
            class="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border-4 border-white group-hover:bg-indigo-600 transition-colors">
            <PlusIcon :size="24" stroke-width="3" />
          </div>
        </button>

        <AddItemModal :isOpen="isModalOpen" @close="isModalOpen = false" />

        <NavButton @click="currentView = 'list'" :active="currentView === 'list'" icon="Layers" label="List" />
        <NavButton @click="currentView = 'user'" :active="currentView === 'user'" icon="User" label="User" />
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Filter as FilterIcon, ChevronRight as ChevronRightIcon, Plus as PlusIcon, Image as ImageIcon } from 'lucide-vue-next'

// コンポーネントのインポート
import AppHeader from './components/AppHeader.vue'
import SummaryCard from './components/SummaryCard.vue'
import ItemCard from './components/ItemCard.vue'
import NavButton from './components/NavButton.vue' // ナビも共通化すると楽です
import SearchView from './components/SearchView.vue'
import AddItemModal from './components/AddItemModal.vue'

const isModalOpen = ref(false)
const currentView = ref('home')
const items = ref([
  { id: 1, name: '2024アニバーサリー缶バッジ', category: 'Badge', date: '2024.03.01', color: 'bg-pink-400' },
  { id: 2, name: '夏制服Ver. アクリルスタンド', category: 'Acrylic', date: '2024.02.15', color: 'bg-indigo-400' },
  { id: 3, name: '限定撮り下ろしチェキ(サイン有)', category: 'Photo', date: '2024.02.10', color: 'bg-amber-400' },
  { id: 4, name: '公式ペンライト Vol.2', category: 'Light', date: '2024.01.28', color: 'bg-emerald-400' },
  { id: 5, name: 'ラバーキーホルダー', category: 'Keyring', date: '2024.01.20', color: 'bg-rose-400' },
  { id: 6, name: 'ライブTシャツ Lサイズ', category: 'Wear', date: '2024.01.15', color: 'bg-sky-400' },
])
</script>