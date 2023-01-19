<template>
  <ChartWrapper :loading="loading">
    <TimeFrame
      class="absolute z-[1] top-[45px] right-[22px] text-white"
      :time-frames="['Monthly', 'Quarterly']"
      v-model="timeFrame"
    />
    <HighChart
      id="deals-by-size"
      :options="options"
      height="600px"
      ref="highchart"
      isStockChart
    />
  </ChartWrapper>
</template>
<script>
import ChartWrapper from "@/components/ChartWrapper.vue";
import HighChart from "@/components/HighChart.vue";
import TimeFrame from "@/components/TimeFrame.vue";
import Highcharts from "highcharts";
const TYPES = [
  {
    range: [25, Infinity],
    name: ">=$25M",
    color: "white",
  },
  {
    range: [10, 25],
    name: "$10-25M",
    color: "#ffcdd2",
  },
  {
    range: [5, 10],
    name: "$5-10M",
    color: "#ce93d8",
  },
  {
    range: [1, 5],
    name: "$1-5M",
    color: "#673ab7",
  },
  {
    range: [-Infinity, 1],
    name: "<$1M",
    color: "#4527a0",
  },
];
const OPTIONS = {
  title: {
    text: "Deals by Size",
    align: "left",
    floating: true,
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "white",
      fontFamily: "Rubik",
    },
  },
  plotOptions: {
    column: {
      stacking: "normal",
    },
  },
  navigator: {
    enabled: false,
  },
  scrollbar: {
    enabled: false,
  },
  rangeSelector: {
    allButtonsEnabled: true,
    floating: false,
    buttonPosition: {
      align: "right",
      x: 0,
      y: 0,
    },
    enabled: true,
    selected: 5,
    height: 45,
    buttons: [
      {
        type: "month",
        count: 6,
        text: "6m",
      },
      {
        type: "year",
        count: 1,
        text: "1y",
      },
      {
        type: "year",
        count: 2,
        text: "2y",
      },
      {
        type: "ytd",
        text: "YTD",
      },
      {
        type: "all",
        text: "All",
      },
    ],
    buttonTheme: {
      fill: "none",
      stroke: "none",
      "stroke-width": 0,
      r: 8,
      style: {
        color: "#fff",
        fontWeight: "normal",
      },
      states: {
        hover: {
          fill: "#404044",
        },
        select: {
          fill: "#404044",
          style: {
            color: "white",
            fontWeight: "normal",
          },
        },
        disabled: { fontWeight: "normal" },
      },
    },
    inputEnabled: false,
    labelStyle: {
      display: "none",
    },
  },
  chart: {
    backgroundColor: "#2e2e33",
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
  yAxis: [
    {
      gridLineColor: "#ffffff1f",
      labels: {
        style: {
          color: "rgb(156 163 175)",
        },
      },
      title: null,
      opposite: false,
      tickAmount: 7,
      showLastLabel: true,
    },
  ],
};
export default {
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      timeFrame: "quarterly",
    };
  },
  components: { ChartWrapper, HighChart, TimeFrame },
  computed: {
    timeFormat() {
      return this.timeFrame === "quarterly"
        ? "{value:Q%q'%y}"
        : "{value:%b'%y}";
    },
    options() {
      const vm = this;
      return {
        ...OPTIONS,
        xAxis: {
          title: null,
          type: "datetime",
          labels: {
            format: this.timeFormat,
            style: {
              color: "rgb(156 163 175)",
            },
          },
        },

        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          split: false,
          followTouchMove: false,
          animation: false,
          borderWidth: 0,
          shadow: false,
          padding: 0,
          hideDelay: 0,
          shared: true,
          formatter: function () {
            const type = vm.timeFrame.replace("ly", "");
            let content = [];
            this.points.forEach((point) => {
              content.push(
                `<div style="color:${point.color}">${
                  point.series.name
                }: <b class="text-500 font-bold" style="color:white"> $${point.point.custom.amount.toFixed(
                  1
                )}m</b> <span class="text-gray-500">(${point.point.custom.per.toFixed(
                  2
                )}%)</span>  </div>`
              );
            });
            content = content.join("");
            const title = `<div class="text-gray-500 pb-1">${
              type.charAt(0).toUpperCase() + type.slice(1)
            }: <b class="text-white font-semibold">${Highcharts.dateFormat(
              type === "month" ? "%b'%y" : "Q%q'%y",
              this.x
            )}</b></div>`;
            return `<div class="border border-white rounded p-2">${title} ${content}</div>`;
          },
        },
        series: this.series,
      };
    },
    series() {
      if (this.data.length === 0) return [];
      const series = [];
      TYPES.forEach((type) => {
        const transformedData = this.data.map((item) => {
          const date = new Date(item.date * 1000);
          const quarter = Math.floor(date.getMonth() / 3);
          const firstDateOfMonth = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), 1)
          );
          const firstDateOfQuarter = new Date(
            Date.UTC(date.getFullYear(), quarter * 3, 1)
          );
          return {
            ...item,
            quarter: firstDateOfQuarter.getTime(),
            month: firstDateOfMonth.getTime(),
            amount: +item.amount,
          };
        });
        const validData = transformedData.filter(
          (item) => item.amount >= type.range[0] && item.amount < type.range[1]
        );
        const validDataGroups = _.groupBy(
          validData,
          this.timeFrame.replace("ly", "")
        );
        const transformedDataGroups = _.groupBy(
          transformedData,
          this.timeFrame.replace("ly", "")
        );

        const data = Object.keys(validDataGroups).map((time) => {
          const total = _.sumBy(transformedDataGroups[time], "amount");
          const amount = _.sumBy(validDataGroups[time], "amount");
          return {
            x: +time,
            y: validDataGroups[time].length,
            custom: {
              amount,
              per: (amount * 100) / total,
            },
          };
        });
        series.push({
          name: type.name,
          data: _.sortBy(data, "x"),
          type: "column",
          color: type.color,
          marker: {
            enabled: false,
          },
        });
      });

      return series;
    },
  },

  methods: {},
};
</script>
