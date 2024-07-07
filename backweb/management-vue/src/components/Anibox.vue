<template>
  <div
    class="body"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="onDrag"
    @touchmove="onDrag"
    @mouseup="stopDrag"
    @touchend="stopDrag"
    @mouseleave="stopDrag"
  ></div>
  <svg class="bg" width="40%" height="100%">
    <path :d="headerPath" fill="#3F51B5"></path>
  </svg>
</template>

<script setup>
import { reactive, computed } from "vue";
import dynamics from "dynamics.js";

const headerHeight = 120;
let isDragging = false;

const start = { x: 0, y: 0 };
const c = reactive({ x: headerHeight, y: headerHeight });

const headerPath = computed(() => {
  return `M0,0 L320,0 320,${headerHeight}Q${c.x},${c.y} 0,${headerHeight}`;
});

const contentPosition = computed(() => {
  const dy = c.y - headerHeight;
  const dampen = dy > 0 ? 2 : 4;
  return {
    transform: `translate(0,${dy / dampen}px)`,
  };
});

function startDrag(e) {
  e = e.changedTouches ? e.changedTouches[0] : e;
  isDragging = true;
  start.x = e.pageX;
  start.y = e.pageY;
}

function onDrag(e) {
  e = e.changedTouches ? e.changedTouches[0] : e;
  if (isDragging) {
    c.x = headerHeight + (e.pageX - start.x);
    const dy = e.pageY - start.y;
    const dampen = dy > 0 ? 1.5 : 4;
    c.y = headerHeight + dy / dampen;
  }
}

function stopDrag() {
  if (isDragging) {
    isDragging = false;
    dynamics.animate(
      c,
      { x: headerHeight, y: headerHeight },
      { type: dynamics.spring, duration: 700, friction: 280 }
    );
  }
}
</script>

<style scoped>
.body {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  user-select: none;
  background-color: #c4c4c4;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
