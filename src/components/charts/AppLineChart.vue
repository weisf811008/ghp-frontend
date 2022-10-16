<script>
import { defineComponent, h, watch, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js'
import merge from 'lodash/merge'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

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
  name: 'LineChart',
  components: {
    Line,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartId: {
      type: String,
      default: 'line-chart',
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
      type: Array,
      default: () => [],
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
    }

    return () =>
      h(Line, {
        chartOptions,
        chartData: newChartData.value,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      })
  },
})
</script>
