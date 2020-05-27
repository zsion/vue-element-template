<template>
  <el-form-item label="权限项">
    <el-tree
      ref="tree"
      v-loading="listLoading"
      :data="tree_data"
      node-key="id"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      @check-change="getCheckedNodes"
    >
      <span slot-scope="{ node, data }">
        <label>名称：</label><span>{{ data.name }}</span><el-divider direction="vertical"></el-divider>
        <!-- <label>默认值：</label><span>{{ data.defaultValue }}</span><el-divider direction="vertical"></el-divider> -->
        <label>默认值：</label><el-input v-model="data.defaultValue" size="mini" clearable placeholder="请输入数字" style="width:175px;" />
      </span>
    </el-tree>
  </el-form-item>
</template>

<script>
import { getItem } from '@/api/PrivilegeItem/index'

export default {
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      listLoading: false,
      tree_data: [],
      form: {
        privilegeList: []
      }
    }
  },
  created() {
    this.get_Item()
  },
  methods: {
    get_Item() {
      this.listLoading = true
      getItem().then(response => {
        this.tree_data = JSON.parse(JSON.stringify(response)) || []
        this.listLoading = false
      })
    },
    getCheckedNodes() {
      this.form.privilegeList = this.$refs.tree.getCheckedNodes().map(function(item, index, array) {
        return ({ privilegeItemId: item.id, value: item.defaultValue })
      })
    }
  }
}
</script>
