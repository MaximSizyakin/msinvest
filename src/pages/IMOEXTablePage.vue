<template>
  <div class="q-pa-md">

    <Table :rows="rows"/>

  </div>
</template>

<script setup>
import axios from "axios";
import {computed, onMounted, reactive} from "vue";
// import {Client, Databases, ID, Query} from 'appwrite';
import Table from '../components/IMOEXTable/table.vue';

const imoexIndex = reactive([]);
// const sharesData = reactive([]);
const rows = reactive([]);

// const rows = computed(() => {
//   return imoexIndex.map((el, i, arr) => {
//     return {
//       ...el,
//       coef: '1.0',
//       value: '264.50',
//       sharesToBuy: '230',
//       priceValue: '60 835.00',
//       sharesBought: '0',
//       sharesBoughtValue: '0',
//       done: '0%',
//     };
//   });
// });

const getImoexIndex = async () => {
  try {
    await axios.get('https://iss.moex.com/iss/statistics/engines/stock/markets/index/analytics/IMOEX.json?limit=100')
      .then(response => {
        const data = response.data.analytics.data;
        data.forEach((el, idx) => imoexIndex.push({
          index: idx,
          ticker: el[2],
          name: el[3],
          weight: el[5]
        }));
      });
  } catch (error) {
    console.log(error);
  }
};

// const getSharesData = async (ticker) => {
//   try {
//     await axios.get('https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + ticker + '.json?marketprice_board=1')
//       .then(response => {
//         const data = response.data.marketdata.data[0];
//         sharesData.push({
//           'ticker': data[0],
//           'value': data[12]
//         });
//       });
//
//   } catch (error) {
//     console.log(error);
//   }
// };

const getShareValue = async (ticker) => {
  try {
    return await axios.get('https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + ticker + '.json?marketprice_board=1')
      .then(response => response.data.marketdata.data[0][12]);
  } catch (error) {
    console.log(error);
  }
};

// const writeSharesData = (ticker) => {
//   sharesData.push(ticker);
// };

// const client = new Client()
//   .setEndpoint('https://cloud.appwrite.io/v1')
//   .setProject('6536c8646916edc1b8eb');
//
// const databases = new Databases(client);

onMounted(async () => {
    await getImoexIndex();

    imoexIndex.map(async (el, i, arr) => {
      const value = await getShareValue(el.ticker);
      console.log(value);
      rows.push({
        ...el,
        coef: '1.0',
        value: value,
        // sharesToBuy: '230',
        // priceValue: '60 835.00',
        // sharesBought: '0',
        // sharesBoughtValue: '0',
        // done: '0%',
      });
    });

  }
);
</script>

<style scoped>

</style>