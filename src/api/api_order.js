import * as API from '@/utils/request'

export default {
  // 查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/order/list', params)
  },
  // 修改
  edit: params => {
    return API.POST('/order/remark', params)
  },
  // 删除
  remove: params => {
    return API.POST('/order/del/' + params)
  },
  // 订单总数
  countOrder: params => {
    return API.GET('/order/count', params)
  }
}
