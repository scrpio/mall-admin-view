import * as API from '@/utils/request'

export default {
  findList: params => {
    return API.GET('/article/list', params)
  },
  getArticle: id => {
    return API.GET(`/article/${id}`)
  },
  add: params => {
    return API.POST('/article/add', params)
  },
  edit: params => {
    return API.POST('/article/update', params)
  },
  remove: ids => {
    return API.POST(`/article/del/${ids}`)
  }
}
