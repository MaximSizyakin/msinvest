<template>
  <div class="q-pa-md">
    <q-table
      title="Таблица соответствия индекса Мосбиржи"
      :rows="rows"
      :columns="columns"
      row-key="name"
      dense
      :pagination="pagination"
      rows-per-page-label="Записей на странице"
      :rows-per-page-options="[10, 20, 50, 100]"
      :pagination-label="(s, e, t) => (s + '-' + e + ' из ' + t)"
      no-data-label="Нет данных. Попробуйте позже."
    >

      <template v-slot:body="props">
        <q-tr :props="props">


          <!--          <q-td key="name" :props="props">-->
          <!--            {{ props.row.index + 1 }}-->
          <!--            <q-popup-edit v-model="props.row.name" v-slot="scope">-->
          <!--              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"/>-->
          <!--            </q-popup-edit>-->
          <!--          </q-td>-->
          <!--          <q-td key="calories" :props="props">-->
          <!--            {{ props.row.calories }}-->
          <!--            <q-popup-edit v-model="props.row.calories" title="Update calories" buttons v-slot="scope">-->
          <!--              <q-input type="number" v-model="scope.value" dense autofocus/>-->
          <!--            </q-popup-edit>-->
          <!--          </q-td>-->
          <!--          <q-td key="fat" :props="props">-->
          <!--            <div class="text-pre-wrap">{{ props.row.fat }}</div>-->
          <!--            <q-popup-edit v-model="props.row.fat" v-slot="scope">-->
          <!--              <q-input type="textarea" v-model="scope.value" dense autofocus/>-->
          <!--            </q-popup-edit>-->
          <!--          </q-td>-->
          <!--          <q-td key="carbs" :props="props">-->
          <!--            {{ props.row.carbs }}-->
          <!--            <q-popup-edit v-model="props.row.carbs" title="Update carbs" buttons persistent v-slot="scope">-->
          <!--              <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close"/>-->
          <!--            </q-popup-edit>-->
          <!--          </q-td>-->

          <q-td key="count" :props="props">{{ props.row.index + 1 }}</q-td>
          <q-td key="ticker" :props="props">{{ props.row.ticker }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="weight" :props="props">{{ props.row.weight }}</q-td>
          <q-td key="coef" :props="props">{{props.row.coef}}</q-td>
          <q-td key="value" :props="props">{{ props.row.sharesToBuy }}</q-td>
          <q-td key="sharesToBuy" :props="props">{{ props.row.sharesToBuy }}</q-td>
          <q-td key="priceValue" :props="props">{{ props.row.priceValue }}</q-td>
          <q-td key="sharesBought" :props="props">{{ props.row.sharesBought }}</q-td>
          <q-td key="sharesBoughtValue" :props="props">{{ props.row.sharesBoughtValue }}</q-td>
          <q-td key="done" :props="props">{{ props.row.done }}</q-td>
          <q-td key="sector" :props="props">{{ props.row.sector }}</q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</template>s

<script setup>
import axios from "axios";
import {computed, onMounted, reactive} from "vue";
import {Client, Databases, ID, Query} from 'appwrite';

const imoexIndex = reactive([]);
const sharesData = reactive([]);

const columns = [
  {
    name: 'count',
    required: true,
    label: '#',
    align: 'left',
    field: row => row.index + 1,
  },
  {name: 'ticker', align: 'center', label: 'Тикер', field: 'ticker', sortable: true}, // yes
  {name: 'name', align: 'center', label: 'Название', field: 'name'}, // yes
  {name: 'weight', align: 'center', label: 'Вес', field: 'weight', sortable: true}, // yes
  {name: 'coef', align: 'center', label: 'Коэф-нт', field: 'coef'}, // подумать
  {name: 'value', align: 'center', label: 'Цена', field: 'value'}, // должна обновляться, какой интервал?
  {name: 'sharesToBuy', align: 'center', label: 'Акций купить', field: 'sharesToBuy'}, // computed
  {name: 'priceValue', align: 'center', label: 'Стоимость', field: 'priceValue'}, // computed
  {name: 'sharesBought', align: 'center', label: 'Куплено акций', field: 'sharesBought'}, // ручной ввод
  {name: 'sharesBoughtValue', align: 'center', label: 'Куплено сумма', field: 'sharesBoughtValue'}, // computed
  {name: 'done', align: 'center', label: 'Готовность', field: 'done'}, // сomputed
  {name: 'sector', align: 'center', label: 'Сектор', field: 'sector'},
];

const rows = computed(() => {
  return imoexIndex.map((el, i, arr) => {
    return {
      ...el,
      // coef: '1.0',
      value: '264.50',
      sharesToBuy: '230',
      priceValue: '60 835.00',
      sharesBought: '0',
      sharesBoughtValue: '0',
      done: '0%',
      sector: 'Финансы',
    };
  });
});

// const rows = imoexIndex;

const pagination = {
  sortBy: 'ticker',
  descending: false,
  page: 1,
  rowsPerPage: 20
};

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

const getSharesData = async (ticker) => {
  try {
    await axios.get('https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + ticker + '.json?marketprice_board=1')
      .then(response => {
        const data = response.data.marketdata.data[0];
        sharesData.push({
          'ticker': data[0],
          'last': data[12]
        });
      });

  } catch (error) {
    console.log(error);
  }
};

const writeSharesData = (ticker) => {
  sharesData.push(ticker);

};

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6536c8646916edc1b8eb');

const databases = new Databases(client);

onMounted(async () => {
    await getImoexIndex();

    imoexIndex.forEach(el => {
      getSharesData(el.ticker);
    });
  }
);
</script>

<style scoped>

</style>