<template>
  <div class="px-3 sm:px-5 lg:px-6 py-4 max-w-[960px] mx-auto space-y-4 sm:space-y-6">
    <h1 class="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">Activity History</h1>
    <div v-if="!invoices.length" class="py-14 text-center text-on-surface-variant/40">
      <span class="material-symbols-outlined text-4xl mb-2 block">history</span><p class="text-sm">No activity yet.</p>
    </div>
    <div v-else class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm divide-y divide-outline-variant/10">
      <div v-for="inv in sorted" :key="inv.id" class="flex items-center justify-between p-3.5 sm:p-4 active:bg-surface-container-low/50 transition-colors">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0" :class="inv.status === 'paid' ? 'bg-secondary/10' : inv.status === 'open' ? 'bg-tertiary/10' : 'bg-error/10'">
            <span class="material-symbols-outlined text-[18px]" :class="inv.status === 'paid' ? 'text-secondary' : inv.status === 'open' ? 'text-tertiary' : 'text-error'">
              {{ inv.status === 'paid' ? 'check_circle' : inv.status === 'open' ? 'pending' : 'cancel' }}
            </span>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-sm truncate">{{ inv.providerName }}</p>
            <p class="text-[11px] text-on-surface-variant/50">{{ inv.invoiceNumber }} · {{ fmtDate(inv.createdAt) }}</p>
          </div>
        </div>
        <div class="text-right ml-3 shrink-0">
          <p class="font-bold text-sm">₦{{ inv.total?.toLocaleString() }}</p>
          <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5" :class="stCls(inv.status)">{{ inv.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ invoices: any[] }>()
const sorted = computed(() => [...(props.invoices || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''
const stCls = (s: string) => { if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'; if (s === 'open') return 'bg-tertiary/10 text-tertiary'; return 'bg-error/10 text-error' }
</script>