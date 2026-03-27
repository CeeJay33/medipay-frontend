<template>
  <div />
</template>

<script setup lang="ts">
const { loadAuth, isLoggedIn } = useAuth()
onMounted(() => {
  loadAuth()
  nextTick(() => {
    navigateTo(isLoggedIn.value ? '/dashboard' : '/login')
  })
})
</script>