<template>
  <!-- a-layout-content -->
  <div>
    <!-- <i class="qi-101-fill"></i> -->
    <div class="container">
      <a-col class="search-item" span="24">
        <a-input-search
          v-model:value="qweather_city"
          placeholder="Input the City you want"
          style="width: 400px; margin: auto"
          @search="qweather"
        >
        </a-input-search>
      </a-col>
      <!-- 展示今日天气 -->
      <p style="margin-top: 10px">
        {{ current_city }} 天气 更新于
        {{ current_weather.obsTime.slice(0, 16).replace("T", " ") }}
      </p>
      <a-row class="weather" style="margin-top: 10px; white-space: nowrap">
        <a-col
          :xs="14"
          :sm="10"
          :md="10"
          :lg="6"
          :xl="5"
          style="white-space: nowrap"
        >
          <i :class="weather_icon" style="font-size: 60px"></i>
          <span style="font-size: 60px; margin-left: 20px">{{
            current_weather.text
          }}</span>
        </a-col>
        <a-col
          :xs="6"
          :sm="6"
          :md="6"
          :lg="3"
          :xl="3"
          style="line-height: 22px"
        >
          <div>风向 : {{ current_weather.windDir }}</div>
          <div>风力 : {{ current_weather.windScale }} 级</div>
          <a-popover title="风向风力具体数据">
            <template #content>
              <p>风向角度 ： {{ current_weather.wind360 }} (N->0)</p>
              <p>风速 ： {{ current_weather.windSpeed }} km/h</p>
            </template>
            <a-button>具体数据</a-button>
          </a-popover>
        </a-col>
        <a-col
          :xs="3"
          :sm="3"
          :md="3"
          :lg="3"
          :xl="3"
          style="line-height: 22px"
        >
          <div>相对湿度 ：{{ current_weather.humidity }} %</div>
          <div>当前小时累计降水量 ： {{ current_weather.precip }} mm</div>
          <div>
            云量 ：
            {{ current_weather.cloud == null ? 0 : current_weather.cloud }} %
          </div>
        </a-col>
      </a-row>
      <a-row style="white-space: nowarp">
        <a-col :xs="10" :sm="6" :md="6" :lg="3" :xl="3" :xxl="2">
          <span style="font-size: 60px; font-weight: 200">
            {{ current_weather.temp }}</span
          >
          <span
            style="
              font-size: 40px;
              font-weight: 200;
              position: relative;
              top: -20px;
            "
            >℃</span
          >
        </a-col>
        <a-col :xs="10" :sm="6" :md="6" :lg="3" :xl="3" :xxl="2">
          <div style="font-size: 10px; position: relative; top: 20px">
            大气压 ： {{ current_weather.pressure }} hp
          </div>
          <div style="position: relative; top: 20px">
            <span style="font-size: 10px"> 体感温度 : </span>

            <span style="font-size: 10px; font-weight: 400">
              {{ current_weather.feelsLike }}</span
            >
            <span
              style="
                font-size: 8px;
                font-weight: 300;
                position: relative;
                top: -2px;
              "
              >℃</span
            >
          </div>
        </a-col>
        <a-col style="margin-top: 20px">
          <a-button @click="showWeatherIndices"> 天气指数 </a-button>
          <a-modal
            v-model:visible="_indices_visible"
            title="天气指数"
            @ok="handleOk"
            style="white-space: nowrap; width: 80%"
          >
            <a-list size="small" bordered :data-source="weather_indices_list">
              <template #renderItem="{ item }">
                <a-list-item>{{ item.name }} ： {{ item.text }}</a-list-item>
              </template>
            </a-list>
          </a-modal>
        </a-col>
        <a-col>
          <v-chart
            style="
              width: 300px;
              height: 200px;
              margin-bottom: -200px;
            "
            :option="wquality_option"
            autoresize
          ></v-chart>
        </a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <div style="font-weight: 400">每小时气温预报</div>
        <!-- 折线图表 -->
        <v-chart class="charts" :option="option" autoresize />
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import axios from "axios";
import "qweather-icons/font/qweather-icons.css";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { GaugeChart } from "echarts/charts";
import VChart from "vue-echarts"; //按需引入

// import * as echarts from 'echarts/core';
// import ECharts from 'vue-echarts';
use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  GaugeChart,
]);

// const city_options = ref([{ city: "1" }, { city: "2" }]);  //模糊搜索数据占位符
const qweather_city = ref("广州");
const current_city = ref("广州");
const current_weather = ref(null);
const current_location = ref(null);
const weather_icon = ref(null);
const _indices_visible = ref(false);
const weather_indices_list = ref([]);
const hr_weather_hour = ref([]);
const hr_weather_temp = ref([]);
const qweather_quality = ref(0);

const option = ref({
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
});

