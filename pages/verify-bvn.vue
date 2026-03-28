<template>
  <div class="bg-surface text-on-surface font-body min-h-screen min-h-[100dvh] flex flex-col safe-top safe-bottom">
    <!-- Header -->
    <header class="flex justify-center items-center px-5 py-5 sm:py-7">
      <NuxtLink to="/" class="text-primary font-headline font-extrabold tracking-tight text-xl sm:text-2xl">MediPay</NuxtLink>
    </header>

    <!-- Main -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
      <div class="w-full max-w-md">
        <div class="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 md:p-10 shadow-[0_20px_40px_rgba(0,62,126,0.06)] border border-outline-variant/10">
          <div class="flex flex-col items-center text-center">
            <!-- Icon -->
            <div class="mb-5 sm:mb-7 relative">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span class="material-symbols-outlined text-[32px] sm:text-[40px]" style="font-variation-settings:'FILL' 1;">verified_user</span>
              </div>
              <div class="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1 rounded-full">
                <div class="bg-primary rounded-full p-1"><span class="material-symbols-outlined text-on-primary text-[10px]" style="font-variation-settings:'FILL' 1;">check</span></div>
              </div>
            </div>

            <h1 class="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-on-surface mb-2 sm:mb-3">Verify your Identity</h1>
            <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-[280px] sm:max-w-xs">
              Secure 11-digit Bank Verification Number (BVN) required for identity verification only.
            </p>

            <div v-if="error" class="w-full mb-4 p-3.5 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3 text-left animate-fade-in">
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span><span>{{ error }}</span>
            </div>
            <div v-if="success" class="w-full mb-4 p-3.5 rounded-xl bg-secondary-container text-on-secondary-container text-sm font-medium flex items-start gap-3 text-left animate-fade-in">
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">check_circle</span><span>{{ success }}</span>
            </div>

            <form class="w-full space-y-4" @submit.prevent="handleVerify">
              <div class="text-left">
                <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-0.5">BVN Number</label>
                <input v-model="form.bvn" class="w-full h-[52px] bg-transparent border border-outline-variant rounded-xl px-4 font-mono text-base tracking-[0.15em] focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40" maxlength="11" placeholder="00000000000" inputmode="numeric" pattern="[0-9]{11}" required @input="onBvnInput" />
              </div>
              <div class="text-left">
                <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-0.5">First Name</label>
                <input v-model="form.firstName" class="w-full h-[52px] bg-transparent border border-outline-variant rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40" placeholder="Ada" type="text" autocomplete="given-name" required />
              </div>
              <div class="text-left">
                <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-0.5">Last Name</label>
                <input v-model="form.lastName" class="w-full h-[52px] bg-transparent border border-outline-variant rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40" placeholder="Obi" type="text" autocomplete="family-name" required />
              </div>
              <div class="text-left">
                <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-0.5">Date of Birth</label>
                <input v-model="form.dateOfBirth" class="w-full h-[52px] bg-transparent border border-outline-variant rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface" type="date" required />
              </div>

              <button type="submit" :disabled="loading || form.bvn.length !== 11" class="w-full h-[52px] bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                <template v-if="loading"><svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Verifying...</template>
                <template v-else>Verify & Continue <span class="material-symbols-outlined text-sm">arrow_forward</span></template>
              </button>

              <button type="button" @click="showWhy = true" class="w-full text-primary font-semibold text-sm active:opacity-70 flex items-center justify-center gap-1 py-2">
                Why do we need this? <span class="material-symbols-outlined text-sm">help_outline</span>
              </button>
            </form>

            <div class="mt-6 sm:mt-8 flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
              <span class="material-symbols-outlined text-secondary text-lg" style="font-variation-settings:'FILL' 1;">lock</span>
              <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Your BVN is encrypted</span>
            </div>
          </div>
        </div>

        <!-- Compliance -->
        <div class="mt-6 sm:mt-10 flex flex-wrap justify-center items-center gap-3 sm:gap-6 opacity-60">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">shield</span>
            <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">CBN</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">security</span>
            <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">NDPR</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">PCI DSS</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Why Modal -->
    <Teleport to="body">
      <div v-if="showWhy" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showWhy = false">
        <div class="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 w-full sm:max-w-sm shadow-2xl border border-outline-variant/10 safe-bottom animate-fade-in">
          <div class="flex items-center gap-3 mb-4">
            <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings:'FILL' 1;">info</span>
            <h3 class="font-headline font-bold text-lg text-on-surface">Why we need your BVN</h3>
          </div>
          <div class="space-y-3 text-sm text-on-surface-variant leading-relaxed">
            <p>Your Bank Verification Number (BVN) is required by the Central Bank of Nigeria (CBN) for identity verification on all financial platforms.</p>
            <p>We use it solely to confirm your identity. Your BVN is encrypted in transit and <strong class="text-on-surface">never stored</strong> on our servers.</p>
          </div>
          <button @click="showWhy = false" class="mt-6 w-full h-[48px] bg-primary text-on-primary font-bold rounded-full active:scale-[0.97] transition-all text-sm">Got it</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Verify Identity | MediPay' })
const { user } = useAuth()
const { apiFetch } = useApi()

const nameParts = computed(() => {
  const parts = (user.value?.fullName || '').trim().split(/\s+/)
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' }
})

const form = reactive({
  bvn: '',
  firstName: nameParts.value.firstName,
  lastName: nameParts.value.lastName,
  dateOfBirth: user.value?.dateOfBirth || '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showWhy = ref(false)

const onBvnInput = (e: Event) => { form.bvn = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11) }

const handleVerify = async () => {
  error.value = ''; success.value = ''; loading.value = true
  try {
    const res: any = await apiFetch('/api/v1/verify/bvn', { method: 'POST', body: { bvn: form.bvn, firstName: form.firstName, lastName: form.lastName, dateOfBirth: form.dateOfBirth } })
    if (res.success) {
      success.value = 'Identity verified! Redirecting...'
      if (user.value) { user.value.isVerified = true; if (import.meta.client) localStorage.setItem('medipay_user', JSON.stringify(user.value)) }
      setTimeout(() => navigateTo('/dashboard'), 1500)
    } else error.value = res.message || 'BVN verification failed.'
  } catch (err: any) {
    error.value = err?.data?.error?.message || err?.data?.message || err?.message || 'Verification failed. Please check your details.'
  } finally { loading.value = false }
}
</script>