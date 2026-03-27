<template>
  <div class="p-4 sm:p-6 max-w-[960px] mx-auto space-y-6">
    <h1 class="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Activity History</h1>

    <div v-if="!invoices.length" class="py-16 text-center text-on-surface-variant/50">
      <span class="material-symbols-outlined text-5xl mb-3 block">history</span>
      <p class="text-sm">No activity yet.</p>
    </div>

    <div v-else class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
      <!-- Mobile -->
      <div class="sm:hidden divide-y divide-outline-variant/10">
        <div v-for="inv in sortedInvoices" :key="inv.id" class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="inv.status === 'paid' ? 'bg-secondary/10' : 'bg-tertiary/10'">
              <span class="material-symbols-outlined text-lg" :class="inv.status === 'paid' ? 'text-secondary' : 'text-tertiary'">
                {{ inv.status === 'paid' ? 'check_circle' : 'pending' }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-sm truncate">{{ inv.providerName }}</p>
              <p class="text-xs text-on-surface-variant/50">{{ inv.invoiceNumber }} · {{ formatDate(inv.createdAt) }}</p>
            </div>
          </div>
          <div class="text-right ml-3">
            <p class="font-bold text-sm">₦{{ inv.total?.toLocaleString() }}</p>
            <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5" :class="statusClass(inv.status)">{{ inv.status }}</span>
          </div>
        </div>
      </div>

      <!-- Desktop -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low/80 border-b border-outline-variant/10">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Invoice</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Provider</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="inv in sortedInvoices" :key="inv.id" class="hover:bg-surface-container-low/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium">{{ formatDate(inv.createdAt) }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-primary">{{ inv.invoiceNumber }}</td>
              <td class="px-6 py-4 text-sm">{{ inv.providerName }}</td>
              <td class="px-6 py-4 text-sm font-bold">₦{{ inv.total?.toLocaleString() }}</td>
              <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" :class="statusClass(inv.status)">{{ inv.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ invoices: any[] }>()

const sortedInvoices = computed(() => [...(props.invoices || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
const statusClass = (s: string) => {
  if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'
  if (s === 'open') return 'bg-tertiary/10 text-tertiary'
  if (s === 'cancelled' || s === 'failed') return 'bg-error/10 text-error'
  return 'bg-primary/10 text-primary'
}
</script>