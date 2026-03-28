<template>
  <div class="bg-background font-body text-on-surface antialiased">
    <main class="flex min-h-screen min-h-[100dvh] w-full">
      <!-- Left: Branding (desktop only) -->
      <section class="hidden lg:flex w-1/2 bg-primary-container relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div class="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg fill="none" height="100%" viewBox="0 0 800 800" width="100%">
            <circle cx="600" cy="200" r="400" stroke="white" stroke-width="2" />
            <circle cx="600" cy="200" r="300" stroke="white" stroke-width="2" />
            <circle cx="600" cy="200" r="200" stroke="white" stroke-width="2" />
          </svg>
        </div>
        <div class="z-10">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center">
              <span class="material-symbols-outlined text-primary font-bold" style="font-variation-settings:'FILL' 1;">medical_services</span>
            </div>
            <span class="font-headline font-black text-2xl tracking-tight text-white">MediPay</span>
          </div>
        </div>
        <div class="z-10 max-w-lg">
          <h1 class="font-headline font-extrabold text-4xl xl:text-5xl text-white mb-10 leading-tight">Secure Your Health Fund</h1>
          <ul class="space-y-7">
            <li v-for="f in features" :key="f.title" class="flex items-start gap-4">
              <div class="mt-1 shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings:'FILL' 1;">{{ f.icon }}</span>
              </div>
              <div>
                <p class="font-headline font-bold text-lg text-white">{{ f.title }}</p>
                <p class="text-on-primary-container opacity-80 text-sm mt-1">{{ f.desc }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="z-10 mt-auto"><div class="w-full h-40 rounded-xl bg-white/5" /></div>
      </section>

      <!-- Right: Login Form -->
      <section class="w-full lg:w-1/2 bg-surface-container-lowest flex flex-col min-h-screen min-h-[100dvh] safe-top safe-bottom">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2 px-6 pt-6">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-lg" style="font-variation-settings:'FILL' 1;">medical_services</span>
          </div>
          <span class="font-headline font-bold text-xl text-primary">MediPay</span>
        </div>

        <!-- Form centered -->
        <div class="flex-1 flex items-center justify-center px-5 sm:px-8 py-8">
          <div class="w-full max-w-[420px] space-y-7">
            <div class="space-y-2">
              <h2 class="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">Welcome Back</h2>
              <p class="text-on-surface-variant font-medium text-sm">Sign in to manage your wallet</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3 animate-fade-in">
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
              <span>{{ error }}</span>
            </div>

            <form class="space-y-5" @submit.prevent="handleLogin">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-on-surface-variant" for="phone">Phone Number</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <div class="flex items-center gap-2 pr-2 border-r border-outline-variant/30">
                      <span class="text-on-surface font-medium text-sm">+234</span>
                    </div>
                  </div>
                  <input v-model="form.phone" id="phone" class="w-full h-[52px] pl-20 pr-4 bg-transparent border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface" placeholder="800 000 0000" type="tel" inputmode="tel" autocomplete="tel" required />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="block text-sm font-semibold text-on-surface-variant" for="password">Password</label>
                  <a class="text-sm font-bold text-primary active:opacity-70" href="#">Forgot?</a>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant">
                    <span class="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input v-model="form.password" id="password" class="w-full h-[52px] pl-11 pr-12 bg-transparent border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface" placeholder="••••••••" :type="showPass ? 'text' : 'password'" autocomplete="current-password" required />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-outline hover:text-primary transition-colors rounded-full active:bg-surface-container" @click="showPass = !showPass">
                    <span class="material-symbols-outlined text-[20px]">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>

              <div class="space-y-3 pt-2">
                <button type="submit" :disabled="loading" class="w-full h-[52px] bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold text-base shadow-lg active:scale-[0.97] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2">
                  <template v-if="loading">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in...
                  </template>
                  <template v-else>Sign In <span class="material-symbols-outlined text-sm">arrow_forward</span></template>
                </button>

                <div class="relative flex py-3 items-center">
                  <div class="flex-grow border-t border-outline-variant/20" />
                  <span class="flex-shrink mx-4 text-on-surface-variant text-sm font-medium">or</span>
                  <div class="flex-grow border-t border-outline-variant/20" />
                </div>

                <NuxtLink to="/register" class="block">
                  <button type="button" class="w-full h-[52px] bg-transparent border border-outline-variant/30 text-primary rounded-full font-bold active:scale-[0.97] active:bg-surface-container transition-all">
                    Create a new account
                  </button>
                </NuxtLink>
              </div>
            </form>

            <div class="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-on-surface-variant/50">
              <a class="active:text-primary" href="#">HELP</a>
              <a class="active:text-primary" href="#">PRIVACY</a>
              <a class="active:text-primary" href="#">SUPPORT</a>
            </div>
          </div>
        </div>

        <!-- Bottom trust -->
        <div class="px-6 pb-4 sm:pb-6 text-center">
          <div class="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10px] font-medium text-on-surface-variant/50 uppercase tracking-widest">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px] text-secondary" style="font-variation-settings:'FILL' 1;">verified_user</span> 256-bit SSL</span>
            <span class="text-outline-variant/30">·</span>
            <span>CBN Compliant</span>
            <span class="text-outline-variant/30">·</span>
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px] text-primary" style="font-variation-settings:'FILL' 1;">shield</span> Interswitch</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Sign In | MediPay' })
const { setAuth } = useAuth()
const { apiFetch } = useApi()

const form = reactive({ phone: '', password: '' })
const loading = ref(false)
const showPass = ref(false)
const error = ref('')

const features = [
  { icon: 'check_circle', title: 'Instant access', desc: 'Immediate availability of medical funds whenever you need them most.' },
  { icon: 'analytics', title: 'Daily savings overview', desc: 'Track your healthcare wallet growth with detailed real-time insights.' },
  { icon: 'public', title: 'Global funding', desc: 'Seamlessly receive health contributions from across the globe.' },
]

const handleLogin = async () => {
  error.value = ''; loading.value = true
  try {
    const res: any = await apiFetch('/api/v1/auth/login', { method: 'POST', body: { phone: form.phone, password: form.password } })
    if (res.success && res.data) { setAuth({ token: res.data.token, user: res.data.user, wallet: res.data.wallet }); navigateTo('/dashboard') }
    else error.value = res.message || 'Login failed.'
  } catch (err: any) {
    error.value = err?.data?.error?.message || err?.data?.message || err?.message || 'Login failed. Please try again.'
  } finally { loading.value = false }
}
</script>