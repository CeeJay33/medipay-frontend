<template>
  <NuxtLayout name="dashboard" :active-tab="activeTab" @navigate="activeTab = $event">
    <div class="sm:hidden px-4 pt-3">
      <h2 class="font-headline font-bold text-lg text-primary">{{ greeting }}, {{ firstName }} 👋</h2>
    </div>
    <DashboardHome v-if="activeTab === 'dashboard'" :wallet="walletData" :invoices="invoicesList" @navigate="activeTab = $event" />
    <DashboardWallet v-else-if="activeTab === 'wallet'" :wallet="walletData" @refresh="fetchWallet" />
    <DashboardInvoices v-else-if="activeTab === 'invoices'" :invoices="invoicesList" @refresh="fetchInvoices" />
    <DashboardHistory v-else-if="activeTab === 'history'" :invoices="invoicesList" />
    <DashboardSettings v-else-if="activeTab === 'settings'" />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: 'Dashboard | MediPay' })
const { user, wallet, loadAuth, isLoggedIn } = useAuth()
const { apiFetch } = useApi()
const activeTab = ref('dashboard')
const walletData = ref<any>(null)
const invoicesList = ref<any[]>([])
const firstName = computed(() => (user.value?.fullName || 'User').split(' ')[0])
const greeting = computed(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' })

const fetchWallet = async () => { try { const r: any = await apiFetch('/api/v1/wallet'); if (r.success) walletData.value = r.data } catch {} }
const fetchInvoices = async () => { try { const r: any = await apiFetch('/api/v1/invoices'); if (r.success) invoicesList.value = r.data } catch {} }

onMounted(async () => {
  loadAuth(); await nextTick()
  if (!isLoggedIn.value) { navigateTo('/login'); return }
  if (wallet.value) walletData.value = wallet.value
  await Promise.all([fetchWallet(), fetchInvoices()])
})
</script>