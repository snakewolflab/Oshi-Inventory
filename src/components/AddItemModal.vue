<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"></div>
    </transition>

    <transition name="slide">
      <div v-if="isOpen" class="fixed bottom-0 left-0 right-0 z-[70] md:max-w-md md:mx-auto">
        <div class="bg-white rounded-t-[2.5rem] p-8 shadow-2xl border-t border-slate-100 pb-safe">

          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">新規アイテム登録</h2>
            <button @click="$emit('close')" class="p-2 bg-slate-100 rounded-full text-slate-400 btn-bounce">
              <XIcon :size="20" />
            </button>
          </div>

          <div class="space-y-6">
            <div class="aspect-square w-full max-w-[120px] mx-auto bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
              <CameraIcon :size="32" class="mb-2" />
              <span class="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Item Name</label>
                <input type="text" placeholder="例：限定アクリルスタンド" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Category</label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="cat in ['Badge', 'Acrylic', 'Photo']" :key="cat" class="py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>

            <button @click="$emit('close')" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-transform mt-4">
              インベントリーに追加
            </button>

            <div class="h-10 md:h-4"></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { X as XIcon, Camera as CameraIcon } from 'lucide-vue-next'
defineProps({
  isOpen: Boolean
})
defineEmits(['close'])
</script>

<style scoped>
/* 背景のフェードアニメーション */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 下からスライドするアニメーション */
.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateY(100%); }
</style>