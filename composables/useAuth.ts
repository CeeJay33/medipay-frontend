export const useAuth = () => {
  const token = useState<string | null>('auth_token', () => null)
  const user = useState<any>('auth_user', () => null)
  const wallet = useState<any>('auth_wallet', () => null)

  const setAuth = (data: { token: string; user: any; wallet: any }) => {
    token.value = data.token
    user.value = data.user
    wallet.value = data.wallet

    if (import.meta.client) {
      localStorage.setItem('medipay_token', data.token)
      localStorage.setItem('medipay_user', JSON.stringify(data.user))
      localStorage.setItem('medipay_wallet', JSON.stringify(data.wallet))
    }
  }

  const loadAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('medipay_token')
      const savedUser = localStorage.getItem('medipay_user')
      const savedWallet = localStorage.getItem('medipay_wallet')

      if (savedToken) token.value = savedToken
      if (savedUser) user.value = JSON.parse(savedUser)
      if (savedWallet) wallet.value = JSON.parse(savedWallet)
    }
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    wallet.value = null

    if (import.meta.client) {
      localStorage.removeItem('medipay_token')
      localStorage.removeItem('medipay_user')
      localStorage.removeItem('medipay_wallet')
    }
  }

  const isLoggedIn = computed(() => !!token.value)
  const isVerified = computed(() => user.value?.isVerified === true)

  return { token, user, wallet, setAuth, loadAuth, clearAuth, isLoggedIn, isVerified }
}