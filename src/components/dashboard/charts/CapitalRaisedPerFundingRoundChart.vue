<template>
  <ChartWrapper :loading="loading">
    <HighChart
      id="capital-raised-per-funding-round"
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
import Highcharts from "highcharts";

const ROUNDS = [
  {
    value: "Seed",
    name: "Seed",
    color: "#1565c0",
  },
  {
    value: "Series A",
    name: "Series A",
    color: "#1de9b6",
  },
  {
    value: "Series B",
    name: "Series B",
    color: "#bdbdbd",
  },
  {
    value: "Series C",
    name: "Series C",
    color: "#9c27b0",
  },
  {
    value: "Series D",
    name: "Series D",
    color: "#f9a825",
  },
];
const OPTIONS = {
  title: {
    text: "Monthly Capital Raised per Funding Round",
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
    series: {
      label: {
        connectorAllowed: false,
      },
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
      gridLineColor: "transparent",
      // gridLineDashStyle: "longdash",
      labels: {
        formatter: function () {
          return "$" + this.value + "B";
        },
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

  xAxis: {
    title: null,
    type: "datetime",
    labels: {
      format: "{value:%b'%y}",
      style: {
        color: "rgb(156 163 175)",
      },
    },
  },
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
            let content = [];
            this.points.forEach((point) => {
              content.push(
                `<div style="color:${point.color}">${
                  point.series.name
                }: <b class="text-500 font-bold" style="color:white"> $${point.y.toFixed(
                  2
                )}B</b> </div>`
              );
            });
            content = content.join("");
            const title = `<div class="text-gray-500 pb-1">Month: <b class="text-white font-semibold">${Highcharts.dateFormat(
              "%b'%y",
              this.x
            )}</b></div>`;
            return `<div class="border border-white rounded p-2">${title} ${content}</div>`;
          },
        },
        series: this.series,
      };
    },
  },
  methods: {
    transformData() {
      const transformedData = [];
      const rounds = ROUNDS.map((i) => i.value);
      this.data.forEach((c) => {
        if (!rounds.includes(c.round)) return;
        const date = new Date(c.date * 1000);
        transformedData.push({
          ...c,
          month: new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0)
          ).getTime(),
        });
      });
      const groups = _.groupBy(transformedData, "round");
      const series = [];
      for (const group in groups) {
        groups[group] = _.groupBy(groups[group], "month");
        const data = [];
        for (const time in groups[group]) {
          data.push({
            x: +time,
            y:
              parseFloat(_.sumBy(groups[group][time], "amount") * 1000000) /
              1000000000,
          });
        }
        const round = ROUNDS.find((r) => r.value === group);
        series.push({
          name: round.name,
          data: _.sortBy(data, "x"),
          type: "spline",
          color: round.color,
          marker: {
            enabled: false,
          },
        });
      }
      this.series = _.sortBy(series, "name");
    },
  },
};
</script>
