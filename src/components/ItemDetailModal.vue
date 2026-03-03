<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="item" @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"></div>
    </transition>

    <transition name="slide-up">
      <div v-if="item" class="fixed bottom-0 left-0 right-0 z-[90] md:inset-0 md:flex md:items-center md:justify-center md:p-4 pointer-events-none">
        
        <div class="bg-white w-full rounded-t-[2.5rem] md:rounded-[2.5rem] md:max-w-lg overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[92vh] md:max-h-[85vh]">
          
          <div :class="`aspect-square md:aspect-[4/3] w-full ${item.color} flex-shrink-0 relative flex items-center justify-center text-white/50 text-opacity-20`">
            <ImageIcon :size="100" stroke-width="1" class="md:size-24" />
            
            <button @click="$emit('close')" class="absolute top-6 right-6 p-3 bg-black/20 backdrop-blur-md rounded-full text-white btn-bounce">
              <XIcon :size="20" />
            </button>
            
            <span class="absolute bottom-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur text-xs font-black rounded-xl shadow-sm text-indigo-600 uppercase tracking-widest">
              {{ item.category }}
            </span>
          </div>

          <div class="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Item Details</p>
              <h2 class="text-2xl font-black text-slate-800 leading-tight">{{ item.name }}</h2>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-2xl">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Acquired Date</p>
                <p class="text-sm font-bold text-slate-700">{{ item.date }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Condition</p>
                <p class="text-sm font-bold text-slate-700">新品同様</p>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Memo</p>
              <p class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl italic shadow-inner">
                「推し活イベント2024」の物販にて購入。自引きできた大切なコレクション。<br>
                保存用として購入したが、一度開封して中身を確認した。<br>
                傷や汚れはなく、状態は非常に良い。<br>
                (ここが長くなっても、モーダル内でスクロールします)
              </p>
            </div>
          </div>

          <div class="p-8 pt-4 pb-10 md:pb-8 flex-shrink-0 border-t border-slate-100 bg-white">
            <div class="flex gap-3 pt-2 pb-safe">
              <button class="flex-grow py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg btn-bounce">
                編集する
              </button>
              <button @click="handleDelete" class="p-4 bg-rose-50 text-rose-500 rounded-2xl btn-bounce border border-rose-100">
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
import { X as XIcon, Image as ImageIcon, Trash2 as TrashIcon } from 'lucide-vue-next'

// src/components/ItemDetailModal.vue

const props = defineProps({
  item: Object
})

// 👇 これを追加して、イベントを明示的に宣言する
const emit = defineEmits(['close', 'delete-item'])

// 削除ボタンを押した時の関数（例）
const handleDelete = () => {
  if (props.item) {
    emit('delete-item', props.item.id)
    emit('close') // 削除したらモーダルを閉じる
  }
}
</script>

<style scoped>
/* フェードイン (背景) */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* スマホでのスライドアップ (本体) */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* PCでのアニメーション (メディアクエリで切り替え) */
@media (min-width: 768px) {
  /* PCではフェード+スケールに変更 */
  .slide-up-enter-active { transition: all 0.3s ease; }
  .slide-up-leave-active { transition: all 0.2s ease-in; }
  .slide-up-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
  .slide-up-leave-to { opacity: 0; transform: scale(0.95); }
}

/* スクロールバーを隠す (SearchViewと同じ) */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>