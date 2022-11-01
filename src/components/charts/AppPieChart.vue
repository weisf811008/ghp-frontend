<script>
import { defineComponent, h, watch, ref } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import merge from 'lodash/merge'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'PieChart',
  components: {
    Pie,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartId: {
      type: String,
      default: 'pie-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
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
            datasets: [
              {
                backgroundColor: [
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
                ],
              },
            ],
          })
        }
      }
    )
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    }

    return () =>
      h(Pie, {
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
