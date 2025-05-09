import { ref, onMounted, onUnmounted } from 'vue'

export function useDeviceDetection() {
  const isMobile = ref<boolean>(false)

  const checkIfMobile = (): void => {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(() => {
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile)
  })

  return {
    isMobile
  }
}