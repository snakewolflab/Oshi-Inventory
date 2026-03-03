<template>
  <div class="space-y-6 pb-24 animate-in fade-in duration-500">
    
    <div class="px-6 py-4 bg-slate-100 rounded-[2rem] flex items-center justify-between border border-slate-200">
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</p>
        <p class="text-sm font-black text-slate-700">{{ currentPlan }} 会員</p>
      </div>
      <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm', planStyles[currentPlan].color]">
        <component :is="planStyles[currentPlan].icon" :size="20" />
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-sm font-black text-slate-800 px-2 flex items-center gap-2">
        <CreditCardIcon :size="18" class="text-slate-400" />
        プランを選択・アップグレード
      </h3>

      <div class="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-4">
        <div 
          v-for="plan in planDetails" 
          :key="plan.name"
          :class="[
            'min-w-[280px] p-6 rounded-[2.5rem] border-2 transition-all relative',
            currentPlan === plan.name ? 'border-brand bg-white' : 'border-slate-100 bg-white'
          ]"
        >
          <div v-if="currentPlan === plan.name" class="absolute -top-1 right-8 bg-brand text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">
            Current
          </div>

          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white', plan.color]">
            <component :is="plan.icon" :size="24" />
          </div>
          
          <h4 class="text-xl font-black text-slate-800">{{ plan.name }}</h4>
          <div class="flex items-baseline gap-1 mt-1 mb-6">
            <span class="text-2xl font-black text-slate-900">¥{{ plan.price.toLocaleString() }}</span>
            <span class="text-[10px] font-bold text-slate-400">/ 月</span>
          </div>

          <ul class="space-y-3 mb-8">
            <li v-for="feat in plan.features" :key="feat" class="flex items-center gap-2 text-xs font-bold text-slate-500">
              <CheckIcon :size="14" class="text-emerald-500 shrink-0" />
              {{ feat }}
            </li>
          </ul>

          <button 
            @click="handlePlanChange(plan.name)"
            :disabled="currentPlan === plan.name"
            :class="[
              'w-full py-4 rounded-2xl font-black text-sm transition-all',
              currentPlan === plan.name 
                ? 'bg-slate-100 text-slate-400 cursor-default' 
                : 'bg-slate-900 text-white active:scale-95 hover:shadow-lg'
            ]"
          >
            {{ currentPlan === plan.name ? '現在のプラン' : plan.name + ' に変更' }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
      <div class="flex gap-3">
        <ShieldCheckIcon :size="20" class="text-emerald-500 shrink-0" />
        <p class="text-[10px] font-bold text-emerald-700 leading-relaxed">
          プラン変更は即時反映されます。自動更新の解約はいつでも設定画面から可能です。料金に関する不明点はサポートまでお問い合わせください。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  User as UserIcon, Shield as ShieldIcon, Star as StarIcon, 
  Crown as CrownIcon, Check as CheckIcon, CreditCard as CreditCardIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-vue-next'

const props = defineProps({
  userSettings: Object
})

const emit = defineEmits(['update-plan'])

const currentPlan = computed(() => props.userSettings.plan || 'Free')

const planDetails = [
  { 
    name: 'Free', price: 0, icon: UserIcon, color: 'bg-slate-400',
    features: ['50個までのアイテム登録', '基本統計機能', '広告表示あり']
  },
  // { 
  //   name: 'Basic', price: 300, icon: StarIcon, color: 'bg-emerald-500',
  //   features: ['登録制限なし', 'クラウドバックアップ', '広告非表示']
  // },
  // { 
  //   name: 'Pro', price: 980, icon: CrownIcon, color: 'bg-amber-500',
  //   features: ['推し別の詳細分析', '複数端末同期', 'カスタムテーマカラー']
  // }
]

const planStyles = {
  Free: { icon: UserIcon, color: 'bg-slate-400' },
  Basic: { icon: ShieldIcon, color: 'bg-emerald-500' },
  Pro: { icon: StarIcon, color: 'bg-indigo-500' },
  Master: { icon: CrownIcon, color: 'bg-amber-500' }
}

const handlePlanChange = (planName) => {
  if (confirm(`本当に ${planName} プランに変更しますか？\n（※決済シミュレーションを実行します）`)) {
    emit('update-plan', { plan: planName })
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>