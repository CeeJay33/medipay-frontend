<template>
  <NuxtLayout name="dashboard" :active-tab="activeTab" @navigate="activeTab = $event">
    <!-- Mobile Greeting -->
    <div class="sm:hidden px-4 pt-4">
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
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const fetchWallet = async () => {
  try {
    const res: any = await apiFetch('/api/v1/wallet')
    if (res.success) walletData.value = res.data
  } catch (e) {
    console.error('Failed to fetch wallet:', e)
  }
}

const fetchInvoices = async () => {
  try {
    const res: any = await apiFetch('/api/v1/invoices')
    if (res.success) invoicesList.value = res.data
  } catch (e) {
    console.error('Failed to fetch invoices:', e)
  }
}

onMounted(async () => {
  loadAuth()
  await nextTick()
  if (!isLoggedIn.value) {
    navigateTo('/login')
    return
  }
  // Use cached wallet first, then fetch fresh
  if (wallet.value) walletData.value = wallet.value
  await Promise.all([fetchWallet(), fetchInvoices()])
})
</script>