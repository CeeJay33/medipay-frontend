<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div class="lg:col-span-7 space-y-6 lg:space-y-8">
        <!-- Wallet Card -->
        <section class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-6 sm:p-8 rounded-2xl text-white shadow-xl">
          <div class="relative z-10">
            <p class="text-xs sm:text-sm font-medium opacity-80 uppercase tracking-widest">Health Wallet Balance</p>
            <h3 class="text-3xl sm:text-5xl font-black font-headline mt-2 tracking-tight">₦{{ (wallet?.balance || 0).toLocaleString() }}</h3>
            <div class="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold">Saved this month</span>
                <span class="font-headline font-bold text-sm sm:text-base">₦{{ savedTotal }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold">Streak</span>
                <span class="font-headline font-bold text-sm sm:text-base">{{ wallet?.streakDays || 0 }} days 🔥</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] uppercase opacity-60 font-bold">Daily Goal</span>
                <span class="font-headline font-bold text-sm sm:text-base">₦{{ (wallet?.savingsGoalDaily || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 w-full h-1.5 bg-white/10"><div class="h-full bg-secondary" :style="{ width: prepScore + '%' }" /></div>
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </section>

        <!-- Quick Actions -->
        <section class="grid grid-cols-4 gap-2 sm:gap-4">
          <button v-for="a in actions" :key="a.label" @click="$emit('navigate', a.tab)" class="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-6 bg-surface-container-lowest rounded-xl sm:rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary-fixed/30 transition-all group active:scale-95">
            <div class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary-fixed text-primary group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-xl sm:text-2xl">{{ a.icon }}</span>
            </div>
            <span class="font-headline text-[10px] sm:text-sm font-bold text-on-surface text-center leading-tight">{{ a.label }}</span>
          </button>
        </section>

        <!-- Recent Invoices -->
        <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/5">
          <h4 class="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 text-on-surface">Recent Invoices</h4>
          <div v-if="!invoices.length" class="py-8 text-center text-on-surface-variant/50 text-sm">
            <span class="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
            No invoices yet.
          </div>
          <!-- Mobile -->
          <div v-else class="sm:hidden space-y-3">
            <div v-for="inv in invoices.slice(0, 4)" :key="inv.id" class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low/50">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-on-surface truncate">{{ inv.providerName }}</p>
                <p class="text-xs text-on-surface-variant/60 mt-0.5">{{ fmtDate(inv.invoiceDate) }}</p>
              </div>
              <div class="text-right ml-3">
                <p class="font-bold text-sm text-primary">₦{{ inv.total?.toLocaleString() }}</p>
                <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5" :class="stCls(inv.status)">{{ inv.status }}</span>
              </div>
            </div>
          </div>
          <!-- Desktop -->
          <div v-if="invoices.length" class="hidden sm:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead><tr class="text-left border-b border-outline-variant/10">
                <th class="pb-4 font-headline text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Provider</th>
                <th class="pb-4 font-headline text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Amount</th>
                <th class="pb-4 font-headline text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Date</th>
                <th class="pb-4 font-headline text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Status</th>
              </tr></thead>
              <tbody class="divide-y divide-outline-variant/5">
                <tr v-for="inv in invoices.slice(0, 4)" :key="inv.id" class="hover:bg-surface-container-low transition-colors">
                  <td class="py-4 font-semibold text-on-surface">{{ inv.providerName }}</td>
                  <td class="py-4 font-bold text-primary">₦{{ inv.total?.toLocaleString() }}</td>
                  <td class="py-4 text-sm text-on-surface-variant/60">{{ fmtDate(inv.invoiceDate) }}</td>
                  <td class="py-4"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" :class="stCls(inv.status)">{{ inv.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button v-if="invoices.length" @click="$emit('navigate', 'invoices')" class="inline-flex items-center gap-1 mt-4 sm:mt-6 font-headline font-bold text-sm text-primary hover:gap-2 transition-all">
            View all invoices <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-5 space-y-6 lg:space-y-8">
        <!-- Prep Score -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/5 flex flex-col items-center text-center">
          <h4 class="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 text-on-surface w-full text-left">Preparedness Score</h4>
          <div class="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle class="text-surface-container" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" stroke-width="12" />
              <circle class="text-secondary" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" :stroke-dasharray="527" :stroke-dashoffset="527 - (527 * prepScore / 100)" stroke-width="12" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl sm:text-4xl font-black font-headline text-on-surface">{{ prepScore }}%</span>
              <span class="text-[10px] sm:text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Stability</span>
            </div>
          </div>
          <div class="mt-6 sm:mt-8 bg-tertiary-fixed/30 p-3 sm:p-4 rounded-xl w-full">
            <div class="flex items-center gap-3 text-left">
              <span class="material-symbols-outlined text-tertiary">lightbulb</span>
              <p class="text-xs sm:text-sm font-medium text-on-tertiary-fixed-variant">Save ₦{{ (wallet?.savingsGoalDaily || 400).toLocaleString() }} today to keep your streak!</p>
            </div>
          </div>
        </section>

        <!-- Recent Savings -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/5">
          <div class="flex justify-between items-center mb-6"><h4 class="font-headline font-bold text-base sm:text-lg text-on-surface">Recent Savings</h4></div>
          <div v-if="savings.length" class="space-y-3">
            <div v-for="s in savings" :key="s.id" class="flex items-center justify-between py-2">
              <div><p class="text-sm font-medium text-on-surface">{{ s.note || 'Savings deposit' }}</p><p class="text-xs text-on-surface-variant/50">{{ fmtDate(s.createdAt) }}</p></div>
              <span class="font-bold text-sm text-secondary">+₦{{ s.amount?.toLocaleString() }}</span>
            </div>
          </div>
          <div v-else class="py-6 text-center text-on-surface-variant/50 text-sm">
            <span class="material-symbols-outlined text-3xl mb-2 block">savings</span>No savings yet.
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
  { icon: 'savings', label: 'Save Now', tab: 'wallet' },
  { icon: 'add_card', label: 'New Invoice', tab: 'invoices' },
  { icon: 'payments', label: 'Pay Bill', tab: 'invoices' },
  { icon: 'history', label: 'History', tab: 'history' },
]
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
const stCls = (s: string) => {
  if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'
  if (s === 'open') return 'bg-tertiary/10 text-tertiary'
  if (s === 'cancelled' || s === 'failed') return 'bg-error/10 text-error'
  return 'bg-primary/10 text-primary'
}
</script>