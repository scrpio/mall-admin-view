import * as API from '@/utils/request'

export default {
  // ***************** 用户相关api ***************************//
  // 取得验证码
  getCaptcha: params => {
    return API.GET('/captcha/init', params)
  },
  // 登录
  login: (params) => {
    return API.POST('/login', params)
  },
  // 登出
  logout: params => {
    return API.GET('/user/logout', params)
  },
  // 当前用户信息
  tokenUser: params => {
    return API.GET('/user/userInfo', params)
  },
  // 修改密码
  changePwd: params => {
    return API.POST('/user/changePass', params)
  },
  // 修改个人信息
  changeProfile: params => {
    return API.POST('/user/updateUser', params)
  },
  // 修改用户状态
  changeState: params => {
    return API.POST('/user/state', params)
  },
  // 查询获取user列表(通过page分页)
  userList: params => {
    return API.GET('/user/userList', params)
  },
  // 增加用户
  addUser: params => {
    return API.POST('/user/addUser', params)
  },
  // 修改用户
  editUser: params => {
    return API.POST('/user/updateUser', params)
  },
  // 删除用户
  removeUser: ids => {
    return API.POST(`/user/delUser/${ids}`)
  },
  // ***************** 角色相关api ***************************//
  // 查询获取role列表(通过page分页)
  roleList: params => {
    return API.GET('/user/roleList', params)
  },
  getAllRoles: params => {
    return API.GET('/user/getAllRoles', params)
  },
  getRoleById: id => {
    return API.GET(`/user/getRole/${id}`)
  },
  // 增加角色
  addRole: params => {
    return API.POST('/user/addRole', params)
  },
  // 修改角色
  editRole: params => {
    return API.POST('/user/updateRole', params)
  },
  // 删除角色
  removeRole: ids => {
    return API.POST(`/user/delRole/${ids}`)
  },
  // ***************** 权限相关api ***************************/
  // 查询获取perm列表(通过page分页)
  permList: params => {
    return API.GET('/user/permissionList', params)
  },
  getTreePerms: params => {
    return API.GET('/user/treePerms', params)
  },
  getPermsIds: id => {
    return API.GET(`/user/permIds/${id}`)
  },
  // 增加权限
  addPerm: params => {
    return API.POST('/user/addPermission', params)
  },
  // 修改权限
  editPerm: params => {
    return API.POST('/user/updatePermission', params)
  },
  // 删除权限
  removePerm: ids => {
    return API.POST(`/user/delPermission/${ids}`)
  }
}
