<template>
  <ChartWrapper :loading="loading">
    <div class="flex justify-center items-center mb-4">
      <!-- <div class="flex"> -->
      <div
        style="font-family: 'Rubik'"
        class="overflow-hidden whitespace-nowrap text-ellipsis text-white font-bold text-[20px]"
      >
        <slot name="title"> {{ title }} </slot>
      </div>
    </div>
    <div
      style="font-family: 'Rubik'"
      class="overflow-hidden whitespace-nowrap text-ellipsis text-white text-center text-[48px] font-bold align-top leading-[50px] h-full"
    >
      <div style="font-family: 'Rubik'">{{ currentQuarterValue }}</div>
    </div>
    <div
      class="overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 text-center text-[16px] font-light align-top leading-[50px] h-full mb-3"
    >
      <span :style="{ color: growth < 0 ? '#e85b5a' : '#8dc950' }"
        >{{ growth }}%
      </span>
      compare to last quarter
    </div>
  </ChartWrapper>
</template>
<script>
import ChartWrapper from "@/components/ChartWrapper.vue";
export default {
  components: {
    ChartWrapper,
  },
  name: "trending-component",
  props: {
    title: String,
    currentQuarterValue: { type: Number, default: 0 },
    lastQuarterValue: { type: Number, default: 0 },
    growth: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
  },
};
</script>
