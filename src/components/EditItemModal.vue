<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"></div>
    </transition>

    <transition name="slide">
      <div v-if="isOpen" class="fixed bottom-0 left-0 right-0 z-[110] md:max-w-md md:mx-auto">
        <div class="bg-white rounded-t-[2.5rem] p-8 shadow-2xl border-t border-slate-100 pb-safe max-h-[90vh] overflow-y-auto scrollbar-hide">

          <div class="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-1 z-10">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">アイテムを編集</h2>
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
                  @click="form.oshiId = oshi.id"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap active:scale-95',
                    form.oshiId === oshi.id 
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
                <input v-model="form.name" type="text" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-bold text-slate-700 shadow-inner outline-none" />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Category</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="cat in ['Badge', 'Acrylic', 'Photo', 'Card', 'Other']" 
                    :key="cat"
                    @click="form.category = cat"
                    :class="[
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                      form.category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
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
                <select v-model="form.condition" class="w-full px-4 py-3 bg-slate-50 rounded-xl border-none font-bold text-slate-600 text-sm outline-none">
                  <option>新品・未開封</option>
                  <option>未使用に近い</option>
                  <option>目立った傷なし</option>
                  <option>やや傷あり</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Price (¥)</label>
                <input v-model.number="form.price" type="number" class="w-full px-4 py-3 bg-slate-50 rounded-xl border-none font-bold text-slate-600 text-sm outline-none" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Memo</label>
              <textarea v-model="form.memo" class="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none font-bold text-slate-600 text-sm outline-none min-h-[100px] resize-none shadow-inner"></textarea>
            </div>

            <button @click="submit" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all mt-4 mb-2">
              変更を保存する
            </button>

            <div class="h-6"></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { X as XIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  item: Object, // 編集対象のデータ
  oshis: Array
})

const emit = defineEmits(['close', 'update-item'])

// フォームのリアクティブデータ
const form = reactive({
  id: null,
  name: '',
  category: 'Badge',
  condition: '新品・未開封',
  price: 0,
  memo: '',
  oshiId: null
})

// モーダルが開いたとき、またはアイテムが切り替わったときにフォームに値をセット
watch(() => props.item, (newVal) => {
  if (newVal) {
    form.id = newVal.id
    form.name = newVal.name
    form.category = newVal.category
    form.condition = newVal.condition
    form.price = newVal.price
    form.memo = newVal.memo
    form.oshiId = newVal.oshiId
  }
}, { immediate: true })

const submit = () => {
  if (!form.name.trim()) return alert('名前を入力してください')

  const targetOshi = props.oshis.find(o => o.id === form.oshiId)

  // 更新されたデータを送信
  emit('update-item', {
    ...form,
    oshiName: targetOshi?.name || 'Unknown',
    color: targetOshi?.color || '#6366f1'
  })
  
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

.bg-brand-light { background-color: var(--brand-color-light); }
.text-brand { color: var(--brand-color); }
.border-brand { border-color: var(--brand-color); }
</style>