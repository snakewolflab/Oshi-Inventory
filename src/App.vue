<template>
  <div class="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50">

    <div v-if="!currentUser" class="flex-grow flex items-center justify-center p-6">
      <div
        class="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center space-y-8 border border-slate-100">
        <div
          class="w-24 h-24 bg-brand/10 rounded-[2rem] flex items-center justify-center mx-auto text-brand animate-pulse">
          <HeartIcon :size="48" fill="currentColor" class="opacity-80" />
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl font-black text-slate-800 tracking-tighter">OshiLog</h2>
          <p class="text-slate-400 text-sm font-bold leading-relaxed">
            大切な「推し」の記録を<br>クラウドで安全に管理しましょう
          </p>
        </div>
        <button @click="signIn"
          class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
          <span>Googleでログイン</span>
        </button>
      </div>
    </div>

    <template v-else>
      <AppHeader :user="currentUser" @logout="signOutUser" />

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
                <div v-if="items.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <ItemCard v-for="item in items.slice(0, 6)" :key="item.id" :item="item" @click="openDetail(item)" />
                </div>
                <div v-else class="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <p class="text-slate-400 font-bold text-sm">アイテムが登録されていません</p>
                </div>
              </section>
            </div>

            <SearchView v-else-if="currentView === 'search'" :items="items" :oshis="userSettings.oshis"
              @item-click="openDetail" />
            <ListView v-else-if="currentView === 'list'" :items="items" :oshis="userSettings.oshis"
              @select-item="openDetail" />
            <UserView v-else-if="currentView === 'user'" :userSettings="userSettings" :itemCount="items.length"
              @update-settings="updateSettings" @remove-oshi="removeOshi" @logout="signOutUser" />
            <StatsView v-else-if="currentView === 'stats'" :items="items" :oshis="userSettings.oshis" />
            <PremiumView v-else-if="currentView === 'premium'" :userSettings="userSettings" :items="items"
              @update-plan="updatePlan" />
          </div>
        </transition>
      </main>

      <nav
        class="fixed bottom-0 left-0 right-0 header-blur border-t border-slate-100 px-8 py-2 pb-safe z-50 md:max-w-md md:mx-auto md:mb-6 md:rounded-full md:shadow-2xl md:border">
        <div class="flex justify-between items-center h-14">
          <NavButton @click="currentView = 'home'" :active="currentView === 'home'" icon="Home" label="Home" />
          <NavButton @click="currentView = 'search'" :active="currentView === 'search'" icon="Search" label="Search" />

          <button @click="isAddModalOpen = true" class="relative -translate-y-6 btn-bounce group">
            <div
              class="bg-brand text-white p-4 rounded-2xl shadow-xl border-4 border-white group-hover:opacity-90 transition-all">
              <PlusIcon :size="24" stroke-width="3" />
            </div>
          </button>

          <NavButton @click="currentView = 'list'" :active="currentView === 'list'" icon="Layers" label="List" />
          <NavButton @click="currentView = 'user'" :active="currentView === 'user'" icon="User" label="User" />
        </div>
      </nav>
    </template>

    <AddItemModal :isOpen="isAddModalOpen" :oshis="userSettings.oshis" @close="isAddModalOpen = false"
      @add-item="addItem" />
    <ItemDetailModal :item="selectedItem" @close="selectedItem = null" @delete-item="deleteItem"
      @edit="openEditModal" />
    <EditItemModal :isOpen="isEditModalOpen" :item="itemToEdit" :oshis="userSettings.oshis" @close="closeEditModal"
      @update-item="updateItem" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus as PlusIcon, Heart as HeartIcon } from 'lucide-vue-next'
import { db, auth } from './firebase'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore'

// コンポーネントインポート
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
import EditItemModal from './components/EditItemModal.vue'

// --- 状態管理 ---
const currentUser = ref(null)
const currentView = ref('home')
const isAddModalOpen = ref(false)
const selectedItem = ref(null)
const isEditModalOpen = ref(false)
const itemToEdit = ref(null)

const items = ref([])
const userSettings = ref({
  plan: 'Free',
  oshis: [],
  oshiName: '',
  oshiColor: '#6366f1',
  darkMode: false
})

// --- Firebase リアルタイム同期 ---
let unsubItems = null
let unsubSettings = null

