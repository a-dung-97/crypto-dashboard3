<template>
  <ChartWrapper :loading="loading">
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
        type: "day",
        count: 7,
        text: "7D",
      },
      {
        type: "month",
        count: 1,
        text: "1m",
      },
      {
        type: "month",
        count: 3,
        text: "3m",
      },
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
    tooltip: {
      formatter: function () {
        return [
          "<b>" + Highcharts.dateFormat("Q%q'%y", this.x) + "</b>",
        ].concat(
          this.points
            ? this.points.map(function (point) {
                return (
                  point.series.name +
                  ": $" +
                  (point.y / 1000000000).toFixed(2) +
                  "B"
                );
              })
            : []
        );
      },
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

  xAxis: {
    title: null,
    type: "datetime",
    labels: {
      format: "{value:Q%q'%y}",
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
        series: this.series,
      };
    },
  },
  methods: {
    transformData() {
      const transformedData = [];
      const series = [];
      this.data.forEach((c) => {
        const date = new Date(c.date * 1000);
        const quarter = Math.floor(date.getMonth() / 3);
        const startFullQuarter = new Date(
          Date.UTC(date.getFullYear(), quarter * 3, 1)
        );
        transformedData.push({
          ...c,
          quarter: startFullQuarter.getTime(),
        });
      });
      for (const type of TYPES) {
        const validData = transformedData.filter(
          (item) => item.amount >= type.range[0] && item.amount <= type.range[1]
        );
        const groups = _.groupBy(validData, "quarter");
        const data = [];
        for (const time in groups) {
          data.push({
            x: +time,
            y: groups[time].length,
          });
        }
        series.push({
          name: type.name,
          data: _.sortBy(data, "x"),
          type: "column",
          color: type.color,
          marker: {
            enabled: false,
          },
        });
      }
      this.series = series;
    },
  },
};
</script>
