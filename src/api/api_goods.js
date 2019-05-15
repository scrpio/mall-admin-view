import * as API from '@/utils/request'

export default {
  goodsTree: params => {
    return API.GET('/item/cat/list', params)
  },
  addCategory: params => {
    return API.POST('/item/cat/add', params)
  },
  editCategory: params => {
    return API.POST('/item/cat/update', params)
  },
  removeCategory: id => {
    return API.POST(`/item/cat/del/${id}`)
  },
  findList: params => {
    return API.GET('/item/all', params)
  },
  itemList: params => {
    return API.GET('/item/list', params)
  },
  addGoods: params => {
    return API.POST('/item/add', params)
  },
  editGoods: params => {
    return API.POST('/item/update', params)
  },
  removeGoods: ids => {
    return API.POST(`/item/del/${ids}`)
  },
  countGoods: params => {
    return API.GET('/item/count', params)
  }
}
