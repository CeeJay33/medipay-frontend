<template>
  <div class="bg-surface font-body text-on-surface antialiased min-h-screen min-h-[100dvh] safe-top safe-bottom">
    <header class="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm safe-top">
      <div class="flex justify-between items-center h-14 px-4 sm:px-6 max-w-[680px] mx-auto">
        <NuxtLink to="/" class="font-headline font-black text-xl text-primary tracking-tight">MediPay</NuxtLink>
        <div class="flex items-center gap-2 text-primary font-semibold text-[11px] sm:text-xs bg-primary-fixed/30 px-3 py-1.5 rounded-full">
          <span class="material-symbols-outlined text-[16px]">lock</span><span>Secure</span>
        </div>
      </div>
    </header>

    <main class="px-4 sm:px-6 py-6 sm:py-8 max-w-[680px] mx-auto">
      <div v-if="loading" class="text-center py-16"><svg class="animate-spin h-7 w-7 mx-auto text-primary mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><p class="text-on-surface-variant text-sm">Loading...</p></div>
      <div v-else-if="loadError" class="text-center py-16"><span class="material-symbols-outlined text-4xl text-error mb-3 block">error</span><h2 class="font-headline font-bold text-lg mb-1">Not Found</h2><p class="text-on-surface-variant text-sm">{{ loadError }}</p></div>

      <div v-else-if="invoice" class="space-y-4 sm:space-y-6">
        <div class="bg-primary-fixed text-on-primary-fixed px-4 py-3.5 rounded-xl flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings:'FILL' 1;">info</span>
          <p class="font-medium text-sm">Invoice <span class="font-bold">{{ invoice.invoiceNumber }}</span></p>
        </div>

        <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
          <div class="p-5 sm:p-7 border-b border-surface-container">
            <div class="flex justify-between items-start gap-3">
              <div class="min-w-0"><h1 class="font-headline font-bold text-lg sm:text-xl text-on-surface truncate">{{ invoice.providerName }}</h1><p class="text-on-surface-variant text-xs sm:text-sm">{{ invoice.invoiceNumber }}</p></div>
              <span class="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase" :class="stCls(invoice.status)">{{ invoice.status }}</span>
            </div>
            <div class="mt-5 sm:mt-7 space-y-2">
              <div v-for="item in invoice.items" :key="item.description" class="flex justify-between items-center py-2.5 px-3.5 bg-surface-container-low rounded-xl text-sm">
                <span class="text-on-surface font-medium truncate mr-2">{{ item.description }} × {{ item.quantity }}</span>
                <span class="font-mono text-on-surface shrink-0">₦{{ item.total?.toLocaleString() }}</span>
              </div>
            </div>
            <div class="pt-4 mt-3 flex justify-between items-end">
              <span class="font-bold text-on-surface-variant text-sm">Total</span>
              <span class="font-headline font-extrabold text-2xl text-on-surface">₦{{ invoice.total?.toLocaleString() }}</span>
            </div>
          </div>

          <div class="p-5 sm:p-7 bg-surface-container-low/50">
            <!-- Paid -->
            <div v-if="invoice.status === 'paid' || invoice.status === 'settled'" class="text-center py-6">
              <span class="material-symbols-outlined text-4xl text-secondary mb-2 block" style="font-variation-settings:'FILL' 1;">check_circle</span>
              <h3 class="font-headline font-bold text-lg mb-1">Paid</h3>
              <p class="text-on-surface-variant text-sm">This invoice has been settled.</p>
              <NuxtLink v-if="isLoggedIn" to="/dashboard" class="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm active:scale-95">Dashboard</NuxtLink>
            </div>
            <!-- Cancelled -->
            <div v-else-if="invoice.status === 'cancelled'" class="text-center py-6">
              <span class="material-symbols-outlined text-4xl text-error mb-2 block">cancel</span>
              <h3 class="font-headline font-bold text-lg">Cancelled</h3>
            </div>
            <!-- Success -->
            <div v-else-if="paySuccess" class="text-center py-6">
              <span class="material-symbols-outlined text-4xl text-secondary mb-2 block" style="font-variation-settings:'FILL' 1;">check_circle</span>
              <h3 class="font-headline font-bold text-lg mb-1">Payment Successful!</h3>
              <p class="text-on-surface-variant text-sm">{{ paySuccess }}</p>
            </div>
            <!-- Pay Form -->
            <template v-else>
              <div v-if="payError" class="mb-5 p-3.5 rounded-xl bg-error-container text-on-error-container text-sm">{{ payError }}</div>

              <!-- Wallet Pay -->
              <div v-if="isLoggedIn" class="mb-5 p-4 bg-secondary/5 rounded-xl border border-secondary/15">
                <div class="flex items-center gap-2.5 mb-2.5"><span class="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span><h4 class="font-headline font-bold text-sm text-secondary">Pay from wallet</h4></div>
                <p class="text-xs text-on-surface-variant mb-3">Balance: <span class="font-bold text-on-surface">₦{{ (walletBalance || 0).toLocaleString() }}</span></p>
                <button @click="handleWalletPay" :disabled="walletPaying || walletBalance < invoice.total" class="w-full h-[48px] bg-secondary text-white rounded-full font-bold text-sm disabled:opacity-50 active:scale-95 transition-all">{{ walletPaying ? 'Processing...' : `Pay ₦${invoice.total?.toLocaleString()}` }}</button>
              </div>
              <div v-if="isLoggedIn" class="relative flex py-3 items-center mb-4"><div class="flex-grow border-t border-outline-variant/20" /><span class="flex-shrink mx-3 text-on-surface-variant text-xs">or</span><div class="flex-grow border-t border-outline-variant/20" /></div>

              <!-- External Pay -->
              <form @submit.prevent="handleExternalPay" class="space-y-4">
                <div><label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-0.5 block mb-1.5">Your Name</label><input v-model="payForm.payerName" required class="w-full h-[48px] px-4 bg-transparent border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-fixed outline-none text-sm" placeholder="John Doe" autocomplete="name" /></div>
                <div><label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-0.5 block mb-1.5">Your Email</label><input v-model="payForm.payerEmail" type="email" required class="w-full h-[48px] px-4 bg-transparent border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-fixed outline-none text-sm" placeholder="john@example.com" inputmode="email" autocomplete="email" /></div>
                <button type="submit" :disabled="paying" class="w-full h-[52px] bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-base rounded-full shadow-lg active:scale-[0.97] transition-all disabled:opacity-50">{{ paying ? 'Processing...' : `Pay ₦${invoice.total?.toLocaleString()}` }}</button>
              </form>
            </template>
          </div>
        </div>

        <div class="text-center pt-2 pb-4">
          <p class="text-[10px] text-on-surface-variant/50 font-medium flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[12px]">verified_user</span> Secured by Paystack & Interswitch</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Pay Invoice | MediPay' })
