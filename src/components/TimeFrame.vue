<template>
  <div
    v-if="timeFrames.includes('1y')"
    class="font-normal text-[12px] inline float-right"
  >
    <button
      v-for="item in timeFrames"
      :key="item"
      class="w-[33px] ml-[4px] py-[2px] rounded-lg"
      :class="[
        value === item.toString().toLowerCase() ? 'activeBtn' : 'disableBtn',
      ]"
      :disabled="disabled"
      @click="$emit('input', item.toString().toLowerCase())"
    >
      {{ item }}
    </button>
  </div>
  <div v-else class="font-normal text-[12px] inline float-right">
    <button
      v-for="item in timeFrames"
      :key="item.id"
      class="w-[70px] ml-[4px] py-[2px] rounded-lg"
      :class="[
        value === item.toString().toLowerCase() ? 'activeBtn' : 'disableBtn',
      ]"
      :disabled="disabled"
      @click="$emit('input', item.toString().toLowerCase())"
    >
      {{ item }}
    </button>
  </div>
</template>
<script>
export default {
  name: "time-frame",
  props: {
    timeFrames: { type: Array, default: () => [] },
    value: { type: String },
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.activeBtn {
  background-color: rgb(64, 64, 68);
}
button.disableBtn:hover {
  background-color: rgb(55 65 81);
}
</style>
