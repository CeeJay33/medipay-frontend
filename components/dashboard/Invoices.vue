<template>
  <div class="px-3 sm:px-5 lg:px-6 py-4 max-w-[960px] mx-auto space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center gap-3">
      <div class="min-w-0">
        <h1 class="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight truncate">My Invoices</h1>
        <p class="text-on-surface-variant mt-0.5 text-xs sm:text-sm hidden sm:block">Manage your healthcare billing.</p>
      </div>
      <button @click="openCreate" class="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all">
        <span class="sm:hidden">+ New</span>
        <span class="hidden sm:inline">New Invoice</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button v-for="t in tabs" :key="t.v" @click="activeTab = t.v" class="shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95" :class="activeTab === t.v ? 'bg-primary text-white font-bold' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20'">{{ t.l }}</button>
    </div>

    <!-- Search -->
    <div class="relative">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
      <input v-model="search" class="w-full h-11 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all" placeholder="Search provider..." />
    </div>

    <!-- List -->
    <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
      <div v-if="!filtered.length" class="py-10 text-center text-on-surface-variant/40">
        <span class="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
        <p class="text-sm">{{ invoices.length ? 'No matches.' : 'No invoices yet.' }}</p>
      </div>

      <!-- Cards (all sizes, table hidden) -->
      <div v-else class="divide-y divide-outline-variant/10">
        <div v-for="inv in filtered" :key="inv.id" @click="viewInvoice(inv)" class="flex items-center justify-between p-3.5 sm:p-4 active:bg-surface-container-low/50 transition-colors cursor-pointer">
          <div class="flex-1 min-w-0 mr-3">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="font-semibold text-sm text-primary truncate">{{ inv.invoiceNumber }}</p>
              <span class="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" :class="stCls(inv.status)">{{ inv.status }}</span>
            </div>
            <p class="text-sm font-medium text-on-surface truncate">{{ inv.providerName }}</p>
            <p class="text-[11px] text-on-surface-variant/50 mt-0.5">{{ fmtDate(inv.invoiceDate) }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="font-bold text-base text-on-surface">₦{{ inv.total?.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <Teleport to="body">
      <div v-if="showCreate" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showCreate = false">
        <div class="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 w-full sm:max-w-lg shadow-2xl border-t sm:border border-outline-variant/10 max-h-[85vh] overflow-y-auto safe-bottom animate-fade-in">
          <div class="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 sm:hidden" />
          <h3 class="font-headline font-bold text-lg text-on-surface mb-1">Create Invoice</h3>
          <p class="text-on-surface-variant text-sm mb-5">Step {{ createStep }} of 2</p>
          <div v-if="createError" class="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm">{{ createError }}</div>

          <!-- Step 1 -->
          <form v-if="createStep === 1" @submit.prevent="createStep = 2" class="space-y-4">
            <div class="p-3.5 border-2 border-dashed border-outline-variant/30 rounded-xl text-center">
              <input type="file" ref="fileInput" accept="image/*,.pdf" class="hidden" @change="handleReceipt" />
              <button type="button" @click="($refs.fileInput as HTMLInputElement)?.click()" class="text-primary font-bold text-sm flex items-center justify-center gap-2 mx-auto active:opacity-70" :disabled="extracting">
                <span class="material-symbols-outlined text-[20px]">upload_file</span>
                {{ extracting ? 'Extracting...' : receiptFile ? receiptFile.name : 'Upload receipt' }}
              </button>
              <p class="text-[10px] text-on-surface-variant/50 mt-1">Auto-fill from receipt</p>
            </div>
            <div><label class="block text-sm font-semibold text-on-surface-variant mb-1.5">Provider Name</label><input v-model="form.providerName" required class="w-full h-[48px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm" placeholder="Reddington Hospital" /></div>
            <div><label class="block text-sm font-semibold text-on-surface-variant mb-1.5">Bank</label>
              <select v-model="form.providerBank" required class="w-full h-[48px] px-4 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm appearance-none">
                <option value="" disabled>Select bank...</option><option v-for="b in banks" :key="b.code" :value="b.code">{{ b.name }}</option>
              </select>
            </div>
            <div><label class="block text-sm font-semibold text-on-surface-variant mb-1.5">Account Number</label>
              <div class="relative">
                <input v-model="form.providerAccount" required maxlength="10" inputmode="numeric" class="w-full h-[48px] px-4 pr-12 rounded-xl border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm font-mono" placeholder="0123456789" @input="onAccountInput" />
                <div v-if="verifyingAccount" class="absolute right-3 top-1/2 -translate-y-1/2"><svg class="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
                <span v-else-if="accountName" class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-[20px]" style="font-variation-settings:'FILL' 1;">check_circle</span>
              </div>
              <div v-if="accountName" class="mt-2 p-2.5 bg-secondary-container/20 rounded-xl border border-secondary/10"><p class="text-secondary font-bold text-sm">{{ accountName }}</p></div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showCreate = false" class="flex-1 h-[48px] border border-outline-variant/20 rounded-full font-bold text-on-surface-variant active:scale-95">Cancel</button>
              <button type="submit" class="flex-1 h-[48px] bg-primary text-white rounded-full font-bold active:scale-95">Next</button>
            </div>
          </form>

          <!-- Step 2 -->
          <form v-if="createStep === 2" @submit.prevent="submitInvoice" class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-semibold text-on-surface-variant">Items</label>
              <button type="button" @click="form.items.push({ description: '', quantity: 1, unitPrice: 0 })" class="text-secondary text-xs font-bold flex items-center gap-1 active:opacity-70"><span class="material-symbols-outlined text-sm">add</span> Add</button>
            </div>
            <div v-for="(item, i) in form.items" :key="i" class="p-3 bg-surface-container-low rounded-xl space-y-2">
              <input v-model="item.description" class="w-full h-[44px] px-3 rounded-lg border border-outline-variant bg-transparent text-sm" placeholder="Description" required />
              <div class="grid grid-cols-3 gap-2">
                <div><label class="text-[9px] text-on-surface-variant/50 uppercase">Qty</label><input v-model.number="item.quantity" type="number" min="1" class="w-full h-[40px] px-2 rounded-lg border border-outline-variant bg-transparent text-sm text-center" inputmode="numeric" required /></div>
                <div><label class="text-[9px] text-on-surface-variant/50 uppercase">Price</label><input v-model.number="item.unitPrice" type="number" min="0" class="w-full h-[40px] px-2 rounded-lg border border-outline-variant bg-transparent text-sm" inputmode="numeric" required /></div>
                <div class="flex items-end gap-1"><div class="flex-1"><label class="text-[9px] text-on-surface-variant/50 uppercase">Total</label><p class="h-[40px] flex items-center text-sm font-bold text-primary">₦{{ (item.quantity * item.unitPrice).toLocaleString() }}</p></div>
                  <button v-if="form.items.length > 1" type="button" @click="form.items.splice(i, 1)" class="text-error p-1 mb-1"><span class="material-symbols-outlined text-lg">close</span></button>
                </div>
              </div>
            </div>
            <div class="text-right pt-1"><span class="font-headline font-extrabold text-lg text-primary">Total: ₦{{ invoiceTotal.toLocaleString() }}</span></div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="createStep = 1" class="flex-1 h-[48px] border border-outline-variant/20 rounded-full font-bold text-on-surface-variant active:scale-95">Back</button>
              <button type="submit" :disabled="creating" class="flex-1 h-[48px] bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold disabled:opacity-50 active:scale-95">{{ creating ? 'Creating...' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- VIEW MODAL -->
    <Teleport to="body">
      <div v-if="viewing" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="viewing = null">
        <div class="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 w-full sm:max-w-lg shadow-2xl border-t sm:border border-outline-variant/10 max-h-[85vh] overflow-y-auto safe-bottom animate-fade-in">
          <div class="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 sm:hidden" />
          <div class="flex justify-between items-start mb-5">
            <div class="min-w-0 mr-3">
              <h3 class="font-headline font-bold text-base sm:text-lg truncate">{{ viewing.invoiceNumber }}</h3>
              <p class="text-on-surface-variant text-sm truncate">{{ viewing.providerName }}</p>
              <p v-if="viewing.providerBankName" class="text-on-surface-variant/50 text-xs mt-0.5">{{ viewing.providerBankName }} · {{ viewing.providerAccount }}</p>
            </div>
            <span class="shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase" :class="stCls(viewing.status)">{{ viewing.status }}</span>
          </div>

          <div class="space-y-2 mb-5">
            <div v-for="item in viewing.items" :key="item.description" class="flex justify-between text-sm p-3 bg-surface-container-low rounded-xl">
              <span class="truncate mr-2">{{ item.description }} × {{ item.quantity }}</span>
              <span class="font-bold shrink-0">₦{{ item.total?.toLocaleString() }}</span>
            </div>
          </div>

          <div class="flex justify-between items-end border-t border-outline-variant/10 pt-3 mb-5">
            <span class="font-bold text-on-surface-variant text-sm">Total</span>
            <span class="font-headline font-extrabold text-xl text-primary">₦{{ viewing.total?.toLocaleString() }}</span>
          </div>

          <!-- Share -->
          <div v-if="viewing.shareToken" class="mb-5">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Payment Link</label>
            <div class="flex gap-2">
              <div class="flex-1 h-10 bg-surface-container-low rounded-xl border border-outline-variant/20 px-3 flex items-center overflow-hidden"><span class="text-xs text-on-surface-variant truncate">{{ getShareUrl(viewing) }}</span></div>
              <button @click="copy(viewing)" class="px-3.5 bg-primary text-white rounded-xl font-bold text-xs shrink-0 active:scale-95">Copy</button>
            </div>
            <div class="mt-2.5 flex gap-2">
              <button @click="shareWhatsApp(viewing)" class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-outline-variant/20 active:bg-surface-container-low text-sm font-bold active:scale-95"><span class="material-symbols-outlined text-green-600 text-lg">chat</span> WhatsApp</button>
              <button @click="shareEmail(viewing)" class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-outline-variant/20 active:bg-surface-container-low text-sm font-bold active:scale-95"><span class="material-symbols-outlined text-orange-500 text-lg">mail</span> Email</button>
            </div>
          </div>

          <!-- Wallet Pay -->
          <div v-if="viewing.status === 'open'" class="mb-5 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h4 class="font-headline font-bold text-sm text-primary mb-2.5">Pay from wallet</h4>
            <div v-if="walletPayError" class="mb-2.5 p-2.5 rounded-lg bg-error-container text-on-error-container text-xs">{{ walletPayError }}</div>
            <div v-if="walletPaySuccess" class="mb-2.5 p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs">{{ walletPaySuccess }}</div>
            <button @click="handleWalletPay" :disabled="walletPaying" class="w-full h-[48px] bg-secondary text-white rounded-full font-bold text-sm disabled:opacity-50 active:scale-95 transition-all">
              {{ walletPaying ? 'Processing...' : `Pay ₦${viewing.total?.toLocaleString()}` }}
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button v-if="viewing.status === 'open'" @click="handleCancel" :disabled="cancelling" class="flex-1 h-[48px] border border-error/20 text-error rounded-full font-bold text-sm disabled:opacity-50 active:scale-95">{{ cancelling ? '...' : 'Cancel' }}</button>
            <button @click="viewing = null" class="flex-1 h-[48px] bg-primary text-white rounded-full font-bold active:scale-95">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ invoices: any[] }>()
const emit = defineEmits(['refresh'])
const { apiFetch } = useApi()

const activeTab = ref('all')
const search = ref('')
const tabs = [{ l: 'All', v: 'all' }, { l: 'Open', v: 'open' }, { l: 'Paid', v: 'paid' }, { l: 'Cancelled', v: 'cancelled' }]
const filtered = computed(() => {
  let r = props.invoices || []
  if (activeTab.value !== 'all') r = r.filter((i: any) => i.status === activeTab.value)
  if (search.value) { const q = search.value.toLowerCase(); r = r.filter((i: any) => i.providerName?.toLowerCase().includes(q) || i.invoiceNumber?.toLowerCase().includes(q)) }
  return r
})

// Banks
const banks = ref<any[]>([])
onMounted(async () => { try { const r: any = await apiFetch('/api/v1/verify/banks'); if (r.success) banks.value = Array.isArray(r.data) ? r.data : (r.data?.banks || []) } catch {} })

// Account verify
const accountName = ref(''); const verifyingAccount = ref(false); let vt: any = null
const onAccountInput = () => { accountName.value = ''; clearTimeout(vt); if (form.providerAccount.length === 10 && form.providerBank) vt = setTimeout(async () => { verifyingAccount.value = true; try { const r: any = await apiFetch('/api/v1/verify/account', { method: 'POST', body: { accountNumber: form.providerAccount, bankCode: form.providerBank } }); if (r.success && r.data) accountName.value = r.data.account_name || r.data.accountName || r.data.name || 'Verified' } catch {} finally { verifyingAccount.value = false } }, 500) }

// Receipt
const receiptFile = ref<File | null>(null); const extracting = ref(false)
const handleReceipt = async (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return; receiptFile.value = f; extracting.value = true; try { const fd = new FormData(); fd.append('receipt', f); const r: any = await apiFetch('/api/v1/extract', { method: 'POST', body: fd }); if (r.success && r.data?.suggestedInvoice) { const s = r.data.suggestedInvoice; if (s.providerName) form.providerName = s.providerName; if (s.providerAccount) form.providerAccount = s.providerAccount; if (s.items?.length) form.items = s.items.map((i: any) => ({ description: i.description, quantity: i.quantity || 1, unitPrice: i.unitPrice || 0 })) } } catch {} finally { extracting.value = false } }

// Create
const showCreate = ref(false); const createStep = ref(1); const creating = ref(false); const createError = ref('')
const form = reactive({ providerName: '', providerAccount: '', providerBank: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] as any[] })
const invoiceTotal = computed(() => form.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0))
const openCreate = () => { showCreate.value = true; createStep.value = 1; createError.value = ''; form.providerName = ''; form.providerAccount = ''; form.providerBank = ''; form.items = [{ description: '', quantity: 1, unitPrice: 0 }]; accountName.value = ''; receiptFile.value = null }
const submitInvoice = async () => { createError.value = ''; creating.value = true; try { const items = form.items.map((i: any) => ({ ...i, total: i.quantity * i.unitPrice })); const r: any = await apiFetch('/api/v1/invoices', { method: 'POST', body: { providerName: form.providerName, providerAccount: form.providerAccount, providerBank: form.providerBank, items, invoiceDate: new Date().toISOString() } }); if (r.success) { showCreate.value = false; emit('refresh') } else createError.value = r.error?.message || 'Failed.' } catch (e: any) { createError.value = e?.data?.error?.message || e?.message || 'Failed.' } finally { creating.value = false } }

// View
const viewing = ref<any>(null); const viewInvoice = (inv: any) => { viewing.value = inv; walletPayError.value = ''; walletPaySuccess.value = '' }

// Wallet Pay
const walletPaying = ref(false); const walletPayError = ref(''); const walletPaySuccess = ref('')
const handleWalletPay = async () => { walletPayError.value = ''; walletPaySuccess.value = ''; walletPaying.value = true; try { const r: any = await apiFetch('/api/v1/payments/wallet-pay', { method: 'POST', body: { invoiceId: viewing.value.id, amount: viewing.value.total } }); if (r.success) { walletPaySuccess.value = 'Paid!'; emit('refresh'); setTimeout(() => { viewing.value = null }, 1200) } else walletPayError.value = r.error?.message || 'Failed.' } catch (e: any) { walletPayError.value = e?.data?.error?.message || e?.message || 'Failed.' } finally { walletPaying.value = false } }

// Cancel
const cancelling = ref(false)
const handleCancel = async () => { if (!confirm('Cancel this invoice?')) return; cancelling.value = true; try { await apiFetch(`/api/v1/invoices/${viewing.value.id}`, { method: 'DELETE' }); viewing.value = null; emit('refresh') } catch {} finally { cancelling.value = false } }

// Helpers
const getShareUrl = (inv: any) => inv.shareToken ? `${window.location.origin}/pay/${inv.shareToken}` : ''
const copy = (inv: any) => navigator.clipboard.writeText(getShareUrl(inv))
const shareWhatsApp = (inv: any) => window.open(`https://wa.me/?text=${encodeURIComponent('Pay my medical invoice: ' + getShareUrl(inv))}`, '_blank')
const shareEmail = (inv: any) => window.open(`mailto:?subject=MediPay Invoice ${inv.invoiceNumber}&body=Please pay: ${getShareUrl(inv)}`, '_blank')
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''
const stCls = (s: string) => { if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'; if (s === 'open') return 'bg-tertiary/10 text-tertiary'; if (s === 'cancelled' || s === 'failed') return 'bg-error/10 text-error'; return 'bg-primary/10 text-primary' }
</script>