const route = useRoute()
const config = useRuntimeConfig()
const shareToken = route.params.token as string
const { token, wallet, loadAuth, isLoggedIn } = useAuth()
const { apiFetch } = useApi()

const invoice = ref<any>(null); const loading = ref(true); const loadError = ref('')
const paying = ref(false); const payError = ref(''); const paySuccess = ref('')
const payForm = reactive({ payerName: '', payerEmail: '' })
const walletPaying = ref(false)
const walletBalance = computed(() => wallet.value?.balance || 0)

const fetchInvoice = async () => { try { const r: any = await $fetch(`${config.public.apiBase}/api/v1/invoices/share/${shareToken}`); if (r.success) invoice.value = r.data; else loadError.value = 'Not found.' } catch (e: any) { loadError.value = e?.data?.error?.message || 'Not found or expired.' } finally { loading.value = false } }
const fetchWallet = async () => { if (!isLoggedIn.value) return; try { const r: any = await apiFetch('/api/v1/wallet'); if (r.success) wallet.value = r.data } catch {} }

onMounted(async () => { loadAuth(); await fetchInvoice(); await fetchWallet(); if (route.query.status === 'success' && invoice.value) { paySuccess.value = 'Updating...'; setTimeout(async () => { await fetchInvoice(); paySuccess.value = invoice.value?.status === 'paid' ? 'Confirmed!' : 'Payment processing.' }, 2000) } })

const handleWalletPay = async () => { payError.value = ''; walletPaying.value = true; try { const r: any = await apiFetch('/api/v1/payments/wallet-pay', { method: 'POST', body: { invoiceId: invoice.value.id, amount: invoice.value.total } }); if (r.success) { paySuccess.value = 'Paid!'; await fetchInvoice(); await fetchWallet() } else payError.value = r.error?.message || 'Failed.' } catch (e: any) { payError.value = e?.data?.error?.message || e?.message || 'Failed.' } finally { walletPaying.value = false } }

const handleExternalPay = async () => { payError.value = ''; paying.value = true; try { const r: any = await $fetch(`${config.public.apiBase}/api/v1/payments/initiate`, { method: 'POST', body: { invoiceId: invoice.value.id, shareToken, amount: invoice.value.total, payerName: payForm.payerName, payerEmail: payForm.payerEmail, paymentMethod: 'card', processor: 'paystack', callbackUrl: `${window.location.origin}/pay/${shareToken}?status=success` } }); if (r.success) { if (r.data.checkout?.paymentUrl) window.location.href = r.data.checkout.paymentUrl; else { paySuccess.value = r.data.checkout?.message || 'Initiated!'; const pi = setInterval(async () => { await fetchInvoice(); if (invoice.value?.status === 'paid') { paySuccess.value = 'Confirmed!'; clearInterval(pi) } }, 5000); setTimeout(() => clearInterval(pi), 120000) } } else payError.value = r.error?.message || 'Failed.' } catch (e: any) { payError.value = e?.data?.error?.message || e?.message || 'Failed.' } finally { paying.value = false } }

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''
const stCls = (s: string) => { if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'; if (s === 'open') return 'bg-tertiary/10 text-tertiary'; return 'bg-error/10 text-error' }
</script>