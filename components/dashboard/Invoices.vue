<template>
  <div class="p-4 sm:p-6 max-w-[960px] mx-auto space-y-6 lg:space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 class="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">My Invoices</h1>
        <p class="text-on-surface-variant mt-1 text-sm">Manage and track your healthcare billing history.</p>
      </div>
      <button @click="openCreate" class="px-6 sm:px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all">New Invoice</button>
    </div>

    <!-- Filters -->
    <div class="bg-surface-container-lowest rounded-xl p-2 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center w-full md:w-auto px-2 overflow-x-auto">
        <button v-for="t in tabs" :key="t.v" @click="activeTab = t.v" class="px-4 sm:px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors" :class="activeTab === t.v ? 'font-bold border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'">{{ t.l }}</button>
      </div>
      <div class="relative w-full md:w-auto px-2">
        <span class="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">search</span>
        <input v-model="search" class="h-11 pl-11 pr-4 bg-transparent border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary w-full md:w-64 transition-all" placeholder="Search provider..." />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-sm">
      <div v-if="!filtered.length" class="py-12 text-center text-on-surface-variant/50">
        <span class="material-symbols-outlined text-5xl mb-3 block">receipt_long</span>
        <p class="text-sm">{{ invoices.length ? 'No matches.' : 'No invoices yet.' }}</p>
      </div>
      <!-- Mobile -->
      <div v-else class="sm:hidden divide-y divide-outline-variant/10">
        <div v-for="inv in filtered" :key="inv.id" class="p-4 flex items-center justify-between cursor-pointer" @click="viewInvoice(inv)">
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-sm text-primary truncate">{{ inv.invoiceNumber }}</p>
            <p class="text-sm font-medium truncate">{{ inv.providerName }}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ fmtDate(inv.invoiceDate) }}</p>
          </div>
          <div class="text-right ml-3">
            <p class="font-bold text-sm">₦{{ inv.total?.toLocaleString() }}</p>
            <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5" :class="stCls(inv.status)">{{ inv.status }}</span>
          </div>
        </div>
      </div>
      <!-- Desktop -->
      <div v-if="filtered.length" class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low/80 border-b border-outline-variant/10">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Provider</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="inv in filtered" :key="inv.id" class="hover:bg-surface-container-low/50 transition-colors">
              <td class="px-6 py-4 text-sm font-semibold text-primary">{{ inv.invoiceNumber }}</td>
              <td class="px-6 py-4 text-sm font-medium">{{ inv.providerName }}</td>
              <td class="px-6 py-4 text-sm text-on-surface-variant">{{ fmtDate(inv.invoiceDate) }}</td>
              <td class="px-6 py-4 text-sm font-bold">₦{{ inv.total?.toLocaleString() }}</td>
              <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-[11px] font-bold" :class="stCls(inv.status)">{{ inv.status }}</span></td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button @click="viewInvoice(inv)" class="text-xs font-bold text-primary underline underline-offset-4">View</button>
                  <button v-if="inv.shareUrl" @click="copy(inv.shareUrl)" class="p-1.5 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-all"><span class="material-symbols-outlined text-[20px]">share</span></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== CREATE INVOICE MODAL ===== -->
    <Teleport to="body">
      <div v-if="showCreate" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="showCreate = false">
        <div class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/10 my-8 max-h-[90vh] overflow-y-auto">
          <h3 class="font-headline font-bold text-xl text-on-surface mb-2">Create Invoice</h3>
          <p class="text-on-surface-variant text-sm mb-6">Step {{ createStep }} of 2</p>

          <div v-if="createError" class="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm">{{ createError }}</div>

          <!-- Step 1: Provider Details -->
          <form v-if="createStep === 1" @submit.prevent="goStep2" class="space-y-4">
            <!-- Receipt Upload -->
            <div class="p-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-center">
              <input type="file" ref="fileInput" accept="image/*,.pdf" class="hidden" @change="handleReceipt" />
              <button type="button" @click="($refs.fileInput as HTMLInputElement)?.click()" class="text-primary font-bold text-sm flex items-center justify-center gap-2 mx-auto" :disabled="extracting">
                <span class="material-symbols-outlined">upload_file</span>
                {{ extracting ? 'Extracting...' : receiptFile ? receiptFile.name : 'Upload receipt (optional)' }}
              </button>
              <p class="text-[11px] text-on-surface-variant/50 mt-1">We'll auto-fill fields from your receipt</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface-variant mb-1">Provider Name</label>
              <input v-model="form.providerName" required class="w-full h-11 px-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm" placeholder="Reddington Hospital" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface-variant mb-1">Bank</label>
              <select v-model="form.providerBank" required class="w-full h-11 px-4 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm appearance-none">
                <option value="" disabled>Select bank...</option>
                <option v-for="b in banks" :key="b.code" :value="b.code">{{ b.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface-variant mb-1">Account Number</label>
              <div class="relative">
                <input v-model="form.providerAccount" required maxlength="10" inputmode="numeric" class="w-full h-11 px-4 pr-12 rounded-lg border border-outline-variant bg-transparent focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none text-sm font-mono" placeholder="0123456789" @input="onAccountInput" />
                <div v-if="verifyingAccount" class="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg class="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                </div>
                <span v-else-if="accountName" class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary" style="font-variation-settings:'FILL' 1;">check_circle</span>
              </div>
              <div v-if="accountName" class="mt-2 p-3 bg-secondary-container/20 rounded-lg border border-secondary/10">
                <p class="text-secondary font-bold text-sm">{{ accountName }}</p>
                <p class="text-[10px] text-on-secondary-fixed-variant/70">Account verified</p>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="showCreate = false" class="flex-1 py-3 border border-outline-variant/20 rounded-full font-bold text-on-surface-variant">Cancel</button>
              <button type="submit" class="flex-1 py-3 bg-primary text-white rounded-full font-bold">Next: Add Items</button>
            </div>
          </form>

          <!-- Step 2: Items -->
          <form v-if="createStep === 2" @submit.prevent="submitInvoice" class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-semibold text-on-surface-variant">Line Items</label>
              <button type="button" @click="form.items.push({ description: '', quantity: 1, unitPrice: 0 })" class="text-secondary text-xs font-bold flex items-center gap-1"><span class="material-symbols-outlined text-sm">add</span> Add</button>
            </div>

            <div v-for="(item, i) in form.items" :key="i" class="p-3 bg-surface-container-low rounded-lg space-y-2">
              <input v-model="item.description" class="w-full h-10 px-3 rounded border border-outline-variant bg-transparent text-sm" placeholder="Description" required />
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[10px] text-on-surface-variant/50 uppercase">Qty</label>
                  <input v-model.number="item.quantity" type="number" min="1" class="w-full h-9 px-2 rounded border border-outline-variant bg-transparent text-sm text-center" required />
                </div>
                <div>
                  <label class="text-[10px] text-on-surface-variant/50 uppercase">Unit Price</label>
                  <input v-model.number="item.unitPrice" type="number" min="0" class="w-full h-9 px-2 rounded border border-outline-variant bg-transparent text-sm" required />
                </div>
                <div class="flex items-end">
                  <div class="flex-1">
                    <label class="text-[10px] text-on-surface-variant/50 uppercase">Total</label>
                    <p class="h-9 flex items-center text-sm font-bold text-primary">₦{{ (item.quantity * item.unitPrice).toLocaleString() }}</p>
                  </div>
                  <button v-if="form.items.length > 1" type="button" @click="form.items.splice(i, 1)" class="text-error mb-1 ml-1"><span class="material-symbols-outlined text-lg">close</span></button>
                </div>
              </div>
            </div>

            <div class="text-right pt-2 border-t border-outline-variant/10">
              <span class="font-headline font-extrabold text-xl text-primary">Total: ₦{{ invoiceTotal.toLocaleString() }}</span>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="createStep = 1" class="flex-1 py-3 border border-outline-variant/20 rounded-full font-bold text-on-surface-variant">Back</button>
              <button type="submit" :disabled="creating" class="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold disabled:opacity-50">{{ creating ? 'Creating...' : 'Create Invoice' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ===== VIEW INVOICE MODAL ===== -->
    <Teleport to="body">
      <div v-if="viewing" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="viewing = null">
        <div class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/10 my-8 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="font-headline font-bold text-lg">{{ viewing.invoiceNumber }}</h3>
              <p class="text-on-surface-variant text-sm">{{ viewing.providerName }}</p>
              <p v-if="viewing.providerBankName" class="text-on-surface-variant/50 text-xs mt-1">{{ viewing.providerBankName }} · {{ viewing.providerAccount }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" :class="stCls(viewing.status)">{{ viewing.status }}</span>
          </div>

          <div class="space-y-2 mb-6">
            <div v-for="item in viewing.items" :key="item.description" class="flex justify-between text-sm p-3 bg-surface-container-low rounded-lg">
              <span>{{ item.description }} × {{ item.quantity }}</span>
              <span class="font-bold">₦{{ item.total?.toLocaleString() }}</span>
            </div>
          </div>

          <div class="flex justify-between items-end border-t border-outline-variant/10 pt-4 mb-6">
            <span class="font-bold text-on-surface-variant">Total</span>
            <span class="font-headline font-extrabold text-2xl text-primary">₦{{ viewing.total?.toLocaleString() }}</span>
          </div>

          <!-- Share Link -->
          <div v-if="viewing.shareUrl" class="mb-6">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Payment Link</label>
            <div class="flex gap-2">
              <div class="flex-1 h-10 bg-surface-container-low rounded-lg border border-outline-variant/20 px-3 flex items-center overflow-hidden">
                <span class="text-xs text-on-surface-variant truncate">{{ viewing.shareUrl }}</span>
              </div>
              <button @click="copy(viewing.shareUrl)" class="px-4 bg-primary text-white rounded-lg font-bold text-xs shrink-0">Copy</button>
            </div>
            <div class="mt-3 flex gap-2">
              <button @click="shareWhatsApp(viewing.shareUrl)" class="flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container-low text-sm font-bold"><span class="material-symbols-outlined text-green-600 text-lg">chat</span> WhatsApp</button>
              <button @click="shareEmail(viewing)" class="flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container-low text-sm font-bold"><span class="material-symbols-outlined text-orange-500 text-lg">mail</span> Email</button>
            </div>
          </div>

          <!-- Wallet Pay (if open) -->
          <div v-if="viewing.status === 'open'" class="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h4 class="font-headline font-bold text-sm text-primary mb-3">Pay from wallet</h4>
            <div v-if="walletPayError" class="mb-3 p-2 rounded bg-error-container text-on-error-container text-xs">{{ walletPayError }}</div>
            <div v-if="walletPaySuccess" class="mb-3 p-2 rounded bg-secondary-container text-on-secondary-container text-xs">{{ walletPaySuccess }}</div>
            <button @click="handleWalletPay" :disabled="walletPaying" class="w-full py-3 bg-secondary text-white rounded-full font-bold text-sm disabled:opacity-50 active:scale-95 transition-all">
              {{ walletPaying ? 'Processing...' : `Pay ₦${viewing.total?.toLocaleString()} from wallet` }}
            </button>
          </div>

          <!-- Cancel Invoice -->
          <div class="flex gap-3">
            <button v-if="viewing.status === 'open'" @click="handleCancel" :disabled="cancelling" class="flex-1 py-3 border border-error/20 text-error rounded-full font-bold text-sm disabled:opacity-50">{{ cancelling ? 'Cancelling...' : 'Cancel Invoice' }}</button>
            <button @click="viewing = null" class="flex-1 py-3 bg-primary text-white rounded-full font-bold">Close</button>
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

// === Banks ===
const banks = ref<any[]>([])
const fetchBanks = async () => {
  try {
    const res: any = await apiFetch('/api/v1/verify/banks')
    if (res.success) banks.value = Array.isArray(res.data) ? res.data : (res.data?.banks || [])
  } catch (e) { console.error('Failed to fetch banks:', e) }
}
onMounted(fetchBanks)

// === Account Verification ===
const accountName = ref('')
const verifyingAccount = ref(false)
let verifyTimeout: any = null
const onAccountInput = () => {
  accountName.value = ''
  clearTimeout(verifyTimeout)
  if (form.providerAccount.length === 10 && form.providerBank) {
    verifyTimeout = setTimeout(verifyAccount, 500)
  }
}
const verifyAccount = async () => {
  verifyingAccount.value = true
  try {
    const res: any = await apiFetch('/api/v1/verify/account', { method: 'POST', body: { accountNumber: form.providerAccount, bankCode: form.providerBank } })
    if (res.success && res.data) accountName.value = res.data.account_name || res.data.accountName || res.data.name || 'Verified'
  } catch (e) { console.error('Verify failed:', e) }
  finally { verifyingAccount.value = false }
}

// === Receipt Upload ===
const receiptFile = ref<File | null>(null)
const extracting = ref(false)
const handleReceipt = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  receiptFile.value = file
  extracting.value = true
  try {
    const fd = new FormData()
    fd.append('receipt', file)
    const res: any = await apiFetch('/api/v1/extract', { method: 'POST', body: fd })
    if (res.success && res.data?.suggestedInvoice) {
      const s = res.data.suggestedInvoice
      if (s.providerName) form.providerName = s.providerName
      if (s.providerAccount) form.providerAccount = s.providerAccount
      if (s.items?.length) form.items = s.items.map((i: any) => ({ description: i.description, quantity: i.quantity || 1, unitPrice: i.unitPrice || 0 }))
    }
  } catch (e) { console.error('Extract failed:', e) }
  finally { extracting.value = false }
}

// === Create Invoice ===
const showCreate = ref(false)
const createStep = ref(1)
const creating = ref(false)
const createError = ref('')
const form = reactive({
  providerName: '', providerAccount: '', providerBank: '',
  items: [{ description: '', quantity: 1, unitPrice: 0 }] as { description: string; quantity: number; unitPrice: number }[],
})
const invoiceTotal = computed(() => form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0))

const openCreate = () => {
  showCreate.value = true; createStep.value = 1; createError.value = ''
  form.providerName = ''; form.providerAccount = ''; form.providerBank = ''
  form.items = [{ description: '', quantity: 1, unitPrice: 0 }]
  accountName.value = ''; receiptFile.value = null
}
const goStep2 = () => { createStep.value = 2 }
const submitInvoice = async () => {
  createError.value = ''; creating.value = true
  try {
    const items = form.items.map(i => ({ ...i, total: i.quantity * i.unitPrice }))
    const res: any = await apiFetch('/api/v1/invoices', { method: 'POST', body: { providerName: form.providerName, providerAccount: form.providerAccount, providerBank: form.providerBank, items, invoiceDate: new Date().toISOString() } })
    if (res.success) { showCreate.value = false; emit('refresh') }
    else createError.value = res.error?.message || 'Failed.'
  } catch (e: any) { createError.value = e?.data?.error?.message || e?.message || 'Failed. BVN verification may be required.' }
  finally { creating.value = false }
}

// === View Invoice ===
const viewing = ref<any>(null)
const viewInvoice = (inv: any) => { viewing.value = inv; walletPayError.value = ''; walletPaySuccess.value = '' }

// === Wallet Pay ===
const walletPaying = ref(false)
const walletPayError = ref('')
const walletPaySuccess = ref('')
const handleWalletPay = async () => {
  walletPayError.value = ''; walletPaySuccess.value = ''; walletPaying.value = true
  try {
    const res: any = await apiFetch('/api/v1/payments/wallet-pay', { method: 'POST', body: { invoiceId: viewing.value.id, amount: viewing.value.total } })
    if (res.success) { walletPaySuccess.value = 'Payment successful!'; emit('refresh'); setTimeout(() => { viewing.value = null }, 1500) }
    else walletPayError.value = res.error?.message || 'Payment failed.'
  } catch (e: any) { walletPayError.value = e?.data?.error?.message || e?.message || 'Payment failed. Insufficient balance or BVN required.' }
  finally { walletPaying.value = false }
}

// === Cancel Invoice ===
const cancelling = ref(false)
const handleCancel = async () => {
  if (!confirm('Cancel this invoice?')) return
  cancelling.value = true
  try {
    await apiFetch(`/api/v1/invoices/${viewing.value.id}`, { method: 'DELETE' })
    viewing.value = null; emit('refresh')
  } catch (e) { console.error(e) }
  finally { cancelling.value = false }
}

// === Helpers ===
const copy = (url: string) => navigator.clipboard.writeText(url)
const shareWhatsApp = (url: string) => window.open(`https://wa.me/?text=${encodeURIComponent('Pay my medical invoice: ' + url)}`, '_blank')
const shareEmail = (inv: any) => window.open(`mailto:?subject=MediPay Invoice ${inv.invoiceNumber}&body=Please pay my medical invoice: ${inv.shareUrl}`, '_blank')
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
const stCls = (s: string) => {
  if (s === 'paid' || s === 'settled') return 'bg-secondary/10 text-secondary'
  if (s === 'open') return 'bg-tertiary/10 text-tertiary'
  if (s === 'cancelled' || s === 'failed') return 'bg-error/10 text-error'
  return 'bg-primary/10 text-primary'
}
</script>