<template>
  <div class="bg-surface text-on-surface min-h-screen">
    <!-- Desktop Sidebar -->
    <aside class="fixed left-0 top-0 h-screen w-[240px] hidden md:flex flex-col bg-surface-container-low py-6 lg:py-8 px-3 lg:px-4 z-50">
      <div class="mb-8 lg:mb-10 px-3">
        <h1 class="text-2xl font-black text-primary-container tracking-tighter font-headline">MediPay</h1>
        <p class="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">Clinical Guardian</p>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        <button
          v-for="item in navItems" :key="item.id"
          @click="$emit('navigate', item.id)"
          class="w-full flex items-center gap-3 px-4 py-3 font-headline text-sm tracking-tight transition-colors rounded-xl text-left"
          :class="activeTab === item.id
            ? 'text-primary-container font-extrabold bg-primary-fixed/30'
            : 'text-on-surface-variant/60 hover:text-primary-container hover:bg-surface-container'"
        >
          <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="mt-auto border-t border-outline-variant/20 pt-4 px-3 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold font-headline text-lg shrink-0">{{ userInitial }}</div>
        <div class="flex-1 min-w-0">
          <p class="font-headline font-bold text-sm text-on-surface truncate">{{ displayName }}</p>
          <p class="text-[11px] text-on-surface-variant/50">Patient</p>
        </div>
        <button @click="handleLogout" class="p-2 text-on-surface-variant/40 hover:text-error transition-colors rounded-full" title="Logout">
          <span class="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="md:ml-[240px] min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <!-- Top Nav -->
      <header class="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm safe-top">
        <div class="flex justify-between items-center px-4 sm:px-6 h-14 sm:h-16">
          <div class="flex items-center gap-3 min-w-0">
            <span class="md:hidden text-xl font-black text-primary-container font-headline tracking-tighter shrink-0">MediPay</span>
            <h2 class="hidden sm:block font-headline font-bold text-lg lg:text-xl text-primary truncate">{{ greeting }}, {{ firstName }} 👋</h2>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <button class="p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-95">
              <span class="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
            </button>
            <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm font-headline">{{ userInitial }}</div>
          </div>
        </div>
      </header>

      <slot />

      <!-- Footer (hidden on mobile to save space) -->
      <footer class="hidden md:flex w-full py-6 mt-8 border-t border-outline-variant/10 flex-col items-center justify-center text-center opacity-60">
        <p class="font-label text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant/50">
          256-bit SSL · CBN Compliant · Secured by Interswitch
        </p>
      </footer>
    </main>

    <!-- Mobile Bottom Nav -->
    <nav class="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest border-t border-outline-variant/10 shadow-[0_-4px_20px_rgba(0,62,126,0.06)] rounded-t-[20px] safe-bottom">
      <div class="flex justify-around items-center px-2 pt-2 pb-1">
        <button
          v-for="item in mobileNavItems" :key="item.id"
          @click="$emit('navigate', item.id)"
          class="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all min-w-[60px] active:scale-95"
          :class="activeTab === item.id
            ? 'bg-primary-fixed/40 text-primary-container'
            : 'text-on-surface-variant/40'"
        >
          <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
          <span class="text-[10px] font-semibold mt-0.5 leading-tight">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Emergency FAB -->
    <button class="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 md:right-6 z-40 w-12 h-12 bg-error text-on-error rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all">
      <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1;">medical_services</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['navigate'])
const props = defineProps<{ activeTab: string }>()
const { user, clearAuth } = useAuth()

const firstName = computed(() => (user.value?.fullName || 'User').split(' ')[0])
const displayName = computed(() => user.value?.fullName || 'User')
const userInitial = computed(() => (user.value?.fullName || 'U').charAt(0).toUpperCase())
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})
const handleLogout = () => { clearAuth(); navigateTo('/login') }

const navItems = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' },
  { id: 'invoices', icon: 'receipt_long', label: 'Invoices' },
  { id: 'history', icon: 'history', label: 'History' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]
const mobileNavItems = [
  { id: 'dashboard', icon: 'home', label: 'Home' },
  { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' },
  { id: 'invoices', icon: 'receipt_long', label: 'Invoices' },
  { id: 'settings', icon: 'person', label: 'Profile' },
]
</script>