<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"></div>
    </transition>

    <transition name="slide">
      <div v-if="isOpen" class="fixed bottom-0 left-0 right-0 z-[70] md:max-w-md md:mx-auto">
        <div class="bg-white rounded-t-[2.5rem] p-8 shadow-2xl border-t border-slate-100 pb-safe max-h-[90vh] overflow-y-auto scrollbar-hide">

          <div class="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-1 z-10">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">新規アイテム登録</h2>
            <button @click="$emit('close')" class="p-2 bg-slate-100 rounded-full text-slate-400 btn-bounce">
              <XIcon :size="20" />
            </button>
          </div>

          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Link to Oshi</label>
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                <button 
                  v-for="oshi in oshis" 
                  :key="oshi.id"
                  @click="selectedOshiId = oshi.id"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap active:scale-95',
                    selectedOshiId === oshi.id 
                      ? 'border-brand bg-brand-light text-brand shadow-sm' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  ]"
                >
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: oshi.color }"></div>
                  <span class="text-xs font-bold">{{ oshi.name }}</span>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Item Name</label>
                <input v-model="name" type="text" placeholder="例：限定アクリルスタンド" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-bold text-slate-700 shadow-inner outline-none" />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Category</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="cat in ['Badge', 'Acrylic', 'Photo', 'Card', 'Other']" 
                    :key="cat"
                    @click="category = cat"
                    :class="[
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                      category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Condition</label>
                <select v-model="condition" class="w-full px-4 py-3 bg-slate-50 rounded-xl border-none font-bold text-slate-600 text-sm outline-none appearance-none">
                  <option>新品・未開封</option>
                  <option>未使用に近い</option>
                  <option>目立った傷なし</option>
                  <option>やや傷あり</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Price (¥)</label>
                <input v-model.number="price" type="number" placeholder="0" class="w-full px-4 py-3 bg-slate-50 rounded-xl border-none font-bold text-slate-600 text-sm outline-none" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Memo</label>
              <textarea v-model="memo" placeholder="購入場所やロット番号など..." class="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none font-bold text-slate-600 text-sm outline-none min-h-[80px] resize-none shadow-inner"></textarea>
            </div>

            <button @click="submit" class="w-full py-4 bg-brand text-white rounded-2xl font-black shadow-lg shadow-brand/20 active:scale-95 transition-all mt-4 mb-2">
              インベントリーに追加
            </button>

            <div class="h-6"></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X as XIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  oshis: Array // App.vueから推しリストを受け取る
})

const emit = defineEmits(['close', 'add-item'])

// フォームの状態
const selectedOshiId = ref(null)
const name = ref('')
const category = ref('Badge')
const condition = ref('新品・未開封')
const price = ref(null)
const memo = ref('')

// モーダルが開いた時にデフォルトの推し（メイン）を選択
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.oshis?.length > 0) {
    const mainOshi = props.oshis.find(o => o.isMain) || props.oshis[0]
    selectedOshiId.value = mainOshi.id
  }
})

const submit = () => {
  if (!name.value) return alert('アイテム名を入力してください')
  
  const targetOshi = props.oshis.find(o => o.id === selectedOshiId.value)

  emit('add-item', {
    id: Date.now(),
    name: name.value,
    category: category.value,
    condition: condition.value,
    price: price.value || 0,
    memo: memo.value,
    oshiId: selectedOshiId.value,
    oshiName: targetOshi?.name || 'Unknown',
    color: targetOshi?.color || '#6366f1', // 推しの色を継承
    date: new Date().toLocaleDateString('ja-JP')
  })
  
  // リセット処理
  name.value = ''
  memo.value = ''
  price.value = null
  emit('close')
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateY(100%); }

.bg-brand { background-color: var(--brand-color); }
.bg-brand-light { background-color: var(--brand-color-light); }
.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
.shadow-brand\/20 { box-shadow: 0 10px 15px -3px var(--brand-color-light); }
</style>