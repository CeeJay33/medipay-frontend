<template>
  <div class="px-3 sm:px-5 lg:px-6 py-4 max-w-6xl mx-auto space-y-4 sm:space-y-6">
    <!-- Stat Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
      <div class="bg-primary-container rounded-2xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-primary-fixed/80 font-medium font-headline mb-1.5 text-xs sm:text-sm">Wallet Balance</p>
          <h3 class="text-[28px] sm:text-4xl font-extrabold font-headline">₦{{ (wallet?.balance || 0).toLocaleString() }}</h3>
        </div>
        <div class="mt-5 relative z-10">
          <button @click="openModal('topup')" class="bg-white/10 active:bg-white/20 border border-white/20 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95">Top Up</button>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>
      <div class="bg-secondary rounded-2xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-secondary-fixed/80 font-medium font-headline mb-1.5 text-xs sm:text-sm">Saved This Month</p>
          <h3 class="text-[28px] sm:text-4xl font-extrabold font-headline">₦{{ savedTotal }}</h3>
        </div>
        <div class="mt-5 relative z-10">
          <span class="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold font-headline">{{ wallet?.streakDays || 0 }}-day streak 🔥</span>
        </div>
        <div class="absolute -right-8 -top-8 w-36 h-36 bg-secondary-fixed/10 rounded-full blur-2xl" />
      </div>
    </section>

    <!-- Goal + Save -->
    <section class="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h4 class="font-headline font-bold text-base sm:text-lg text-on-surface">Daily Savings Goal</h4>
        <div class="flex gap-2.5">
          <button @click="openModal('save')" class="px-4 py-2 bg-secondary text-white rounded-full font-bold text-sm active:scale-95 transition-all">Save Now</button>
          <button @click="openModal('goal')" class="text-primary font-bold text-sm active:opacity-70">Edit Goal</button>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        <div class="space-y-4">
          <div>
            <p class="text-outline text-sm font-medium mb-1">Current goal</p>
            <p class="text-xl sm:text-2xl font-bold font-headline text-on-surface">₦{{ (wallet?.savingsGoalDaily || 0).toLocaleString() }}/day</p>
          </div>
          <div>
            <div class="flex justify-between items-end mb-1.5"><p class="text-outline text-sm font-medium">Streak</p><p class="text-primary font-bold text-sm">{{ wallet?.streakDays || 0 }} days</p></div>
            <div class="w-full h-2.5 bg-surface-container rounded-full overflow-hidden"><div class="h-full bg-secondary rounded-full transition-all" :style="{ width: Math.min(100, (wallet?.streakDays || 0) * 3.3) + '%' }" /></div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <p class="text-outline text-sm font-medium mb-3">Recent Savings</p>
          <div v-if="savings.length" class="space-y-2">
            <div v-for="s in savings" :key="s.id" class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <div class="min-w-0 mr-3"><p class="text-sm font-medium truncate">{{ s.note || 'Savings deposit' }}</p><p class="text-[11px] text-on-surface-variant/50">{{ fmtDate(s.createdAt) }}</p></div>
              <span class="font-bold text-sm text-secondary shrink-0">+₦{{ s.amount?.toLocaleString() }}</span>
            </div>
          </div>
          <p v-else class="text-on-surface-variant/40 text-sm py-3">No savings entries yet.</p>
        </div>
      </div>
    </section>

    <!-- Modal (bottom-sheet on mobile, centered on desktop) -->
    <Teleport to="body">
      <div v-if="modal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="modal = null">
        <div class="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 w-full sm:max-w-sm shadow-2xl border border-outline-variant/10 safe-bottom animate-fade-in">
          <div class="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 sm:hidden" />
          <h3 class="font-headline font-bold text-lg text-on-surface mb-4">{{ modalTitle }}</h3>
          <div v-if="modalError" class="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm">{{ modalError }}</div>
          <div v-if="modalSuccess" class="mb-4 p-3 rounded-xl bg-secondary-container text-on-secondary-container text-sm">{{ modalSuccess }}</div>
          <form @submit.prevent="handleSubmit">
            <label class="block text-sm font-semibold text-on-surface-variant mb-2">{{ modal === 'goal' ? 'Daily Amount (₦)' : 'Amount (₦)' }}</label>
            <input v-model.number="formAmount" type="number" min="100" required class="w-full h-[52px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-lg font-bold" inputmode="numeric" :placeholder="modal === 'goal' ? String(wallet?.savingsGoalDaily || 1000) : '5000'" />
            <div v-if="modal === 'save'" class="mt-3">
              <label class="block text-sm font-semibold text-on-surface-variant mb-2">Note (optional)</label>
              <input v-model="formNote" class="w-full h-[48px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm" placeholder="Monthly saving" />
            </div>
            <div class="flex gap-3 mt-5">
              <button type="button" @click="modal = null" class="flex-1 h-[48px] border border-outline-variant/20 rounded-full font-bold text-on-surface-variant active:scale-95 transition-all">Cancel</button>
              <button type="submit" :disabled="submitting" class="flex-1 h-[48px] rounded-full font-bold disabled:opacity-50 text-white active:scale-95 transition-all" :class="modal === 'save' ? 'bg-secondary' : 'bg-primary'">{{ submitting ? 'Processing...' : modalBtn }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ wallet: any }>()
const emit = defineEmits(['refresh'])
const { apiFetch } = useApi()

const savings = computed(() => props.wallet?.recentSavings || [])
const savedTotal = computed(() => savings.value.reduce((s: number, e: any) => s + (e.amount || 0), 0).toLocaleString())
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''

const modal = ref<'save' | 'topup' | 'goal' | null>(null)
const formAmount = ref(0)
const formNote = ref('')
const submitting = ref(false)
const modalError = ref('')
const modalSuccess = ref('')

const modalTitle = computed(() => ({ save: 'Save to Wallet', topup: 'Top Up Wallet', goal: 'Set Daily Goal' }[modal.value!] || ''))
const modalBtn = computed(() => ({ save: 'Save', topup: 'Top Up', goal: 'Set Goal' }[modal.value!] || ''))

const openModal = (type: 'save' | 'topup' | 'goal') => { modal.value = type; formAmount.value = 0; formNote.value = ''; modalError.value = ''; modalSuccess.value = '' }

const handleSubmit = async () => {
  modalError.value = ''; modalSuccess.value = ''; submitting.value = true
  try {
    let res: any
    if (modal.value === 'save') res = await apiFetch('/api/v1/wallet/save', { method: 'POST', body: { amount: formAmount.value } })
    else if (modal.value === 'topup') res = await apiFetch('/api/v1/wallet/topup', { method: 'POST', body: { amount: formAmount.value, reference: 'topup_' + Date.now() } })
    else if (modal.value === 'goal') res = await apiFetch('/api/v1/wallet/set-goal', { method: 'POST', body: { dailyAmount: formAmount.value } })
    if (res?.success) { modalSuccess.value = 'Done!'; emit('refresh'); setTimeout(() => { modal.value = null }, 1000) }
    else modalError.value = res?.error?.message || 'Failed.'
  } catch (e: any) { modalError.value = e?.data?.error?.message || e?.message || 'Failed. BVN verification may be required.' }
  finally { submitting.value = false }
}
</script>