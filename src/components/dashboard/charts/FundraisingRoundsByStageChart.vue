<template>
  <ChartWrapper :loading="loading">
    <HighChart
      id="fundraising-rounds-by-stage"
      :options="options"
      height="600px"
      ref="highchart"
    />
  </ChartWrapper>
</template>

<script>
import { roundValue } from "@/ultis";
import ChartWrapper from "@/components/ChartWrapper.vue";
import HighChart from "@/components/HighChart.vue";
var pieColors = [
  "#7c7cf4",
  "#7F00FF",
  "#DA70D6",
  "#8ab4f8",
  "#6495ED",
  "#00FFFF",
  "#77ff77",
  "#aecbfa",
  "#dedede",
];
export default {
  components: {
    ChartWrapper,
    HighChart,
  },
  name: "fundraising-rounds-by-stage",
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data: () => ({
    seriesOptions: [],
    legendX: 85,
    legendY: 30,
    verticalAlign: "middle",
    total: 0,
    titleText: "",
    highchartTemp: null,
  }),
  watch: {
    data: {
      handler(val) {
        this.init();
      },
    },
    total: {
      handler(val) {
        this.highchartTemp?.highChart?.setTitle({
          text: `
            <div class="text-center col-span-12 font-bold text-6xl">${val}</div>
            <div class="text-center font-medium text-3xl">Total</div>
            `,
        });
      },
    },
  },
  computed: {
    options(vm) {
      vm.highchartTemp = vm.$refs.highchart;
      return {
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        chart: {
          backgroundColor: "#2e2e33",
        },
        title: {
          text: "Number of Fundraising Rounds by Stage",
          align: "left",
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
          },
        },
        subtitle: {
          useHTML: true,
          style: {
            color: "#ffffff",
          },
          text: this.titleText,
          align: "center",
          verticalAlign: "middle",
          x: this.legendX,
          y: this.legendY,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          split: false,
          followTouchMove: false,
          animation: false,
          borderRadius: 5,
          borderWidth: 0,
          shadow: false,
          padding: 0,
          hideDelay: 0,
          shared: true,
          formatter: function () {
            let result = `<div class="border border-white rounded p-2">
                <div style="color: ${this.color}">${
              this.key
            }: <span class="text-white font-semibold mr-2">${
              this.y
            }</span><span class="text-gray-500 mr-2">
              (${roundValue(this.percentage, 2)}%)
            </span></div>
                </div>`;
            return result;
          },
        },
        legend: {
          enabled: true,
          useHTML: true,
          borderWidth: 0,
          itemHoverStyle: {
            color: "rgb(148 163 184)",
            fontWeight: "bold",
          },
          verticalAlign: this.verticalAlign,
          layout: "vertical",
          align: "left",
          width: 150,
          itemStyle: {
            fontSize: "12px",
            color: "rgb(148 163 184)",
            fontWeight: "normal",
          },
          labelFormatter: function () {
            vm.total = this.total;
            return (
              '<div class="container-fluid"> ' +
              '<div class="row" style="display: flex; width: 130px; justify-content: space-between"> ' +
              '<div class="col">' +
              this.name +
              "</div>" +
              '<div class="col">' +
              roundValue(this.percentage, 2) +
              "%" +
              "</div>" +
              "</div>" +
              "</div>"
            );
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            innerSize: "60%",
            colors: pieColors,
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        series: this.seriesOptions,
      };
    },
  },
  // async created() {
  //   this.init();
  // },
  methods: {
    init() {
      this.seriesOptions = [];
      try {
        this.fetchData();
      } catch (error) {
        this.seriesOptions = [];
      } finally {
      }
    },
    fetchData() {
      try {
        let data = this.data;
        let roundArr = [...data.map((item) => item.round)];
        this.total = roundArr.length;
        let round = [
          { name: "Seed", count: roundArr.filter((x) => x == "Seed").length },
          { name: "Unknown", count: roundArr.filter((x) => x == null).length },
          {
            name: "Series A",
            count: roundArr.filter((x) => x == "Series A").length,
          },
          {
            name: "Pre-Seed",
            count: roundArr.filter((x) => x == "Pre-Seed").length,
          },
          {
            name: "Strategic",
            count: roundArr.filter((x) => x == "Strategic ").length,
          },
          {
            name: "Series B",
            count: roundArr.filter((x) => x == "Series B").length,
          },
          {
            name: "Series C",
            count: roundArr.filter((x) => x == "Series C").length,
          },
          {
            name: "Pre-Series A",
            count: roundArr.filter((x) => x == "pre-Series A").length,
          },
          { name: "Other", count: 0 },
        ];
        let othersRoundCount = () => {
          let sum = 0;
          for (let i = 0; i < round.length - 1; i++) {
            sum += round[i].count;
          }
          return sum;
        };
        round[8].count = roundArr.length - othersRoundCount();
        this.seriesOptions = [
          [round[0].name, round[0].count],
          [round[1].name, round[1].count],
          [round[2].name, round[2].count],
          [round[3].name, round[3].count],
          [round[4].name, round[4].count],
          [round[5].name, round[5].count],
          [round[6].name, round[6].count],
          [round[7].name, round[7].count],
          [round[8].name, round[8].count],
        ];
        this.seriesOptions = [
          {
            type: "pie",
            name: "Percent",
            data: this.seriesOptions,
          },
        ];
        this.titleText = `
            <div class="text-center col-span-12 font-bold text-6xl">${this.total}</div>
            <div class="text-center font-medium text-3xl">Total</div>
            `;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
