<template>
  <div
    class="bg-surface font-body text-on-surface selection:bg-primary-fixed-dim selection:text-on-primary-fixed"
  >
    <main class="min-h-screen flex flex-col lg:flex-row">
      <!-- Left Side: Branding -->
      <section
        class="hidden lg:flex w-1/2 bg-primary-container relative flex-col justify-center items-center px-8 py-12 xl:px-20 overflow-hidden"
      >
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div
            class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary blur-[120px]"
          />
          <div
            class="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary blur-[100px]"
          />
        </div>

        <div class="relative z-10 w-full max-w-lg">
          <header class="mb-12">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg"
              >
                <span
                  class="material-symbols-outlined text-primary-container text-2xl"
                  style="font-variation-settings: 'FILL' 1"
                >medical_services</span>
              </div>
              <h1 class="font-headline font-extrabold text-3xl tracking-tight text-white">
                MediPay
              </h1>
            </div>
          </header>

          <div class="space-y-8">
            <h2 class="font-headline font-bold text-4xl xl:text-6xl text-white leading-tight">
              Your health fund, always ready.
            </h2>
            <ul class="space-y-6">
              <li class="flex items-center gap-4 text-primary-fixed">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-lg">savings</span>
                </div>
                <span class="font-medium text-lg">Save daily</span>
              </li>
              <li class="flex items-center gap-4 text-primary-fixed">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-lg">receipt_long</span>
                </div>
                <span class="font-medium text-lg">Pay any bill</span>
              </li>
              <li class="flex items-center gap-4 text-primary-fixed">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
                </div>
                <span class="font-medium text-lg">Fund from anywhere</span>
              </li>
            </ul>
          </div>

          <div class="mt-20 glass-panel p-6 rounded-2xl flex items-center gap-4">
            <div class="flex -space-x-3">
              <img
                v-for="(src, i) in avatars"
                :key="i"
                :src="src"
                class="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                alt="User"
              />
            </div>
            <div>
              <p class="text-white text-sm font-semibold">Join 50,000+ Nigerians</p>
              <p class="text-primary-fixed text-xs">Securing their health future today.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Side: Form -->
      <section
        class="w-full lg:w-1/2 bg-surface-bright flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 md:px-12 relative min-h-screen"
      >
        <div class="w-full max-w-md">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex items-center gap-2 mb-8">
            <span
              class="material-symbols-outlined text-primary-container text-3xl"
              style="font-variation-settings: 'FILL' 1"
            >medical_services</span>
            <span class="font-headline font-extrabold text-2xl tracking-tight text-primary-container">
              MediPay
            </span>
          </div>

          <div
            class="bg-surface-container-lowest p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10"
          >
            <header class="mb-6 sm:mb-8">
              <h2 class="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-2">
                Create your wallet
              </h2>
              <p class="text-on-surface-variant font-medium text-sm sm:text-base">
                Takes under 2 minutes
              </p>
            </header>

            <!-- Alerts -->
            <div
              v-if="error"
              class="mb-5 p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3"
            >
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
              <span>{{ error }}</span>
            </div>
            <div
              v-if="success"
              class="mb-5 p-4 rounded-lg bg-secondary-container text-on-secondary-container text-sm font-medium flex items-start gap-3"
            >
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">check_circle</span>
              <span>{{ success }}</span>
            </div>

            <form class="space-y-4 sm:space-y-5" @submit.prevent="handleRegister">
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-on-surface ml-1">Full Name</label>
                <input
                  v-model="form.fullName"
                  class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/50 text-sm sm:text-base"
                  placeholder="Ada Obi"
                  type="text"
                  required
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-on-surface ml-1">Email Address</label>
                <input
                  v-model="form.email"
                  class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/50 text-sm sm:text-base"
                  placeholder="ada@example.com"
                  type="email"
                  required
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-on-surface ml-1">Phone Number</label>
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium border-r border-outline-variant pr-3 text-sm"
                  >+234</span>
                  <input
                    v-model="form.phone"
                    class="w-full h-12 pl-[4.5rem] pr-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/50 text-sm sm:text-base"
                    placeholder="08012345678"
                    type="tel"
                    required
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-on-surface ml-1">Date of Birth</label>
                <input
                  v-model="form.dateOfBirth"
                  class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/50 text-sm sm:text-base"
                  type="date"
                  required
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-on-surface ml-1">Password</label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    class="w-full h-12 px-4 pr-12 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/50 text-sm sm:text-base"
                    placeholder="••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                  />
                  <button
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined text-xl">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </div>

              <div class="pt-3 sm:pt-4">
                <button
                  type="submit"
                  class="w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                  :disabled="loading"
                >
                  <span v-if="loading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating your wallet...
                  </span>
                  <span v-else>Create My Wallet</span>
                </button>
              </div>
            </form>

            <p class="mt-6 sm:mt-8 text-center text-sm text-on-surface-variant">
              Already have a wallet?
              <NuxtLink to="/login" class="text-primary font-bold hover:underline">Sign In</NuxtLink>
            </p>
          </div>

          <!-- Trust Footer -->
          <footer class="mt-8 sm:mt-12 flex flex-col items-center gap-4 sm:gap-6">
            <div
              class="flex flex-wrap justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-on-surface-variant/70"
            >
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">verified_user</span> 256-bit SSL
              </span>
              <span class="hidden sm:inline text-outline-variant/30">&bull;</span>
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">account_balance</span> CBN Compliant
              </span>
              <span class="hidden sm:inline text-outline-variant/30">&bull;</span>
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">security</span> Secured by Interswitch
              </span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Create Your Wallet | MediPay' })

