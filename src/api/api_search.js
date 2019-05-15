import * as API from '@/utils/request'

export default {
  // 查询获取词典库列表(通过page分页)
  findList: params => {
    return API.GET('/dict/list', params)
  },
  add: params => {
    return API.POST(`/dict/add`, params)
  },
  edit: (id, params) => {
    return API.POST('/dict/update', params)
  },
  remove: ids => {
    return API.POST(`/dict/del/${ids}`)
  },
  importIndex: params => {
    return API.GET('/item/importIndex', params)
  },
  getESInfo: params => {
    return API.GET('/es/getInfo', params)
  }
}
