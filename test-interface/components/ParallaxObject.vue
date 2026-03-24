<template>
  <div ref="parallaxEl" class="c-ParallaxObject">
    <slot />
  </div>
</template>

<script setup>
import gsap from 'gsap'
const props = defineProps({
  ratio: { type: Number, default: 0.1 } // Độ trễ chuyển động
})

const parallaxEl = ref(null)

onMounted(() => {
  // Logic tính toán vị trí cuộn từ Module 153
  gsap.to(parallaxEl.value, {
    y: () => -window.innerHeight * props.ratio,
    ease: "none",
    scrollTrigger: {
      trigger: parallaxEl.value,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  })
})
</script>