const { setAuth } = useAuth()
const { apiFetch } = useApi()

const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5TKmmOpPGeWfotCn_X7pS31_TcoXp_xsc5pEbEzjDa4gaDYgTjnBzv48d38F_EAwFJbNiH3a024uj5alHcH8vvEHqmBM14H4JraBFCgodjr6GCL763UJgOdL3y61kx7dvOkuJ9rdMeJAXma_uiEgF50IRP3JcOptc7rbpOZ9GLrrYbnPBVYBckX-U90HFRsXhsGPg1nNGge2HpvgV-8NUyi0rcNxEMlGD0PDbMgGVeDL3yXg57F8VmPX-_uWfESIIHFyvdZeKSHzV',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDsa1aI9_XHUkAzNDnqqPSpcgUw87outmrZGm3RPFP3TjcUCOWHbQFkizfCm7APqRKleSO3v2RJE8uP7It09cgRM7blfp8mdLBTLRy2LJsu2J8Nt1wtQUisEEN0pMXxU-p4gFZ2W3OhFLbLU6yx-i8JitoFTE4ldJlLkPe5LYoRG7XqHnfUrn2R6qjBmRvwUSoM-HT2nxu1ILM45r_qGT6g70BbZ_V-2AqAPWynBdEWlkbNc3KegEJS1SBSFjIwZA2uxaxZA48bG6F',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ok4v1vlbztw2cpQ7HOFwTQzo5J2QQE7PgL0V-3_PPJziTf5IIB0Tw1pBUW0tEIlki5mkQgC31x6QzN7gCJnd93d4JhnsehbjztyxHBxnbiwIFFGMT0Fc19Lrn4liPADzXRzXZMDTEINH7hJJCKbjZZUXDXwsCYsKm_6TxXgJ8TMZB_Bhx_YD7RAATn_xhoGKX_a-Qh2tYFiYrDqwZ21beMHTKU7kDHGjkdsEMQN6-1Ids7INaV4XQ5MSDz3afEh619BhSTHwq1nU',
]

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const res: any = await apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
      },
    })

    if (res.success && res.data) {
      // Save token, user, wallet globally
      setAuth({
        token: res.data.token,
        user: res.data.user,
        wallet: res.data.wallet,
      })

      success.value = 'Wallet created successfully! Redirecting to verification...'

      setTimeout(() => {
        navigateTo('/verify-bvn')
      }, 1500)
    } else {
      error.value = res.message || 'Something went wrong.'
    }
  } catch (err: any) {
    error.value =
      err?.data?.message || err?.data?.error || err?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style>
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>