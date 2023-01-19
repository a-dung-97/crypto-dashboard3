<template>
  <div class="bg-[#16151a] p-4 pb-0" style="overflow-x: hidden">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <InvestmentValueByCategoryChart :data="data" :loading="loading" />
      </div>
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <DealsBySizeChart :data="data" :loading="loading" />
      </div>
      <div class="xl:col-span-12 lg:col-span-12 md:col-span-12">
        <CapitalRaisedPerFundingRoundChart :data="data" :loading="loading" />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="xl:col-span-9 lg:col-span-9 md:col-span-12">
        <CategoryRatioPerFundingRound :data="data" :loading="loading" />
      </div>
      <div class="xl:col-span-3 lg:col-span-3 md:col-span-12">
        <Trending
          v-for="trending in trendings"
          class="gap-4 mb-4"
          :title="trending.title"
          :currentQuarterValue="trending.currentQuarterValue"
          :lastQuarterValue="trending.lastQuarterValue"
          :growth="trending.growth"
          :key="trending.title"
        />
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = "https://pro.coingen.net/api/llama-raises";
import CapitalRaisedPerFundingRoundChart from "./charts/CapitalRaisedPerFundingRoundChart.vue";
import DealsBySizeChart from "./charts/DealsBySizeChart.vue";
import CategoryRatioPerFundingRound from "./charts/CategoryRatioPerFundingRound.vue";
import InvestmentValueByCategoryChart from "./charts/InvestmentValueByCategoryChart.vue";
import Trending from "./charts/Trending.vue";

export default {
  name: "Dashboard",
  components: {
    InvestmentValueByCategoryChart,
    DealsBySizeChart,
    CategoryRatioPerFundingRound,
    CapitalRaisedPerFundingRoundChart,
    Trending,
  },
  data() {
    return {
      data: [],
      loading: false,
      trendings: [
        {
          title: "DeFi",
          values: [
            "DEX",
            "DeFi",
            "DAO infrastructure",
            "Decentrallized",
            "wallet",
            "AMM",
            "liquidly",
            "swap",
            "leveraged",
            "lending",
            "borrowing",
            "money",
          ],
          currentQuarterValue: 0,
          lastQuaterValue: 0,
          growth: 0,
        },
        {
          title: "Web3 & NFTs",
          values: ["NFT", "NFTs", "Web3"],
          currentQuarterValue: 0,
          lastQuaterValue: 0,
          growth: 0,
        },
        {
          title: "Infrastructure",
          values: [
            "Infrastructure",
            "L1",
            "L2",
            "Smart Contract Platform",
            "Zero Knowledge Industry",
            "Layer1",
            "Layer 1",
            "DAO",
          ],
          currentQuarterValue: 0,
          lastQuaterValue: 0,
          growth: 0,
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const data = await (
          await fetch(API_URL, {
            method: "POST",
          })
        ).json();
        this.data = data;
        this.calculateTrending();
      } catch (error) {
        console.error("Can not get data from API");
      } finally {
        this.loading = false;
      }
    },
    calculateTrending() {
      const today = new Date();
      const quarter = Math.floor(today.getMonth() / 3);
      const firstDateOfQuarter = new Date(
        Date.UTC(today.getFullYear(), quarter * 3, 1)
      );
      const endFullQuarter = new Date(
        Date.UTC(
          firstDateOfQuarter.getFullYear(),
          firstDateOfQuarter.getMonth() + 3,
          0
        )
      );
      const startFullLastQuarter = new Date(
        Date.UTC(today.getFullYear(), quarter * 3 - 3, 1)
      );
      const endFullLastQuarter = new Date(
        Date.UTC(
          startFullLastQuarter.getFullYear(),
          startFullLastQuarter.getMonth() + 3,
          0
        )
      );
      const currentRange = [
        firstDateOfQuarter.getTime() / 1000,
        endFullQuarter.getTime() / 1000,
      ];
      const lastRange = [
        startFullLastQuarter.getTime() / 1000,
        endFullLastQuarter.getTime() / 1000,
      ];
      for (const trending of this.trendings) {
        trending.currentQuarterValue = _.sum(
          trending.values.map(
            (v) =>
              this.data.filter((i) => {
                const categoryCondition = i.category
                  ? trending.values.includes(i.category)
                  : trending.values.includes(i.sector);
                return (
                  categoryCondition &&
                  i.date >= currentRange[0] &&
                  i.date <= currentRange[1]
                );
              }).length
          )
        );
        trending.lastQuaterValue = _.sum(
          trending.values.map(
            (v) =>
              this.data.filter((i) => {
                const categoryCondition = i.category
                  ? trending.values.includes(i.category)
                  : trending.values.includes(i.sector);
                return (
                  categoryCondition &&
                  i.date >= lastRange[0] &&
                  i.date <= lastRange[1]
                );
              }).length
          )
        );
        trending.growth = +(
          ((trending.currentQuarterValue - trending.lastQuaterValue) * 100) /
          trending.lastQuaterValue
        ).toFixed(0);
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