const wquality_option = ref({
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      center: ["50%", "50%"],
      radius: "90%",
      min: 500,
      max: 0,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 3,
          color: [
            [0.0998, "rgb(126,0,35)"], // 1 1 1 2 4 
            [0.4998, "rgb(153,100,76)"],
            [0.6998, "rgb(255,0,0)"],
            [0.7998, "rgb(255,126,0)"],
            [0.8998, "rgb(255,255,0)"],
            [1, "rgb(0,228,0)"],
          ],
        },
      },
      pointer: {
        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
        length: "10%",
        width: 10,
        offsetCenter: [0, "-60%"],
        itemStyle: {
          color: "auto",
        },
      },
      axisTick: {
        length: 6,
        lineStyle: {
          color: "auto",
          width: 2,
        },
      },
      splitLine: {
        length: 10,
        lineStyle: {
          color: "auto",
          width: 2,
        },
      },
      axisLabel: {
        color: "#464646",
        fontSize: 6,
        distance: -35,
        rotate: "tangential",
        formatter: function (value) {
          if (value === 25) {
            return "优";
          } else if (value === 75) {
            return "良";
          } else if (value === 150) {
            return "轻度污染";
          } else if (value === 175) {
            return "中度污染";
          } else if (value === 250) {
            return "重度污染";
          } else if (value === 400) {
            return "严重污染";
          }
          return "";
        },
      },
      title: {
        offsetCenter: [0, "0%"],
        fontSize: 12,
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, "-35%"],
        valueAnimation: true,
        color: "inherit",
      },
      data: [
        {
          value: 0,
          name: "空气质量指数",
        },
      ],
    },
  ],
});

onBeforeMount(() => {
  if (sessionStorage.getItem("weatherData") != null) {
    current_weather.value = JSON.parse(sessionStorage.getItem("weatherData"));
  }
  weather_icon.value = `qi-${current_weather.icon}-fill`;
  qweather();
});

onMounted(() => {
  window.addEventListener("unload", saveWeather);
});

const saveWeather = () => {
  if (current_weather.value != null) {
    sessionStorage.setItem(
      "weatherData",
      JSON.stringify(current_weather.value)
    );
  } else {
    return;
  }
};

const qweather = async () => {
  const res = await axios.request({
    url: "https://geoapi.qweather.com/v2/city/lookup",
    methods: "get",
    params: {
      location: qweather_city.value,
      key: "3adde512afae42b4b19f4076404e8e18",
    },
  });
  if (res.data.code == 200) {
    current_location.value = res.data.location[0].id;
    current_city.value = res.data.location[0].name;
  } else {
    return;
  }
  try {
    const res = await axios.request({
      url: "https://devapi.qweather.com/v7/weather/now",
      methods: "get",
      params: {
        location: current_location.value, //广州
        key: "3adde512afae42b4b19f4076404e8e18",
      },
    });
    // console.log(res.data);
    current_weather.value = res.data.now;
    weather_icon.value = `qi-${res.data.now.icon}-fill`;
  } catch (error) {
  } finally {
    searchIndice();
    hourWeatherForecast();
    searchQuality();
  }
};

const showWeatherIndices = () => {
  _indices_visible.value = true;
  console.log(weather_indices_list.value);
};

const handleOk = () => {
  _indices_visible.value = false;
};

const searchIndice = async () => {
  console.log(current_location.value);
  const res = (
    await axios.request({
      url: "https://devapi.qweather.com/v7/indices/1d",
      params: {
        type: 0,
        location: current_location.value, //广州
        key: "3adde512afae42b4b19f4076404e8e18",
      },
    })
  ).data;
  if (res.code == 200) {
    weather_indices_list.value = res.daily;
  }
};

const searchQuality = async () => {
  const res = (await axios.request({
    url: 'https://devapi.qweather.com/v7/air/now',
    params: {
      key: "3adde512afae42b4b19f4076404e8e18",
      location: current_location.value,
    }
  })).data;
  if (res.code == 200) {
    qweather_quality.value = res.now.aqi;
  }
}

const hourWeatherForecast = async () => {
  hr_weather_hour.value = [""];
  hr_weather_temp.value = [""];
  const res = (
    await axios.request({
      url: "https://devapi.qweather.com/v7/weather/24h",
      params: {
        location: current_location.value,
        key: "3adde512afae42b4b19f4076404e8e18",
      },
    })
  ).data;
  if (res.code != 200) return;
  for (let i = 0; i < 24; i++) {
    hr_weather_hour.value.push(res.hourly[i].fxTime.slice(11, 16));
    hr_weather_temp.value.push(res.hourly[i].temp);
  }
  option.value.xAxis.data = hr_weather_hour.value;
  // console.log('series', option.value.series[0].data);
  option.value.series[0].data = hr_weather_temp.value;
};

// const searchCity = async () => {
//   console.log("模糊搜索", qweather_city.value);
// };
</script>

<style scoped>
.container {
  display: inline-block;
  width: 100%;
}
.search-item {
  display: flex;
  width: 100%;
  justify-items: center;
}
.charts {
  height: 400px;
}
/*  如果容器是隐藏的，ECharts 可能会获取不到 DIV 的高宽导致初始化失败，
这时候可以明确指定 DIV 的style.width和style.height，
或者在div显示后手动调用 resize 调整尺寸。 */
</style>
