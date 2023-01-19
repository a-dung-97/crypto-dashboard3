<template>
  <ChartWrapper :loading="loading">
    <TimeFrame
      class="absolute z-[1] top-[18px] right-[22px] text-white"
      :time-frames="timeFrames"
      v-model="timeFrame"
    />

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
import TimeFrame from "@/components/TimeFrame.vue";
import { getDateRangeByTimeFrame } from "@/ultis";
import { CATEGORIES } from "@/constants";
var pieColors = CATEGORIES.map((c) => c.color);
export default {
  components: {
    ChartWrapper,
    HighChart,
    TimeFrame,
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
    timeFrame: "all",
    timeFrames: ["7d", "1m", "3m", "6m", "1y", "2y", "YTD", "All"],
  }),
  watch: {
    data: {
      handler(val) {
        this.init();
      },
    },
    timeFrame: {
      handler(val) {
        this.init();
      },
    },
  },
  computed: {
    options(vm) {
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
          text: "Investment Value by Category",
          align: "left",
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            fontFamily: "Rubik",
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
          width: 170,
          itemStyle: {
            fontSize: "12px",
            color: "rgb(148 163 184)",
            fontWeight: "normal",
          },
          labelFormatter: function () {
            return (
              "<div> " +
              '<div class="row" style="display: flex; width: 150px; height:25px; justify-content: space-between;"> ' +
              '<div class="col">' +
              this.name +
              "</div>" +
              '<div class="col">' +
              roundValue((this.y * 100) / vm.total, 2) +
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
        const range = getDateRangeByTimeFrame(this.timeFrame);
        const data = this.data.filter((i) => {
          const date = i.date * 1000;
          return date >= range[0] && date <= range[1];
        });
        this.total = data.length;
        this.totalAmount = (
          (_.sumBy(data, "amount") * 1000000) /
          1000000000
        ).toFixed(1);
        let round = [];
        const categories = CATEGORIES.map((c) => c.values).flat();
        const others = data.filter((i) => {
          return i.category && !categories.includes(i.category);
        });
        const invalidData = data.filter((i) => {
          return (
            (!i.category && !i.sector) ||
            (i.sector &&
              !i.category &&
              !categories.some((v) =>
                i.sector.toLowerCase().includes(v.toLowerCase())
              ))
          );
        });
        const ids = others
          .map((i) => i._id)
          .concat(invalidData.map((i) => i._id));
        const validData = data.filter((i) => !ids.includes(i._id));
        for (const category of CATEGORIES) {
          round.push({
            name: category.name,
            count: validData.filter((i) => {
              if (i.category) {
                if (category.values.includes(i.category)) {
                  return true;
                } else {
                  return false;
                }
              } else {
                if (
                  i.sector &&
                  category.values.some((v) =>
                    i.sector.toLowerCase().includes(v.toLowerCase())
                  )
                ) {
                  return true;
                } else {
                  return false;
                }
              }
            }).length,
            color: category.color,
          });
        }
        round[9].count = others.length;
        round = _.orderBy(round.slice(0, -1), ["count"], ["desc"]).concat(
          round[9]
        );
        this.seriesOptions = [
          {
            type: "pie",
            name: "Percent",
            colors: round.map((s) => s.color),
            data: round.map((r) => [r.name, r.count]),
          },
        ];
        this.titleText = `
            <div class="text-center col-span-12 font-bold text-6xl">${this.totalAmount}b</div>
            <div class="text-center font-medium text-3xl">USD</div>
            `;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
