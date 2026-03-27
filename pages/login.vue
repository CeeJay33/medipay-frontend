<template>
  <div class="bg-background font-body text-on-surface antialiased min-h-screen">
    <main class="flex min-h-screen w-full">
      <!-- Left: Branding -->
      <section class="hidden lg:flex w-1/2 bg-primary-container relative overflow-hidden flex-col justify-between p-16">
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
          <h1 class="font-headline font-extrabold text-5xl text-white mb-12 leading-tight">Secure Your Health Fund</h1>
          <ul class="space-y-8">
            <li class="flex items-start gap-4">
              <div class="mt-1 shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings:'FILL' 1;">check_circle</span>
              </div>
              <div>
                <p class="font-headline font-bold text-xl text-white">Instant access</p>
                <p class="text-on-primary-container opacity-80 text-sm mt-1">Immediate availability of medical funds whenever you need them most.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings:'FILL' 1;">analytics</span>
              </div>
              <div>
                <p class="font-headline font-bold text-xl text-white">Daily savings overview</p>
                <p class="text-on-primary-container opacity-80 text-sm mt-1">Track your healthcare wallet growth with detailed real-time insights.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings:'FILL' 1;">public</span>
              </div>
              <div>
                <p class="font-headline font-bold text-xl text-white">Global funding</p>
                <p class="text-on-primary-container opacity-80 text-sm mt-1">Seamlessly receive health contributions from across the globe.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="z-10 mt-auto opacity-40">
          <div class="w-full h-48 rounded-xl bg-white/5" />
        </div>
      </section>

      <!-- Right: Login Form -->
      <section class="w-full lg:w-1/2 bg-surface-container-lowest flex flex-col justify-center items-center p-6 sm:p-8 md:p-16 relative min-h-screen">
        <div class="lg:hidden absolute top-8 left-6 sm:top-12 sm:left-12 flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-lg" style="font-variation-settings:'FILL' 1;">medical_services</span>
          </div>
          <span class="font-headline font-bold text-xl text-primary">MediPay</span>
        </div>

        <div class="w-full max-w-[440px] space-y-8 mt-16 lg:mt-0">
          <div class="space-y-2">
            <h2 class="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">Welcome Back</h2>
            <p class="text-on-surface-variant font-medium text-sm sm:text-base">Sign in to manage your wallet</p>
          </div>

          <!-- Alerts -->
          <div v-if="error" class="p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3">
            <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
            <span>{{ error }}</span>
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-on-surface-variant" for="phone">Phone Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <div class="flex items-center gap-2 pr-2 border-r border-outline-variant/30">
                    <span class="text-on-surface font-medium text-sm">+234</span>
                  </div>
                </div>
                <input v-model="form.phone" id="phone" class="w-full pl-20 pr-4 py-3 bg-transparent border border-outline-variant/40 rounded-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface text-sm sm:text-base" placeholder="800 000 0000" type="tel" required />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-sm font-semibold text-on-surface-variant" for="password">Password</label>
                <a class="text-sm font-bold text-primary hover:text-primary-container transition-colors" href="#">Forgot password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant">
                  <span class="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input v-model="form.password" id="password" class="w-full pl-11 pr-4 py-3 bg-transparent border border-outline-variant/40 rounded-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface text-sm sm:text-base" placeholder="••••••••" :type="showPass ? 'text' : 'password'" required />
                <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" @click="showPass = !showPass">
                  <span class="material-symbols-outlined text-xl">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="space-y-4 pt-2">
              <button type="submit" :disabled="loading" class="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="loading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
                <template v-else>
                  <span>Sign In</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </template>
              </button>

              <div class="relative flex py-4 items-center">
                <div class="flex-grow border-t border-outline-variant/20" />
                <span class="flex-shrink mx-4 text-on-surface-variant text-sm font-medium">or</span>
                <div class="flex-grow border-t border-outline-variant/20" />
              </div>

              <NuxtLink to="/register">
                <button type="button" class="w-full py-3.5 sm:py-4 px-6 bg-transparent border border-outline-variant/30 text-primary rounded-full font-bold hover:bg-surface-container transition-colors active:scale-[0.98]">
                  Create a new account
                </button>
              </NuxtLink>
            </div>
          </form>

          <div class="flex items-center justify-center gap-4 sm:gap-6 pt-4 text-[10px] sm:text-xs font-semibold text-on-surface-variant opacity-60">
            <a class="hover:text-primary transition-colors" href="#">HELP CENTER</a>
            <a class="hover:text-primary transition-colors" href="#">PRIVACY POLICY</a>
            <a class="hover:text-primary transition-colors" href="#">CONTACT SUPPORT</a>
          </div>
        </div>

        <footer class="absolute bottom-6 sm:bottom-8 w-full px-6 sm:px-8 text-center">
          <div class="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[10px] sm:text-xs font-medium text-on-surface-variant/70 uppercase tracking-widest">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-secondary" style="font-variation-settings:'FILL' 1;">verified_user</span> 256-bit SSL
            </span>
            <span class="w-1 h-1 bg-outline-variant/50 rounded-full" />
            <span>CBN Compliant</span>
            <span class="w-1 h-1 bg-outline-variant/50 rounded-full" />
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings:'FILL' 1;">shield</span> Secured by Interswitch
            </span>
          </div>
        </footer>
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

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res: any = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: { phone: form.phone, password: form.password },
    })
    if (res.success && res.data) {
      setAuth({ token: res.data.token, user: res.data.user, wallet: res.data.wallet })
      navigateTo('/dashboard')
    } else {
      error.value = res.message || 'Login failed.'
    }
  } catch (err: any) {
    error.value = err?.data?.error?.message || err?.data?.message || err?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>