onMounted(async () => {
  // リダイレクト結果の処理
  try {
    const result = await getRedirectResult(auth);
    if (result) console.log("Login Success:", result.user);
  } catch (error) {
    console.error("Login Error:", error);
  }

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (user) {
      // アイテム購読
      const itemsRef = collection(db, 'users', user.uid, 'items')
      const q = query(itemsRef, orderBy('createdAt', 'desc'))
      unsubItems = onSnapshot(q, (snap) => {
        items.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      })

      // 設定購読
      const settingsRef = doc(db, 'users', user.uid, 'config', 'settings')
      unsubSettings = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          userSettings.value = { ...userSettings.value, ...docSnap.data() }
          applyThemeColor(userSettings.value.oshiColor)
          document.documentElement.classList.toggle('dark', userSettings.value.darkMode)
        }
      })
    } else {
      if (unsubItems) unsubItems()
      if (unsubSettings) unsubSettings()
      items.value = []
      currentView.value = 'home'
    }
  })
})

// --- Auth 関数 ---
const signIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error("Popup Error:", e);
  }
}
const signOutUser = () => signOut(auth)

// --- Firestore 操作 ---
const addItem = async (newItem) => {
  if (!currentUser.value) return
  await addDoc(collection(db, 'users', currentUser.value.uid, 'items'), {
    ...newItem,
    date: new Date().toLocaleDateString('ja-JP'),
    createdAt: Date.now()
  })
  isAddModalOpen.value = false
}

const updateItem = async (updatedData) => {
  try {
    if (!currentUser.value) return;
    const itemId = String(updatedData.id);
    const { id, ...dataToSave } = updatedData;
    const itemRef = doc(db, 'users', currentUser.value.uid, 'items', itemId);
    await updateDoc(itemRef, dataToSave);
    closeEditModal();
  } catch (e) {
    console.error("Update Error:", e);
  }
}

const deleteItem = async (id) => {
  if (confirm('削除してもよろしいですか？')) {
    await deleteDoc(doc(db, 'users', currentUser.value.uid, 'items', id))
    selectedItem.value = null
  }
}

const syncSettings = async () => {
  if (!currentUser.value) return
  await setDoc(doc(db, 'users', currentUser.value.uid, 'config', 'settings'), userSettings.value)
}

// --- 設定更新ロジック (メンカラ変更・新規追加対応) ---
const updateSettings = async (data) => {
  if (!currentUser.value) return

  // 1. 現在のメイン推し情報を更新
  userSettings.value.oshiName = data.name
  userSettings.value.oshiColor = data.color

  // 2. リスト内データの更新または追加
  if (!userSettings.value.oshis) userSettings.value.oshis = []

  const index = userSettings.value.oshis.findIndex(o => o.name === data.name)
  if (index !== -1) {
    // メンカラ変更に対応：既存の名前があれば色を上書き
    userSettings.value.oshis[index].color = data.color
  } else {
    // 新規追加
    userSettings.value.oshis.push({
      id: Date.now(),
      name: data.name,
      color: data.color
    })
  }

  await syncSettings()
}

// --- 推しリストからの削除 ---
// App.vue の script setup 内
const removeOshi = async (id) => {
  console.log("削除を実行中 ID:", id); // 👈 これがコンソールに出るか確認
  
  // 1. ローカルの配列から削除
  userSettings.value.oshis = userSettings.value.oshis.filter(o => o.id !== id);
  
  // 2. メインの推しが消された場合の処理
  if (userSettings.value.oshis.length === 0) {
    userSettings.value.oshiName = '';
    userSettings.value.oshiColor = '#6366f1';
  }
  
  // 3. Firestoreに保存
  await syncSettings();
};

const updateAppSettings = (data) => {
  userSettings.value.darkMode = data.darkMode
  syncSettings()
}

const updatePlan = (data) => {
  userSettings.value.plan = data.plan
  syncSettings()
}

// --- UI ヘルパー ---
const openDetail = (item) => { selectedItem.value = item }
const openEditModal = (item) => {
  itemToEdit.value = { ...item }
  selectedItem.value = null
  isEditModalOpen.value = true
}
const closeEditModal = () => {
  isEditModalOpen.value = false
  itemToEdit.value = null
}

const applyThemeColor = (color) => {
  document.documentElement.style.setProperty('--brand-color', color)
  document.documentElement.style.setProperty('--brand-color-light', `${color}26`)
}
</script>

<style>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.header-blur {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.btn-bounce:active {
  transform: scale(0.95);
}

.dark body {
  background-color: #0f172a;
  color: white;
}
</style>