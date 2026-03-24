<template>
  <div class="c-Cursor" :class="[activeClass, { 'is-active': active }]">
    <div ref="cursorInfo" class="c-Cursor-info">
      <div class="c-Cursor-info-circle">
        <span class="c-Cursor-label">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const activeClass = ref('')
const active = ref(false)
const value = ref('')
const pos = { x: 0, y: 0 }
const target = { x: 0, y: 0 }
const cursorInfo = ref(null)

const onMouseMove = (e) => {
  active.value = true
  target.x = e.clientX
  target.y = e.clientY
}

// Hàm cập nhật vị trí có độ trễ (Inertia) từ Module 181
const update = () => {
  pos.x += (target.x - pos.x) * 0.1
  pos.y += (target.y - pos.y) * 0.1
  
  if (cursorInfo.value) {
    cursorInfo.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px)`
  }
  requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('pointermove', onMouseMove)
  update()
  
  // Lắng nghe sự kiện từ EventHub (Module 181)
  // useNuxtApp().$eventHub.on('cursor:enter', (name, val) => { ... })
})
</script>

<style scoped>
.c-Cursor {
  position: fixed;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 9999;
}
.c-Cursor-info-circle {
  width: 10vw; height: 10vw;
  background: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.is-active .c-Cursor-info-circle { transform: translate(-50%, -50%) scale(1); }
</style>