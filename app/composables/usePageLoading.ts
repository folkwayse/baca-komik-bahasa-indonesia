export const usePageLoading = () => {
  const isLoading = ref(false)
  const progress = ref(0)
  const isError = ref(false)

  let progressInterval: ReturnType<typeof setInterval> | null = null

  const startLoading = () => {
    isLoading.value = true
    isError.value = false
    progress.value = 0

    progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 10
      }
    }, 100)
  }

  const stopLoading = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    progress.value = 100
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 300)
  }

  const showError = () => {
    isError.value = true
    stopLoading()
  }

  const router = useRouter()

  onMounted(() => {
    router.beforeEach((to, from, next) => {
      if (to.path !== from.path) {
        startLoading()
      }
      next()
    })

    router.afterEach(() => {
      stopLoading()
    })

    router.onError((error) => {
      console.error('Navigation error:', error)
      showError()
    })
  })

  return {
    isLoading,
    progress,
    isError
  }
}
