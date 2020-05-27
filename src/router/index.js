import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意：子菜单仅在route children.length>=1时出现
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项目具有多个子路由时，它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中
    noCache: true                如果设置为true，则不会缓存该页（默认为false）
    affix: true                  如果设置为true，则标记将粘贴在“标记”视图中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 可以访问所有角色
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/Home',
    children: [
      {
        path: 'Home',
        name: 'Home',
        component: () => import('@/views/Home/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: {
  //         title: 'External Link',
  //         icon: 'link',
  //         roles: ['admin', 'editor'] // 可以在根导航中设置角色
  //       }
  //     }
  //   ]
  // },

  {
    path: '*',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [

  {
    path: '/Customer',
    component: Layout,
    redirect: '/Customer/list',
    alwaysShow: true, // 将始终显示根菜单
    name: 'Customer',
    meta: {
      title: '客户',
      icon: 'peoples',
      roles: ['salesperson', 'salesmanager', 'salesdirector', 'salesadmin']
    },
    children: [
      {
        path: 'list',
        name: 'ListCustomer',
        component: () => import('@/views/Customer/list'),
        meta: { title: '列表', icon: 'list' }
      },
      {
        path: 'apply',
        name: 'ApplyCustomer',
        component: () => import('@/views/Customer/apply'),
        meta: { title: '试用申请表', icon: 'form' }
      }
    ]
  },

  {
    path: '/User',
    component: Layout,
    redirect: '/User/list',
    alwaysShow: true, // 将始终显示根菜单
    name: 'User',
    meta: {
      title: '用户',
      icon: 'user',
      roles: ['salesperson', 'salesmanager', 'salesdirector', 'salesadmin', 'admin']
    },
    children: [
      {
        path: 'list',
        name: 'ListUser',
        component: () => import('@/views/User/list'),
        meta: { title: '列表', icon: 'list' }
      },
      {
        path: 'edit',
        name: 'EditUser',
        component: () => import('@/views/User/edit'),
        meta: { title: '新增', icon: 'edit' }
      }
    ]
  },

  {
    path: '/Power',
    component: Layout,
    redirect: '/Power/power/list',
    alwaysShow: true, // 将始终显示根菜单
    name: 'Power',
    meta: {
      title: '权限',
      icon: 'tree',
      roles: ['salesperson', 'salesmanager', 'salesdirector', 'salesadmin', 'admin']
    },
    children: [
      {
        path: 'power',
        name: 'PowerPower',
        component: () => import('@/views/Power/power/index'), // Parent router-view
        // meta: { title: '权限项', icon: 'tree-table' },
        redirect: '/Power/power/list',
        children: [
          {
            path: 'list',
            name: 'ListPower',
            component: () => import('@/views/Power/power/list'),
            meta: { title: '权限项管理', icon: 'tree-table' }
          }
        ]
      },
      {
        path: 'package',
        name: 'PackagePower',
        component: () => import('@/views/Power/package/index'), // Parent router-view
        // meta: { title: '权限包', icon: 'component' },
        redirect: '/Power/package/list',
        children: [
          {
            path: 'list',
            name: 'ListPackage',
            component: () => import('@/views/Power/package/list'),
            meta: { title: '权限包管理', icon: 'component' }
          }
        ]
      },
      {
        path: 'apply',
        name: 'ApplyPower',
        component: () => import('@/views/Power/apply/index'), // Parent router-view
        meta: {
          title: '权限申请表',
          icon: 'list',
          roles: ['salesperson', 'salesmanager', 'salesdirector', 'salesadmin']
        },
        redirect: '/Power/apply/list',
        children: [
          {
            path: 'list',
            name: 'ListApply',
            component: () => import('@/views/Power/apply/list'),
            meta: { title: '申请表', icon: 'form' }
          },
          {
            path: 'approval',
            name: 'ApprovalApply',
            component: () => import('@/views/Power/apply/approval'),
            meta: { title: '审批表', icon: 'edit' }
          }
        ]
      }
    ]
  },

  {
    path: '/Administrators',
    component: Layout,
    redirect: '/Administrators/list',
    alwaysShow: true, // 将始终显示根菜单
    name: 'Administrators',
    meta: { title: '管理员', icon: 'people' },
    children: [
      {
        path: 'list',
        name: 'ListAdministrators',
        component: () => import('@/views/Administrators/list'),
        meta: {
          title: '列表',
          icon: 'list',
          roles: ['salesadmin', 'admin']
        }
      }
    ]
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
