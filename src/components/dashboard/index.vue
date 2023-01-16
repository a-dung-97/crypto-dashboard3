<template>
  <div class="bg-[#16151a] w-full">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <FundraisingRoundsByStageChart :data="data" :loading="loading" />
      </div>
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <DealsBySizeChart :data="data" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = "https://pro.coingen.net/api/llama-raises";
import axios from "axios";
import CapitalRaisedPerFundingRoundChart from "./charts/CapitalRaisedPerFundingRoundChart.vue";
import DealsBySizeChart from "./charts/DealsBySizeChart.vue";
import FundingRoundsByCategory from "./charts/FundingRoundsByCategory.vue";
import FundraisingRoundsByStageChart from "./charts/FundraisingRoundsByStageChart.vue";
export default {
  name: "Dashboard",
  components: {
    FundraisingRoundsByStageChart,
    DealsBySizeChart,
    FundingRoundsByCategory,
    CapitalRaisedPerFundingRoundChart,
  },
  data() {
    return {
      data: [],
      loading: false,
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
      } catch (error) {
        console.error("Can not get data from API");
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
