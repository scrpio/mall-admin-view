import * as API from '@/utils/request'

export default {
  // ***************** 板块列表相关api ***************************//
  panelTree: params => {
    return API.GET('/panel/indexAll/list', params)
  },
  bannerTree: params => {
    return API.GET('/panel/indexBanner/list', params)
  },
  mainTree: params => {
    return API.GET('/panel/index/list', params)
  },
  otherTree: params => {
    return API.GET('/panel/other/list', params)
  },
  addPanel: params => {
    return API.POST('/panel/add', params)
  },
  editPanel: params => {
    return API.POST('/panel/update', params)
  },
  removePanel: ids => {
    return API.POST(`/panel/del/${ids}`)
  },
  // ***************** 板块内容管理相关api ***************************//
  findList: (panelId, params) => {
    return API.GET(`/content/list/${panelId}`, params)
  },
  addContent: params => {
    return API.POST('/content/add', params)
  },
  editContent: params => {
    return API.POST('/content/update', params)
  },
  removeContent: ids => {
    return API.POST(`/content/del/${ids}`)
  }
}
