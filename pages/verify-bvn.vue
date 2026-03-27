<template>
  <div class="bg-surface text-on-surface font-body min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex justify-center items-center px-4 sm:px-6 py-6 sm:py-8 w-full z-50">
      <NuxtLink to="/" class="text-primary font-headline font-extrabold tracking-tight text-xl sm:text-2xl">
        MediPay
      </NuxtLink>
    </header>

    <!-- Main -->
    <main class="flex-grow flex items-center justify-center px-4 pb-16 sm:pb-20">
      <div class="max-w-md w-full">
        <!-- Card -->
        <div
          class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_20px_40px_rgba(0,62,126,0.06)] border border-outline-variant/10"
        >
          <div class="flex flex-col items-center text-center">
            <!-- Icon -->
            <div class="mb-6 sm:mb-8 relative">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container"
              >
                <span
                  class="material-symbols-outlined text-3xl sm:text-4xl"
                  style="font-variation-settings: 'FILL' 1"
                >verified_user</span>
              </div>
              <div class="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1 rounded-full">
                <div class="bg-primary rounded-full p-1">
                  <span
                    class="material-symbols-outlined text-on-primary text-xs"
                    style="font-variation-settings: 'FILL' 1"
                  >check</span>
                </div>
              </div>
            </div>

            <!-- Heading -->
            <h1 class="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-3 sm:mb-4">
              Verify your Identity
            </h1>
            <p
              class="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 max-w-xs"
            >
              Secure 11-digit Bank Verification Number (BVN) required for identity verification
              only. We never store this number.
            </p>

            <!-- Alerts -->
            <div
              v-if="error"
              class="w-full mb-5 p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3 text-left"
            >
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
              <span>{{ error }}</span>
            </div>
            <div
              v-if="success"
              class="w-full mb-5 p-4 rounded-lg bg-secondary-container text-on-secondary-container text-sm font-medium flex items-start gap-3 text-left"
            >
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5">check_circle</span>
              <span>{{ success }}</span>
            </div>

            <!-- Form -->
            <form class="w-full space-y-5 sm:space-y-6" @submit.prevent="handleVerify">
              <!-- BVN -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3 ml-1"
                  for="bvn"
                >
                  BVN Number
                </label>
                <input
                  id="bvn"
                  v-model="form.bvn"
                  class="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 font-mono text-base sm:text-lg tracking-[0.2em] focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40"
                  maxlength="11"
                  placeholder="00000000000"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]{11}"
                  required
                  @input="onBvnInput"
                />
              </div>

              <!-- First Name -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3 ml-1"
                  for="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  class="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40 text-sm sm:text-base"
                  placeholder="Ada"
                  type="text"
                  required
                />
              </div>

              <!-- Last Name -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3 ml-1"
                  for="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  class="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline/40 text-sm sm:text-base"
                  placeholder="Obi"
                  type="text"
                  required
                />
              </div>

              <!-- Date of Birth -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3 ml-1"
                  for="dob"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  v-model="form.dateOfBirth"
                  class="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface text-sm sm:text-base"
                  type="date"
                  required
                />
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                :disabled="loading || form.bvn.length !== 11"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
                <span v-else class="flex items-center gap-2">
                  Verify &amp; Continue
                  <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </button>

              <!-- Help Link -->
              <div class="pt-2">
                <button
                  type="button"
                  class="text-primary font-semibold text-sm hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-1 mx-auto"
                  @click="showWhyModal = true"
                >
                  Why do we need this?
                  <span class="material-symbols-outlined text-sm">help_outline</span>
                </button>
              </div>
            </form>

            <!-- Trust Badge -->
            <div
              class="mt-8 sm:mt-12 flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full"
            >
              <span
                class="material-symbols-outlined text-secondary text-lg"
                style="font-variation-settings: 'FILL' 1"
              >lock</span>
              <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                Your BVN is encrypted
              </span>
            </div>
          </div>
        </div>

        <!-- Compliance Footer -->
        <div class="mt-8 sm:mt-12 flex flex-col items-center gap-4 sm:gap-6 opacity-60">
          <div class="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded bg-surface-container-high flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-sm">shield</span>
              </div>
              <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">
                CBN COMPLIANT
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded bg-surface-container-high flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-sm">security</span>
              </div>
              <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">
                NDPR CERTIFIED
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded bg-surface-container-high flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-sm">enhanced_encryption</span>
              </div>
              <span class="text-[10px] font-bold text-on-surface-variant tracking-tighter">
                PCI DSS
              </span>
            </div>
          </div>
          <p class="font-label text-xs font-medium uppercase tracking-widest text-slate-400">
            © 2025 MediPay Wallet. Secure Clinical Financing.
          </p>
        </div>
      </div>
    </main>

    <!-- Why BVN Modal -->
    <Teleport to="body">
      <div
        v-if="showWhyModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showWhyModal = false"
      >
        <div
          class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-outline-variant/10"
        >
          <div class="flex items-center gap-3 mb-4">
            <span
              class="material-symbols-outlined text-primary text-2xl"
              style="font-variation-settings: 'FILL' 1"
            >info</span>
            <h3 class="font-headline font-bold text-lg text-on-surface">Why we need your BVN</h3>
          </div>
          <div class="space-y-3 text-sm text-on-surface-variant leading-relaxed">
            <p>
              Your Bank Verification Number (BVN) is required by the Central Bank of Nigeria (CBN)
              for identity verification on all financial platforms.
            </p>
            <p>
              We use it solely to confirm your identity. Your BVN is encrypted in transit and
              <strong class="text-on-surface">never stored</strong> on our servers.
            </p>
          </div>
          <button
            class="mt-6 w-full py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all text-sm"
            @click="showWhyModal = false"
          >
            Got it
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Support FAB -->
    <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 bg-surface-container-lowest border border-outline-variant/20 rounded-full flex items-center justify-center shadow-xl text-primary hover:bg-primary hover:text-on-primary transition-all"
      >
        <span class="material-symbols-outlined text-xl">support_agent</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Verify Identity | MediPay' })

const { user } = useAuth()
const { apiFetch } = useApi()

// Pre-fill from registration data
const nameParts = computed(() => {
  const full = user.value?.fullName || ''
  const parts = full.trim().split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  }
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
const showWhyModal = ref(false)

// Only allow digits in BVN
const onBvnInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  form.bvn = input.value.replace(/\D/g, '').slice(0, 11)
}

const handleVerify = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const res: any = await apiFetch('/api/v1/verify/bvn', {
      method: 'POST',
      body: {
        bvn: form.bvn,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
      },
    })

    if (res.success) {
      success.value = 'Identity verified successfully! Redirecting...'

      // Update user verification status locally
      if (user.value) {
        user.value.isVerified = true
        if (import.meta.client) {
          localStorage.setItem('medipay_user', JSON.stringify(user.value))
        }
      }

      setTimeout(() => {
        navigateTo('/dashboard')
      }, 1500)
    } else {
      error.value = res.message || 'BVN verification failed.'
    }
  } catch (err: any) {
    error.value =
      err?.data?.message || err?.data?.error || err?.message || 'Verification failed. Please check your details and try again.'
  } finally {
    loading.value = false
  }
}
</script>