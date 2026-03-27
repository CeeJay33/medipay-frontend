<template>
  <div class="p-4 sm:p-6 max-w-[960px] mx-auto">
    <h1 class="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-6 sm:mb-8">Settings</h1>

    <div class="grid grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- Left -->
      <div class="col-span-12 lg:col-span-7 space-y-6 sm:space-y-8">
        <!-- Profile -->
        <section class="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-6 sm:mb-8">
            <h3 class="font-headline font-bold text-lg sm:text-xl text-primary">Profile Settings</h3>
            <span class="material-symbols-outlined text-outline-variant">person</span>
          </div>
          <div v-if="profileMsg" class="mb-4 p-3 rounded-lg text-sm font-medium" :class="profileMsg.type === 'success' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">{{ profileMsg.text }}</div>
          <form @submit.prevent="updateProfile" class="space-y-5">
            <div>
              <label class="text-[13px] font-medium text-on-surface-variant px-1 block mb-1">Full Name</label>
              <input v-model="profile.fullName" class="w-full h-11 px-4 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary-fixed bg-transparent transition-all outline-none text-[15px]" />
            </div>
            <div>
              <label class="text-[13px] font-medium text-on-surface-variant px-1 block mb-1">Email Address</label>
              <input v-model="profile.email" type="email" class="w-full h-11 px-4 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary-fixed bg-transparent transition-all outline-none text-[15px]" />
            </div>
            <div>
              <label class="text-[13px] font-medium text-on-surface-variant px-1 block mb-1">Phone Number</label>
              <input v-model="profile.phone" type="tel" class="w-full h-11 px-4 rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all outline-none text-[15px] text-on-surface-variant" disabled />
            </div>
            <div class="pt-2">
              <button type="submit" :disabled="updatingProfile" class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-bold text-[15px] shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50">
                {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Security -->
        <section class="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-6 sm:mb-8">
            <h3 class="font-headline font-bold text-lg sm:text-xl text-primary">Security</h3>
            <span class="material-symbols-outlined text-outline-variant">security</span>
          </div>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
              <div>
                <p class="font-bold text-[15px]">BVN Verified</p>
                <p class="text-[13px] text-on-surface-variant">Identity verification status</p>
              </div>
              <span class="px-3 py-1 rounded-full text-[11px] font-bold" :class="user?.isVerified ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'">
                {{ user?.isVerified ? 'Verified' : 'Not Verified' }}
              </span>
            </div>
            <button @click="showChangePassword = true" class="flex items-center gap-2 text-primary font-bold text-[15px] border border-outline-variant/20 px-6 py-2.5 rounded-full hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[20px]">lock_reset</span> Change Password
            </button>
            <div class="pt-4 border-t border-outline-variant/10">
              <button @click="handleDeleteAccount" class="flex items-center gap-2 text-error font-bold text-sm hover:underline">
                <span class="material-symbols-outlined text-lg">delete_forever</span> Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right -->
      <div class="col-span-12 lg:col-span-5 space-y-6 sm:space-y-8">
        <!-- Wallet Preferences -->
        <section class="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between mb-6 sm:mb-8">
            <h3 class="font-headline font-bold text-lg text-primary">Wallet Preferences</h3>
            <span class="material-symbols-outlined text-outline-variant">account_balance_wallet</span>
          </div>
          <div class="space-y-5">
            <div class="p-5 rounded-xl bg-gradient-to-br from-primary-fixed to-surface-container-high border border-primary-fixed-dim">
              <p class="text-[12px] font-bold text-primary uppercase tracking-widest mb-1">Daily Savings Amount</p>
              <div class="flex items-end gap-1">
                <span class="text-2xl font-headline font-extrabold text-on-primary-fixed">₦{{ wallet?.savingsGoalDaily?.toLocaleString() || '0' }}</span>
                <span class="text-[13px] text-on-primary-fixed-variant mb-1">/ day</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-2">
              <div>
                <p class="font-bold text-[15px]">Streak</p>
                <p class="text-[13px] text-on-surface-variant">{{ wallet?.streakDays || 0 }}-day saving streak</p>
              </div>
              <span class="text-2xl">🔥</span>
            </div>
          </div>
        </section>

        <!-- Emergency -->
        <div class="p-6 rounded-2xl bg-error-container/50 border border-error/20 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-error flex items-center justify-center shadow-lg shadow-error/20 shrink-0">
            <span class="material-symbols-outlined text-on-error" style="font-variation-settings:'FILL' 1;">emergency</span>
          </div>
          <div>
            <p class="font-headline font-bold text-error">Emergency Funds Access</p>
            <p class="text-[12px] text-on-error-container">One-tap liquidity for critical health needs.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <div v-if="showChangePassword" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showChangePassword = false">
        <div class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-outline-variant/10">
          <h3 class="font-headline font-bold text-lg text-on-surface mb-4">Change Password</h3>
          <p class="text-sm text-on-surface-variant mb-4">Use the forgot password flow to reset your password.</p>
          <button @click="showChangePassword = false" class="w-full py-3 bg-primary text-white rounded-full font-bold">Got it</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { user, wallet, clearAuth } = useAuth()
const { apiFetch } = useApi()

const profile = reactive({
  fullName: user.value?.fullName || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
})

const updatingProfile = ref(false)
const profileMsg = ref<{ type: string; text: string } | null>(null)
const showChangePassword = ref(false)

watch(() => user.value, (u) => {
  if (u) { profile.fullName = u.fullName || ''; profile.email = u.email || ''; profile.phone = u.phone || '' }
}, { immediate: true })

const updateProfile = async () => {
  // Note: API doesn't have a dedicated profile update endpoint yet
  // This is a placeholder for when it's added
  updatingProfile.value = true
  profileMsg.value = null
  try {
    profileMsg.value = { type: 'success', text: 'Profile update feature coming soon.' }
  } finally {
    updatingProfile.value = false
  }
}

const handleDeleteAccount = async () => {
  if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return
  try {
    await apiFetch('/api/v1/auth/me', { method: 'DELETE' })
    clearAuth()
    navigateTo('/register')
  } catch (e) {
    console.error('Failed to delete account:', e)
  }
}
</script>