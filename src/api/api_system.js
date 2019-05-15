import * as API from '@/utils/request'

export default {
  // ***************** 基础设置相关api ***************************//
  baseList: params => {
    return API.GET('/sys/base', params)
  },
  editBase: params => {
    return API.POST('/sys/base/update', params)
  },
  // ***************** 快递相关api ***************************//
  // 查询获取列表(通过page分页)
  expressList: params => {
    return API.GET('/express/list', params)
  },
  addExpress: params => {
    return API.POST(`/express/add`, params)
  },
  editExpress: params => {
    return API.POST('/express/update', params)
  },
  // 批量删除，传ids数组
  deleteExpress: ids => {
    return API.POST(`/express/del/${ids}`)
  },
  // ***************** 系统日志相关api ***************************//
  // 查询获取列表(通过page分页)
  logList: params => {
    return API.GET('/sys/log', params)
  },
  // 批量删除，传ids数组
  deleteLog: ids => {
    return API.POST(`/sys/log/del/${ids}`)
  },
  getweather: params => {
    return API.GET('/sys/weather', params)
  }
}
