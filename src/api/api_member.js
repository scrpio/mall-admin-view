import * as API from '@/utils/request'

export default {
  // 查询获取member列表(通过page分页)
  findList: params => {
    return API.GET('/member/list', params)
  },
  // 查询获取member列表(通过page分页)
  removeList: params => {
    return API.GET('/member/list/remove', params)
  },
  // 修改用户状态
  changeState: params => {
    return API.POST('/member/state', params)
  },
  // 还原用户
  recoverState: ids => {
    return API.POST(`/member/recover/${ids}`)
  },
  // 移除用户
  remove: ids => {
    return API.POST(`/member/remove/${ids}`)
  },
  // 删除用户
  delete: ids => {
    return API.POST(`/member/delete/${ids}`)
  },
  // 总数
  countMember: params => {
    return API.GET('/member/count', params)
  }
}
