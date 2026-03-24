<template>
  <section class="c-IntroGradient">
    <canvas ref="webglCanvas"></canvas>
    <slot />
  </section>
</template>

<script setup>
// Tại đây bạn tích hợp đoạn mã JavaScript WebGL 
// mà tôi đã gửi ở phản hồi trước vào hàm onMounted.
// Lưu ý truyền biến uScroll từ plugin lenis vào.
</script>

<style scoped>
.c-IntroGradient {
  position: relative;
  width: 100%; height: 100vh;
  overflow: hidden;
}
canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
</style>