<template>
  <div class="px-3 sm:px-5 lg:px-6 py-4 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
      <div class="lg:col-span-7 space-y-4 sm:space-y-6">
        <!-- Wallet Card -->
        <section class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-5 sm:p-7 rounded-2xl text-white shadow-xl">
          <div class="relative z-10">
            <p class="text-[11px] sm:text-sm font-medium opacity-80 uppercase tracking-widest">Health Wallet Balance</p>
            <h3 class="text-[28px] sm:text-4xl lg:text-5xl font-black font-headline mt-1.5 sm:mt-2 tracking-tight">₦{{ (wallet?.balance || 0).toLocaleString() }}</h3>
            <div class="grid grid-cols-3 gap-2 sm:gap-4 mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/10">
              <div class="flex flex-col"><span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold leading-tight">Saved</span><span class="font-headline font-bold text-xs sm:text-base mt-0.5">₦{{ savedTotal }}</span></div>
              <div class="flex flex-col"><span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold leading-tight">Streak</span><span class="font-headline font-bold text-xs sm:text-base mt-0.5">{{ wallet?.streakDays || 0 }}d 🔥</span></div>
              <div class="flex flex-col"><span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold leading-tight">Goal</span><span class="font-headline font-bold text-xs sm:text-base mt-0.5">₦{{ (wallet?.savingsGoalDaily || 0).toLocaleString() }}</span></div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 w-full h-1.5 bg-white/10"><div class="h-full bg-secondary" :style="{ width: prepScore + '%' }" /></div>
          <div class="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        </section>

        <!-- Quick Actions -->
        <section class="grid grid-cols-4 gap-2 sm:gap-3">
          <button v-for="a in actions" :key="a.label" @click="$emit('navigate', a.tab)" class="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 py-3 sm:py-5 bg-surface-container-lowest rounded-xl border border-transparent hover:border-primary/20 active:scale-95 transition-all group">
            <div class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary-fixed text-primary group-active:scale-90 transition-transform">
              <span class="material-symbols-outlined text-[20px] sm:text-[24px]">{{ a.icon }}</span>
            </div>
            <span class="font-headline text-[10px] sm:text-xs font-bold text-on-surface text-center leading-tight px-1">{{ a.label }}</span>
          </button>
        </section>

        <!-- Recent Invoices -->
        <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/5">
          <h4 class="font-headline font-bold text-sm sm:text-base mb-3 sm:mb-5 text-on-surface">Recent Invoices</h4>
          <div v-if="!invoices.length" class="py-6 text-center text-on-surface-variant/40 text-sm">
            <span class="material-symbols-outlined text-3xl mb-1.5 block">receipt_long</span>No invoices yet.
          </div>
          <div v-else class="space-y-2 sm:space-y-2.5">
            <div v-for="inv in invoices.slice(0, 4)" :key="inv.id" class="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-surface-container-low/50 active:bg-surface-container-low transition-colors">
              <div class="flex-1 min-w-0 mr-3">
                <p class="font-semibold text-sm text-on-surface truncate">{{ inv.providerName }}</p>
                <p class="text-[11px] text-on-surface-variant/50 mt-0.5">{{ fmtDate(inv.invoiceDate) }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-bold text-sm text-primary">₦{{ inv.total?.toLocaleString() }}</p>
                <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5" :class="stCls(inv.status)">{{ inv.status }}</span>
              </div>
            </div>
          </div>
          <button v-if="invoices.length" @click="$emit('navigate', 'invoices')" class="mt-3 sm:mt-4 font-headline font-bold text-sm text-primary active:opacity-70 flex items-center gap-1">
            View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-6">
        <!-- Prep Score -->
        <section class="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-sm border border-outline-variant/5 flex flex-col items-center text-center">
          <h4 class="font-headline font-bold text-sm sm:text-base mb-4 sm:mb-6 text-on-surface w-full text-left">Preparedness</h4>
          <div class="relative w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle class="text-surface-container" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" stroke-width="10" />
              <circle class="text-secondary" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" :stroke-dasharray="527" :stroke-dashoffset="527 - (527 * prepScore / 100)" stroke-width="10" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl sm:text-3xl font-black font-headline text-on-surface">{{ prepScore }}%</span>
              <span class="text-[9px] sm:text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div class="mt-4 sm:mt-6 bg-tertiary-fixed/30 p-3 rounded-xl w-full">
            <div class="flex items-center gap-2.5 text-left">
              <span class="material-symbols-outlined text-tertiary text-[20px]">lightbulb</span>
              <p class="text-xs font-medium text-on-tertiary-fixed-variant">Save ₦{{ (wallet?.savingsGoalDaily || 400).toLocaleString() }} today!</p>
            </div>
          </div>
        </section>

        <!-- Recent Savings -->
        <section class="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-sm border border-outline-variant/5">
          <h4 class="font-headline font-bold text-sm sm:text-base mb-4 text-on-surface">Recent Savings</h4>
          <div v-if="savings.length" class="space-y-2.5">
            <div v-for="s in savings" :key="s.id" class="flex items-center justify-between py-2">
              <div class="min-w-0 mr-3"><p class="text-sm font-medium text-on-surface truncate">{{ s.note || 'Savings' }}</p><p class="text-[11px] text-on-surface-variant/50">{{ fmtDate(s.createdAt) }}</p></div>
              <span class="font-bold text-sm text-secondary shrink-0">+₦{{ s.amount?.toLocaleString() }}</span>
            </div>
          </div>
          <div v-else class="py-5 text-center text-on-surface-variant/40 text-sm">
            <span class="material-symbols-outlined text-2xl mb-1 block">savings</span>Start saving today!
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ wallet: any; invoices: any[] }>()
defineEmits(['navigate'])
const savings = computed(() => props.wallet?.recentSavings || [])
const savedTotal = computed(() => savings.value.reduce((s: number, e: any) => s + (e.amount || 0), 0).toLocaleString())
const prepScore = computed(() => Math.min(100, Math.round(((props.wallet?.streakDays || 0) * 3) + ((props.wallet?.balance || 0) / 1000))))
const actions = [
  { icon: 'savings', label: 'Save', tab: 'wallet' },
  { icon: 'add_card', label: 'Invoice', tab: 'invoices' },
  { icon: 'payments', label: 'Pay', tab: 'invoices' },
  { icon: 'history', label: 'History', tab: 'history' },
]
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''
const stCls = (s: string) => {
  if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'
  if (s === 'open') return 'bg-tertiary/10 text-tertiary'
  if (s === 'cancelled' || s === 'failed') return 'bg-error/10 text-error'
  return 'bg-primary/10 text-primary'
}
</script>