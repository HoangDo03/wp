import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.2,
    // Công thức easing đặc trưng từ Module 273 của bạn
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    touchMultiplier: 1, // Từ Module 273
    wheelMultiplier: 1,
  })

  // Vòng lặp cập nhật liên tục (RAF)
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  return {
    provide: {
      lenis: lenis
    }
  }
})