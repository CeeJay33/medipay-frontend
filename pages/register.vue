<template>
  <div class="bg-surface font-body text-on-surface">
    <main class="flex flex-col lg:flex-row min-h-screen min-h-[100dvh]">
      <!-- Left: Branding (desktop) -->
      <section class="hidden lg:flex w-1/2 bg-primary-container relative flex-col justify-center items-center px-8 xl:px-20 py-12 overflow-hidden">
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary blur-[120px]" />
          <div class="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary blur-[100px]" />
        </div>
        <div class="relative z-10 w-full max-w-lg">
          <header class="mb-12">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span class="material-symbols-outlined text-primary-container text-2xl" style="font-variation-settings:'FILL' 1;">medical_services</span>
              </div>
              <h1 class="font-headline font-extrabold text-3xl tracking-tight text-white">MediPay</h1>
            </div>
          </header>
          <div class="space-y-8">
            <h2 class="font-headline font-bold text-4xl xl:text-5xl text-white leading-tight">Your health fund, always ready.</h2>
            <ul class="space-y-5">
              <li v-for="f in ['Save daily', 'Pay any bill', 'Fund from anywhere']" :key="f" class="flex items-center gap-4 text-primary-fixed">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-white text-lg">check</span></div>
                <span class="font-medium text-lg">{{ f }}</span>
              </li>
            </ul>
          </div>
          <div class="mt-16 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex items-center gap-4">
            <div class="flex -space-x-2">
              <div v-for="n in 3" :key="n" class="w-9 h-9 rounded-full border-2 border-primary-container bg-white/20 flex items-center justify-center"><span class="material-symbols-outlined text-white text-sm">person</span></div>
            </div>
            <div>
              <p class="text-white text-sm font-semibold">Join 50,000+ Nigerians</p>
              <p class="text-primary-fixed text-xs">Securing their health future today.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Form -->
      <section class="w-full lg:w-1/2 bg-surface-bright flex flex-col min-h-screen min-h-[100dvh] safe-top safe-bottom">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center gap-2 px-5 pt-5">
          <span class="material-symbols-outlined text-primary-container text-[28px]" style="font-variation-settings:'FILL' 1;">medical_services</span>
          <span class="font-headline font-extrabold text-xl tracking-tight text-primary-container">MediPay</span>
        </div>

        <div class="flex-1 flex items-center justify-center px-5 sm:px-8 py-6">
          <div class="w-full max-w-[420px]">
            <div class="bg-surface-container-lowest p-5 sm:p-7 md:p-8 rounded-2xl shadow-sm border border-outline-variant/10">
              <header class="mb-6">
                <h2 class="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-1.5">Create your wallet</h2>
                <p class="text-on-surface-variant font-medium text-sm">Takes under 2 minutes</p>
              </header>

              <div v-if="error" class="mb-5 p-3.5 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3 animate-fade-in">
                <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span><span>{{ error }}</span>
              </div>
              <div v-if="success" class="mb-5 p-3.5 rounded-xl bg-secondary-container text-on-secondary-container text-sm font-medium flex items-start gap-3 animate-fade-in">
                <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">check_circle</span><span>{{ success }}</span>
              </div>

              <form class="space-y-4" @submit.prevent="handleRegister">
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-on-surface ml-0.5">Full Name</label>
                  <input v-model="form.fullName" class="w-full h-[52px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/40" placeholder="Ada Obi" type="text" autocomplete="name" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-on-surface ml-0.5">Email</label>
                  <input v-model="form.email" class="w-full h-[52px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/40" placeholder="ada@example.com" type="email" inputmode="email" autocomplete="email" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-on-surface ml-0.5">Phone Number</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium border-r border-outline-variant pr-3 text-sm">+234</span>
                    <input v-model="form.phone" class="w-full h-[52px] pl-[4.5rem] pr-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/40" placeholder="08012345678" type="tel" inputmode="tel" autocomplete="tel" required />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-on-surface ml-0.5">Date of Birth</label>
                  <input v-model="form.dateOfBirth" class="w-full h-[52px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface" type="date" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-on-surface ml-0.5">Password</label>
                  <div class="relative">
                    <input v-model="form.password" class="w-full h-[52px] px-4 pr-12 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/40" placeholder="••••••••" :type="showPw ? 'text' : 'password'" autocomplete="new-password" required minlength="6" />
                    <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-outline hover:text-primary transition-colors rounded-full active:bg-surface-container">
                      <span class="material-symbols-outlined text-[20px]">{{ showPw ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>
                <div class="pt-2">
                  <button type="submit" :disabled="loading" class="w-full h-[52px] bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    <template v-if="loading"><svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating...</template>
                    <template v-else>Create My Wallet</template>
                  </button>
                </div>
              </form>
              <p class="mt-5 text-center text-sm text-on-surface-variant">
                Already have a wallet? <NuxtLink to="/login" class="text-primary font-bold active:opacity-70">Sign In</NuxtLink>
              </p>
            </div>
          </div>
        </div>

        <div class="px-5 pb-3 sm:pb-5 text-center">
          <div class="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10px] font-medium text-on-surface-variant/50 uppercase tracking-widest">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">verified_user</span> 256-bit SSL</span>
            <span class="text-outline-variant/30">·</span><span>CBN Compliant</span>
            <span class="text-outline-variant/30">·</span><span>Interswitch</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Create Your Wallet | MediPay' })
const { setAuth } = useAuth()
const { apiFetch } = useApi()

const form = reactive({ fullName: '', email: '', phone: '', dateOfBirth: '', password: '' })
const loading = ref(false)
const showPw = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''; success.value = ''; loading.value = true
  try {
    const res: any = await apiFetch('/api/v1/auth/register', { method: 'POST', body: { ...form } })
    if (res.success && res.data) {
      setAuth({ token: res.data.token, user: res.data.user, wallet: res.data.wallet })
      success.value = 'Wallet created! Redirecting...'
      setTimeout(() => navigateTo('/verify-bvn'), 1500)
    } else error.value = res.message || 'Something went wrong.'
  } catch (err: any) {
    error.value = err?.data?.error?.message || err?.data?.message || err?.message || 'Registration failed. Please try again.'
  } finally { loading.value = false }
}
</script>