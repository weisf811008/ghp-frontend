<script>
import { defineComponent, h, watch, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import merge from 'lodash/merge'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const backgroundColor = [
  '#63b2ee',
  '#76da91',
  '#f8cb7f',
  '#f89588',
  '#7cd6cf',
  '#9192ab',
  '#7898e1',
  '#efa666',
  '#eddd86',
  '#9987ce',
  '#63b2ee',
  '#76da91',
]

export default defineComponent({
  name: 'BarChart',
  components: {
    Bar,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartId: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 100,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const newChartData = ref({})
    watch(
      () => props.chartData,
      () => {
        if (props.chartData) {
          newChartData.value = merge({}, props.chartData, {
            datasets: props.chartData.datasets.map((v, i) => ({
              backgroundColor: backgroundColor[i],
            })),
          })
        }
      }
    )
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
        },
      },
    }
    return () =>
      h(Bar, {
        chartOptions,
        chartData: newChartData.value,
        chartId: props.chartId,
        datasetIdKey: props.datasetIdKey,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      })
  },
})
</script>
