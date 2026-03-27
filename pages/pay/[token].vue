<template>
  <div class="bg-surface font-body text-on-surface antialiased min-h-screen">
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div class="flex justify-between items-center h-14 sm:h-16 px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto">
        <div class="font-headline font-black text-xl sm:text-2xl text-primary tracking-tight">MediPay</div>
        <div class="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm bg-primary-fixed/30 px-3 sm:px-4 py-1.5 rounded-full">
          <span class="material-symbols-outlined text-[18px]">lock</span><span>Secure Payment</span>
        </div>
      </div>
    </header>

    <main class="pt-20 sm:pt-24 pb-12 px-4 flex justify-center items-start min-h-screen">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <p class="text-on-surface-variant">Loading invoice...</p>
      </div>

      <!-- Error -->
      <div v-else-if="loadError" class="text-center py-20 max-w-md">
        <span class="material-symbols-outlined text-5xl text-error mb-4 block">error</span>
        <h2 class="font-headline font-bold text-xl mb-2">Invoice Not Found</h2>
        <p class="text-on-surface-variant text-sm">{{ loadError }}</p>
      </div>

      <!-- Invoice Loaded -->
      <div v-else-if="invoice" class="w-full max-w-[680px] space-y-6">
        <div class="bg-primary-fixed text-on-primary-fixed px-4 sm:px-6 py-4 rounded-xl flex items-center gap-3 sm:gap-4">
          <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">info</span>
          <p class="font-medium text-sm">You are paying invoice <span class="font-bold">{{ invoice.invoiceNumber }}</span></p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,62,126,0.04)] border border-outline-variant/15 overflow-hidden">
          <!-- Invoice Header -->
          <div class="p-6 sm:p-8 md:p-10 border-b border-surface-container">
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 class="font-headline font-bold text-xl sm:text-2xl text-on-surface tracking-tight">{{ invoice.providerName }}</h1>
                <p class="text-on-surface-variant text-sm font-medium">{{ invoice.invoiceNumber }}</p>
                <p v-if="invoice.providerBankName" class="text-on-surface-variant/50 text-xs mt-1">{{ invoice.providerBankName }} · {{ invoice.providerAccount }}</p>
                <div v-if="invoice.providerVerified" class="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-white rounded-full text-[9px] font-bold uppercase">
                  <span class="material-symbols-outlined text-[10px]" style="font-variation-settings:'FILL' 1;">verified</span> Verified Provider
                </div>
              </div>
              <div class="text-right">
                <p class="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Date</p>
                <p class="font-semibold text-on-surface text-sm">{{ fmtDate(invoice.invoiceDate) }}</p>
                <span class="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase" :class="stCls(invoice.status)">{{ invoice.status }}</span>
              </div>
            </div>

            <!-- Items -->
            <div class="mt-8 sm:mt-10 space-y-3">
              <div v-for="item in invoice.items" :key="item.description" class="flex justify-between items-center py-3 px-4 bg-surface-container-low rounded-lg">
                <span class="text-on-surface font-medium text-sm">{{ item.description }} × {{ item.quantity }}</span>
                <span class="font-mono text-on-surface text-sm">₦{{ item.total?.toLocaleString() }}</span>
              </div>
            </div>

            <div class="pt-6 mt-4 flex flex-col items-end gap-1">
              <div class="flex items-center gap-4 sm:gap-6">
                <span class="font-headline font-bold text-on-surface-variant">Total</span>
                <span class="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface">₦{{ invoice.total?.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="p-6 sm:p-8 md:p-10 bg-surface-container-low/50">
            <!-- Already paid -->
            <div v-if="invoice.status === 'paid'" class="text-center py-8">
              <span class="material-symbols-outlined text-5xl text-secondary mb-3 block" style="font-variation-settings:'FILL' 1;">check_circle</span>
              <h3 class="font-headline font-bold text-xl mb-2">Already Paid</h3>
              <p class="text-on-surface-variant text-sm">This invoice was settled on {{ fmtDate(invoice.paidAt) }}.</p>
            </div>

            <!-- Success -->
            <div v-else-if="paySuccess" class="text-center py-8">
              <span class="material-symbols-outlined text-5xl text-secondary mb-3 block" style="font-variation-settings:'FILL' 1;">check_circle</span>
              <h3 class="font-headline font-bold text-xl mb-2">Payment Initiated!</h3>
              <p class="text-on-surface-variant text-sm">{{ paySuccess }}</p>
            </div>

            <!-- Form -->
            <template v-else>
              <div v-if="payError" class="mb-6 p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium">{{ payError }}</div>

              <!-- Method Tabs -->
              <div class="flex gap-2 p-1 bg-surface-container rounded-full max-w-fit mb-6">
                <button @click="payMethod = 'card'" class="px-5 py-2 rounded-full text-sm font-bold transition-all" :class="payMethod === 'card' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'">Pay by Card</button>
                <button @click="payMethod = 'transfer'" class="px-5 py-2 rounded-full text-sm font-bold transition-all" :class="payMethod === 'transfer' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'">Bank Transfer</button>
              </div>

              <form @submit.prevent="handlePay" class="space-y-5">
                <div>
                  <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1 block mb-1.5">Your Name</label>
                  <input v-model="payForm.payerName" required class="w-full h-11 px-4 bg-transparent border border-outline-variant/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed outline-none transition-all text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1 block mb-1.5">Your Email</label>
                  <input v-model="payForm.payerEmail" type="email" required class="w-full h-11 px-4 bg-transparent border border-outline-variant/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed outline-none transition-all text-sm" placeholder="john@example.com" />
                </div>

                <div class="pt-4">
                  <button type="submit" :disabled="paying" class="w-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-base sm:text-lg py-3.5 sm:py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50">
                    {{ paying ? 'Processing...' : `Pay ₦${invoice.total?.toLocaleString()}` }}
                  </button>
                  <div class="mt-4 flex items-center justify-center gap-3">
                    <div class="h-[1px] flex-1 bg-outline-variant/20" />
                    <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Authorized Transaction</p>
                    <div class="h-[1px] flex-1 bg-outline-variant/20" />
                  </div>
                </div>
              </form>
            </template>
          </div>
        </div>

        <footer class="text-center space-y-3 pt-4">
          <p class="text-xs text-on-surface-variant font-medium flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[14px]">verified_user</span> Secured by Paystack & Interswitch · No account needed
          </p>
          <p class="text-[10px] text-outline font-medium uppercase tracking-tighter">MediPay never stores card details · © 2025 MediPay Wallet. PCI-DSS Compliant.</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Pay Invoice | MediPay' })
const route = useRoute()
const config = useRuntimeConfig()
const shareToken = route.params.token as string

const invoice = ref<any>(null)
const loading = ref(true)
const loadError = ref('')
const payMethod = ref('card')
const paying = ref(false)
const payError = ref('')
const paySuccess = ref('')
const payForm = reactive({ payerName: '', payerEmail: '' })

onMounted(async () => {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/api/v1/invoices/share/${shareToken}`)
    if (res.success) invoice.value = res.data
    else loadError.value = 'Invoice not found.'
  } catch (e: any) { loadError.value = e?.data?.error?.message || 'Invoice not found or has expired.' }
  finally { loading.value = false }
})

const handlePay = async () => {
  payError.value = ''; paying.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/api/v1/payments/initiate`, {
      method: 'POST',
      body: {
        invoiceId: invoice.value.id,
        shareToken,
        amount: invoice.value.total,
        payerName: payForm.payerName,
        payerEmail: payForm.payerEmail,
        paymentMethod: payMethod.value,
        processor: payMethod.value === 'card' ? 'paystack' : 'interswitch',
        callbackUrl: window.location.href + '?status=success',
      },
    })
    if (res.success) {
      if (res.data.checkout?.paymentUrl) window.location.href = res.data.checkout.paymentUrl
      else paySuccess.value = res.data.checkout?.message || 'Payment initiated successfully.'
    } else payError.value = res.error?.message || 'Payment failed.'
  } catch (e: any) { payError.value = e?.data?.error?.message || e?.message || 'Payment failed.' }
  finally { paying.value = false }
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
const stCls = (s: string) => {
  if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'
  if (s === 'open') return 'bg-tertiary/10 text-tertiary'
  return 'bg-error/10 text-error'
}
</script>