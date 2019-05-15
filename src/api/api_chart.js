import * as API from '@/utils/request'

export default {
  chartOrder: params => {
    return API.GET('/chart/order', params)
  },
  chartPie: params => {
    return API.GET('/chart/orderPie', params)
  },
  chartBar: params => {
    return API.GET('/chart/bar', params)
  },
  chartMix: params => {
    return API.GET('/chart/mix', params)
  },
  chartShare: params => {
    return API.GET('/chart/share', params)
  }
}
