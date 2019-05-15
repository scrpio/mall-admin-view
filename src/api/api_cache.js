import * as API from '@/utils/request'

export default {
  indexList: params => {
    return API.GET('/redis/index/list', params)
  },
  indexUpdate: params => {
    return API.GET('/redis/index/update', params)
  },
  recommendList: params => {
    return API.GET('/redis/recommend/list', params)
  },
  recommendUpdate: params => {
    return API.GET('/redis/recommend/update', params)
  }
}
