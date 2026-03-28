<template>
  <div class="px-3 sm:px-5 lg:px-6 py-4 max-w-[960px] mx-auto">
    <h1 class="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight mb-4 sm:mb-6">Settings</h1>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
      <!-- Left -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-6">
        <!-- Profile -->
        <section class="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-5"><h3 class="font-headline font-bold text-base sm:text-lg text-primary">Profile</h3><span class="material-symbols-outlined text-outline-variant text-[20px]">person</span></div>
          <div v-if="profileMsg" class="mb-4 p-3 rounded-xl text-sm font-medium" :class="profileMsg.type === 'ok' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">{{ profileMsg.text }}</div>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div><label class="text-sm font-medium text-on-surface-variant block mb-1.5">Full Name</label><input v-model="profile.fullName" class="w-full h-[48px] px-4 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary-fixed bg-transparent outline-none" /></div>
            <div><label class="text-sm font-medium text-on-surface-variant block mb-1.5">Email</label><input v-model="profile.email" type="email" class="w-full h-[48px] px-4 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary-fixed bg-transparent outline-none" /></div>
            <div><label class="text-sm font-medium text-on-surface-variant block mb-1.5">Phone</label><input v-model="profile.phone" type="tel" class="w-full h-[48px] px-4 rounded-xl border border-outline-variant/30 bg-surface-container-low outline-none text-on-surface-variant" disabled /></div>
            <button type="submit" :disabled="updatingProfile" class="w-full sm:w-auto h-[48px] px-8 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50">
              {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </section>

        <!-- Security -->
        <section class="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-5"><h3 class="font-headline font-bold text-base sm:text-lg text-primary">Security</h3><span class="material-symbols-outlined text-outline-variant text-[20px]">security</span></div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
              <div><p class="font-bold text-sm">BVN Status</p><p class="text-xs text-on-surface-variant">Identity verification</p></div>
              <span class="px-3 py-1 rounded-full text-[11px] font-bold" :class="user?.isVerified ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'">{{ user?.isVerified ? 'Verified' : 'Unverified' }}</span>
            </div>
            <button @click="showChangePw = true" class="w-full sm:w-auto flex items-center gap-2 text-primary font-bold text-sm border border-outline-variant/20 px-5 py-2.5 rounded-full active:bg-surface-container active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[20px]">lock_reset</span> Change Password
            </button>
            <div class="pt-3 border-t border-outline-variant/10">
              <button @click="handleDelete" class="flex items-center gap-2 text-error font-bold text-sm active:opacity-70"><span class="material-symbols-outlined text-lg">delete_forever</span> Delete Account</button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-6">
        <section class="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-5"><h3 class="font-headline font-bold text-base text-primary">Wallet</h3><span class="material-symbols-outlined text-outline-variant text-[20px]">account_balance_wallet</span></div>
          <div class="p-4 rounded-xl bg-gradient-to-br from-primary-fixed to-surface-container-high border border-primary-fixed-dim mb-4">
            <p class="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Daily Savings</p>
            <div class="flex items-end gap-1"><span class="text-xl font-headline font-extrabold text-on-primary-fixed">₦{{ (wallet?.savingsGoalDaily || 0).toLocaleString() }}</span><span class="text-xs text-on-primary-fixed-variant mb-0.5">/ day</span></div>
          </div>
          <div class="flex items-center justify-between py-2"><div><p class="font-bold text-sm">Streak</p><p class="text-xs text-on-surface-variant">{{ wallet?.streakDays || 0 }} days</p></div><span class="text-2xl">🔥</span></div>
        </section>

        <div class="p-4 sm:p-5 rounded-2xl bg-error-container/50 border border-error/20 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-full bg-error flex items-center justify-center shadow-lg shrink-0"><span class="material-symbols-outlined text-on-error text-[20px]" style="font-variation-settings:'FILL' 1;">emergency</span></div>
          <div><p class="font-headline font-bold text-error text-sm">Emergency Funds</p><p class="text-[11px] text-on-error-container">One-tap liquidity for critical health needs.</p></div>
        </div>
      </div>
    </div>

    <!-- Change PW Modal -->
    <Teleport to="body">
      <div v-if="showChangePw" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showChangePw = false">
        <div class="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 w-full sm:max-w-sm shadow-2xl safe-bottom animate-fade-in">
          <div class="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 sm:hidden" />
          <h3 class="font-headline font-bold text-lg text-on-surface mb-3">Change Password</h3>
          <p class="text-sm text-on-surface-variant mb-5">Use the forgot password flow to reset your password.</p>
          <button @click="showChangePw = false" class="w-full h-[48px] bg-primary text-white rounded-full font-bold active:scale-95 transition-all">Got it</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { user, wallet, clearAuth } = useAuth()
const { apiFetch } = useApi()

const profile = reactive({ fullName: user.value?.fullName || '', email: user.value?.email || '', phone: user.value?.phone || '' })
const updatingProfile = ref(false)
const profileMsg = ref<{ type: string; text: string } | null>(null)
const showChangePw = ref(false)

watch(() => user.value, (u) => { if (u) { profile.fullName = u.fullName || ''; profile.email = u.email || ''; profile.phone = u.phone || '' } }, { immediate: true })

const updateProfile = async () => { updatingProfile.value = true; profileMsg.value = null; try { profileMsg.value = { type: 'ok', text: 'Profile update coming soon.' } } finally { updatingProfile.value = false } }

const handleDelete = async () => {
  if (!confirm('Permanently delete your account? This cannot be undone.')) return
  try { await apiFetch('/api/v1/auth/me', { method: 'DELETE' }); clearAuth(); navigateTo('/register') } catch (e) { console.error(e) }
}
</script>