<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="item" @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"></div>
    </transition>

    <transition name="slide-up">
      <div v-if="item" class="fixed bottom-0 left-0 right-0 z-[90] md:inset-0 md:flex md:items-center md:justify-center md:p-4 pointer-events-none">
        
        <div class="bg-white w-full rounded-t-[2.5rem] md:rounded-[2.5rem] md:max-w-lg overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[92vh] md:max-h-[85vh]">
          
          <div 
            class="aspect-square md:aspect-[16/9] w-full flex-shrink-0 relative flex items-center justify-center transition-colors duration-500 overflow-hidden bg-`{{item.color || '#6366f1'}}`"
            :style="{ backgroundColor: item.color || '#6366f1' }"
          >
            <ImageIcon :size="100" stroke-width="1" class="text-white/20 scale-150 md:scale-100" />
            
            <button @click="$emit('close')" class="absolute top-6 right-6 p-3 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-white transition-all btn-bounce">
              <XIcon :size="20" />
            </button>
            
            <div class="absolute bottom-6 left-6 flex gap-2">
              <span class="px-4 py-1.5 bg-white/95 backdrop-blur text-[10px] font-black rounded-xl shadow-sm text-slate-800 uppercase tracking-widest">
                {{ item.category }}
              </span>
              <span 
                v-if="item.oshiName"
                class="px-4 py-1.5 bg-slate-900/80 backdrop-blur text-[10px] font-black rounded-xl shadow-sm text-white uppercase tracking-widest"
              >
                {{ item.oshiName }}
              </span>
            </div>
          </div>

          <div class="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
            
            <div class="flex justify-between items-start gap-4">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Details</p>
                <h2 class="text-2xl font-black text-slate-800 leading-tight">{{ item.name }}</h2>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                <p class="text-xl font-black text-slate-900">¥{{ item.price?.toLocaleString() || '0' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div class="flex items-center gap-2 mb-1">
                  <CalendarIcon :size="14" class="text-slate-400" />
                  <p class="text-[9px] font-black text-slate-400 uppercase">Acquired</p>
                </div>
                <p class="text-sm font-bold text-slate-700 ml-5">{{ item.date }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div class="flex items-center gap-2 mb-1">
                  <StarIcon :size="14" class="text-amber-500" />
                  <p class="text-[9px] font-black text-slate-400 uppercase">Condition</p>
                </div>
                <p class="text-sm font-bold text-slate-700 ml-5">{{ item.condition || '未設定' }}</p>
              </div>
            </div>

            <div v-if="item.memo" class="space-y-3">
              <div class="flex items-center gap-2 px-1">
                <div class="w-1 h-3 bg-slate-200 rounded-full"></div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collector's Memo</p>
              </div>
              <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner relative">
                <QuoteIcon :size="24" class="absolute -top-2 -left-2 text-slate-200" />
                <p class="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{{ item.memo }}</p>
              </div>
            </div>
          </div>

          <div class="p-8 pt-4 pb-10 md:pb-8 flex-shrink-0 border-t border-slate-100 bg-white/80 backdrop-blur-md">
            <div class="flex gap-3 pt-2 pb-safe">
              <button 
                @click="$emit('edit', item)"
                class="flex-grow py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-all btn-bounce flex items-center justify-center gap-2"
              >
                <EditIcon :size="18" />
                編集する
              </button>
              <button 
                @click="confirmDelete" 
                class="p-4 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 active:scale-95 transition-all btn-bounce"
              >
                <TrashIcon :size="20" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { 
  X as XIcon, 
  Image as ImageIcon, 
  Trash2 as TrashIcon, 
  Calendar as CalendarIcon, 
  Star as StarIcon,
  Quote as QuoteIcon,
  Edit2 as EditIcon // ✨追加：編集アイコン
} from 'lucide-vue-next'

const props = defineProps({
  item: Object
})

// ✨修正：'edit' イベントを追加
const emit = defineEmits(['close', 'delete-item', 'edit'])

const confirmDelete = () => {
  if (!props.item) return
  if (confirm(`「${props.item.name}」を削除してもよろしいですか？`)) {
    emit('delete-item', props.item.id)
    emit('close')
  }
}
</script>

<style scoped>
/* SearchViewと同じ、横スクロールを隠す（メモエリア用） */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* アニメーション設定 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

@media (min-width: 768px) {
  .slide-up-enter-active { transition: all 0.3s ease; }
  .slide-up-leave-active { transition: all 0.2s ease-in; }
  .slide-up-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
  .slide-up-leave-to { opacity: 0; transform: scale(0.95); }
}
</style>