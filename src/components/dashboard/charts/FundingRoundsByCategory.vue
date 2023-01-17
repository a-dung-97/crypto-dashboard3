<template>
  <ChartWrapper :loading="loading">
    <HighChart
      id="funding-round-by-category"
      :options="options"
      height="585px"
      ref="highchart"
    />
  </ChartWrapper>
</template>
<script>
import ChartWrapper from "@/components/ChartWrapper.vue";
import HighChart from "@/components/HighChart.vue";
const CATEGORIES = [
  {
    value: "Web3",
    name: "Web 3",
    color: "#512da8",
  },
  {
    value: "NFT",
    name: "NFTs",
    color: "#1976d2",
  },
  {
    value: "DeFi",
    name: "DeFi",
    color: "#26c6da",
  },
  {
    value: "Infrastructure",
    name: "Infrastructure",
    color: "#f48fb1",
  },
  {
    value: "CeFi",
    name: "CeFi",
    color: "#b2ebf2",
  },
];
const ROUNDS = [
  {
    value: "Seed",
    name: "Seed",
  },
  {
    value: "Strategic ",
    name: "Strategic",
  },
  {
    value: "Series A",
    name: "Series A",
  },
  {
    value: "Series B",
    name: "Series B",
  },
  {
    value: "Series C",
    name: "Series C",
  },
  {
    value: "Series D",
    name: "Series D",
  },
  {
    value: "Series E",
    name: "Series E",
  },
  {
    value: "Series F",
    name: "Series F",
  },
];
const OPTIONS = {
  chart: {
    type: "column",
    backgroundColor: "#2e2e33",
  },

  title: {
    text: "Number of Funding Rounds by Category",
    align: "left",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "white",
    },
  },
  xAxis: {
    categories: ROUNDS.map((i) => i.value),
  },
  yAxis: {
    min: 0,
    title: {
      text: null,
    },
    gridLineColor: "transparent",
  },

  tooltip: {
    headerFormat: "<b>{point.x}</b><br/>",
    pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
  },
  plotOptions: {
    column: {
      stacking: "normal",
    },
  },
  legend: {
    enabled: true,
    align: "center",
    verticalAlign: "top",
    itemStyle: {
      color: "#e0e0e0",
      fontWeight: "normal",
    },
  },
  series: [],
};
export default {
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  watch: {
    data() {
      this.transformData();
    },
  },
  data() {
    return {
      series: [],
    };
  },
  components: { ChartWrapper, HighChart },
  computed: {
    options() {
      return {
        ...OPTIONS,
        series: this.series,
      };
    },
  },
  methods: {
    transformData() {
      const rounds = ROUNDS.map((i) => i.value);
      const series = [];
      for (const category of CATEGORIES) {
        const data = [];
        for (const round of rounds) {
          data.push(
            this.data.filter(
              (i) => i.round === round && i.category === category.value
            ).length
          );
        }
        series.push({
          name: category.name,
          data,
          color: category.color,
        });
      }
      this.series = series;
    },
  },
};
</script>
