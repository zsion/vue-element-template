<template>
  <el-tree
    :data="data"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[2, 3]"
    :default-checked-keys="[5]"
    :props="defaultProps"
  >
  </el-tree>
</template>

<script>
// import { fetchList } from '@/api/customer/list'

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'info',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      data: [{
        id: 1,
        label: '国内API产量/出口量数据库'
      }, {
        id: 2,
        label: '国内化学产量数据库'
      }, {
        id: 3,
        label: '国内生物药产量数据库'
      }, {
        id: 4,
        label: '国内医疗器械产量数据库'
      }, {
        id: 5,
        label: '国内中成药产量数据库'
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.items
      //   this.loading = false
      // })
      console.log('123')
    }
  }
}
</script>

