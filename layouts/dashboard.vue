<template>
  <div class="bg-surface text-on-surface min-h-screen">
    <!-- Desktop Sidebar -->
    <aside class="fixed left-0 top-0 h-screen w-[240px] hidden md:flex flex-col bg-surface-container-low py-8 px-4 z-50">
      <div class="mb-10 px-4">
        <h1 class="text-2xl font-black text-primary-container tracking-tighter font-headline">MediPay</h1>
        <p class="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">Clinical Guardian</p>
      </div>

      <nav class="flex-1 space-y-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="$emit('navigate', item.id)"
          class="w-full flex items-center gap-3 px-4 py-3 font-headline text-sm tracking-tight transition-colors rounded-lg text-left"
          :class="activeTab === item.id ? 'text-primary-container font-extrabold bg-primary-fixed/30' : 'text-on-surface-variant/60 hover:text-primary-container hover:bg-surface-container'"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <!-- User -->
      <div class="mt-auto border-t border-outline-variant/20 pt-6 px-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold font-headline text-lg">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-headline font-bold text-sm text-on-surface truncate">{{ displayName }}</p>
          <p class="text-xs text-on-surface-variant/50">Patient</p>
        </div>
        <button @click="handleLogout" class="text-on-surface-variant/40 hover:text-error transition-colors" title="Logout">
          <span class="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="md:ml-[240px] min-h-screen pb-24 md:pb-12">
      <!-- Top Nav -->
      <header class="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
        <div class="flex justify-between items-center px-4 sm:px-6 h-14 sm:h-16">
          <div class="flex items-center gap-3">
            <span class="md:hidden text-xl font-black text-primary-container font-headline tracking-tighter">MediPay</span>
            <h2 class="hidden sm:block font-headline font-bold text-lg sm:text-xl text-primary">{{ greeting }}, {{ firstName }} 👋</h2>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2 rounded-full hover:bg-surface-container transition-all">
              <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm font-headline">
              {{ userInitial }}
            </div>
          </div>
        </div>
      </header>

      <slot />

      <!-- Footer -->
      <footer class="w-full py-6 sm:py-8 mt-8 sm:mt-12 border-t border-outline-variant/10 flex flex-col items-center justify-center text-center opacity-60">
        <p class="font-label text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant/50">
          256-bit SSL · CBN Compliant · Secured by Interswitch
        </p>
      </footer>
    </main>

    <!-- Mobile Bottom Nav -->
    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden bg-surface-container-lowest border-t border-outline-variant/10 shadow-[0_-4px_20px_rgba(0,62,126,0.06)] rounded-t-[24px]">
      <button
        v-for="item in mobileNavItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        class="flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all"
        :class="activeTab === item.id ? 'bg-primary-fixed/40 text-primary-container' : 'text-on-surface-variant/40'"
      >
        <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
        <span class="text-[10px] font-medium mt-0.5">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Emergency FAB -->
    <button class="fixed right-4 sm:right-6 bottom-20 md:bottom-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-error text-on-error rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
      <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">medical_services</span>
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

const handleLogout = () => {
  clearAuth()
  navigateTo('/login')
}

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