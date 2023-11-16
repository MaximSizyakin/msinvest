<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>

<script setup>
import {onMounted} from "vue";
import axios from "axios";

const userLogin = 'maxim.sizyakin@gmail.com';
const userPassword = 'uUgL5m@8DBR-TFU';

const getIndex = async () => {
  try {
    await axios.get('https://iss.moex.com/iss/statistics/engines/stock/markets/index/analytics/IMOEX.json?limit=100')
      .then(response => {
        console.log(response.data);
      });
  } catch (error) {
    console.log(error);
  }

};

onMounted(() => {
  getIndex();
  }
);

</script>
