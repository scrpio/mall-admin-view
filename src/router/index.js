import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'basic',
        component: () => import('@/views/system/basic'),
        name: 'Basic',
        meta: { title: '基本设置' }
      },
      {
        path: 'courier',
        component: () => import('@/views/system/courier'),
        name: 'Courier',
        meta: { title: '快递管理' }
      },
      {
        path: 'syslog',
        component: () => import('@/views/system/syslog'),
        name: 'Syslog',
        meta: { title: '系统日志' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    meta: { title: '后台管理员', icon: 'user' },
    children: [
      {
        path: 'role',
        component: () => import('@/views/admin/role'),
        name: 'Role',
        meta: { title: '角色管理' }
      },
      {
        path: 'perm',
        component: () => import('@/views/admin/perm'),
        name: 'Perm',
        meta: { title: '权限管理' }
      },
      {
        path: 'user',
        component: () => import('@/views/admin/user'),
        name: 'User',
        meta: { title: '管理员列表' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    name: 'Shop',
    meta: { title: '商城管理', icon: 'shop' },
    children: [
      {
        path: 'panel',
        component: () => import('@/views/shop/panel'),
        name: 'Panel',
        meta: { title: '首页板块管理' }
      },
      {
        path: 'panelImg',
        component: () => import('@/views/shop/panelImg'),
        name: 'PanelImg',
        meta: { title: '首页轮播图管理' }
      },
      {
        path: 'panelContent',
        component: () => import('@/views/shop/panelContent'),
        name: 'PanelContent',
        meta: { title: '首页板块内容管理' }
      },
      {
        path: 'panelOther',
        component: () => import('@/views/shop/panelOther'),
        name: 'PanelOther',
        meta: { title: '其他板块内容管理' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: 'Goods',
    meta: { title: '商品管理', icon: 'shopping' },
    children: [
      {
        path: 'category',
        component: () => import('@/views/goods/category'),
        name: 'Category',
        meta: { title: '分类管理' }
      },
      {
        path: 'goodsList',
        component: () => import('@/views/goods/list'),
        name: 'GoodsList',
        meta: { title: '商品列表' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'Member',
    meta: { title: '会员管理', icon: 'member' },
    children: [
      {
        path: 'memberList',
        component: () => import('@/views/member/list'),
        name: 'MemberList',
        meta: { title: '会员列表' }
      },
      {
        path: 'removeList',
        component: () => import('@/views/member/removeList'),
        name: 'RemoveList',
        meta: { title: '删除的会员' }
      }
    ]
  },
  {
    path: '/search',
    component: Layout,
    name: 'Search',
    meta: { title: '搜索管理', icon: 'search' },
    children: [
      {
        path: 'searchList',
        component: () => import('@/views/search/list'),
        name: 'SearchList',
        meta: { title: '同步索引' }
      },
      {
        path: 'dictionary',
        component: () => import('@/views/search/dictionary'),
        name: 'Dictionary',
        meta: { title: '词典库管理' }
      }
    ]
  },
  {
    path: '/bulletin',
    component: Layout,
    name: 'Bulletin',
    meta: { title: '新闻公告', icon: 'snippets' },
    children: [
      {
        path: 'editor',
        component: () => import('@/views/bulletin/editor'),
        name: 'Editor',
        meta: { title: '编辑文章' }
      },
      {
        path: 'article',
        component: () => import('@/views/bulletin/article'),
        name: 'Article',
        hidden: true,
        meta: { title: '详细信息' }
      },
      {
        path: 'bulletinList',
        component: () => import('@/views/bulletin/list'),
        name: 'BulletinList',
        meta: { title: '公告列表' }
      }
    ]
  },
  {
    path: '/statistical',
    component: Layout,
    name: 'Statistical',
    meta: { title: '图表统计', icon: 'barchart' },
    children: [
      {
        path: 'mixChart',
        component: () => import('@/views/statistical/mixChart'),
        name: 'MixChart',
        meta: { title: 'MixChart' }
      },
      {
        path: 'shareChart',
        component: () => import('@/views/statistical/shareChart'),
        name: 'ShareChart',
        meta: { title: 'ShareChart' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { icon: 'snippets' },
    children: [
      {
        path: 'orderList',
        component: () => import('@/views/order/list'),
        name: 'OrderList',
        meta: { title: '订单列表' }
      }
    ]
  },
  {
    path: '/cache',
    component: Layout,
    meta: { icon: 'comment' },
    children: [
      {
        path: 'cacheList',
        component: () => import('@/views/cache/main'),
        name: 'CacheList',
        meta: { title: '缓存管理' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'profile',
        component: () => import('@/views/user/profile'),
        meta: { title: '个人中心' }
      },
      {
        path: 'changepwd',
        component: () => import('@/views/user/changepwd'),
        meta: { title: '修改密码' }
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
