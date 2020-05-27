<template>
  <div class="app-container">
    <div class="filter-container">
      <sticky :sticky-top="60">
        <el-autocomplete
          ref="elautocomplete"
          v-model="listQuery.name"
          :fetch-suggestions="querySearchAsync"
          clearable
          :loading="autoloading"
          placeholder="请输入搜索内容"
          :trigger-on-focus="false"
          style="width: 350px;"
          class="filter-item"
          @input="load_Option"
          @select="handleSelect"
          @keyup.enter.native="handleFilter"
        ></el-autocomplete>
        <el-button
          v-waves
          :loading="listLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜 索</el-button>
      </sticky>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      border
      :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <template slot="empty">
        暂无数据 0.0
      </template>
      <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>

      <el-table-column min-width="300px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="500px" align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="客户状态描述">
        <template slot-scope="scope">
          <span>{{ scope.row.customerStateDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="客户类型描述">
        <template slot-scope="scope">
          <span>{{ scope.row.customerTypeDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="省说明">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!checkPermission(['salesadmin'])" size="small" icon="el-icon-user" @click="handle_Dialog(scope.row)">查看用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog title="查看用户" :visible.sync="dialogFormVisible" @close="ClearUserList">
      <el-select
        ref="userSelect"
        v-model="user_value"
        filterable
        remote
        clearable
        placeholder="请输入用户姓名/手机号"
        :remote-method="remoteMethod"
        :loading="loading"
        loading-text="加载中"
        style="width:50%;"
        @change="do_Bind"
        @visible-change="clearOption($event)"
      >
        <el-option
          v-for="item in user_options"
          :key="item.id"
          :label="item.realName"
          :value="item.id"
          :disabled="item.disabled"
        >
          <span>{{ item.username }}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ item.realName }}</span>
          <el-divider direction="vertical"></el-divider>
          <span style="color: #8492a6;">{{ item.mobile }}</span>
        </el-option>
      </el-select>
      <el-table :data="binduserData" style="width: 100%;margin-top:20px;">
        <template slot="empty">
          暂无数据 0.0
        </template>
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column prop="userRealName" label="用户真实姓名" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="userMobile" label="用户手机号" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="bindTime" label="日期" align="center" min-width="300">
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" :loading="unbindLoading" round size="small" icon="el-icon-unlock" @click="handle_Unbind(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { fetchList, quick_Search } from '@/api/customer/list'
import { user_quick_Search } from '@/api/user/user'
import { getUser, doBind, doUnbind } from '@/api/customeruser/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'
import { MessageBox } from 'element-ui'

export default {
  name: 'ListCustomer',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        name: '',
        page: 1,
        limit: 20
      },
      autoloading: false,
      restaurants: [],
      timeout: null,
      temp: {
        status: 'PDB'
      },
      dialogFormVisible: false,
      customerId: null,
      user_options: [],
      user_value: '',
      loading: false,
      binduserData: [],
      unbindLoading: false,
      tableHeight: window.innerHeight - 250
    }
  },
  watch: {
    user_options(val) {
      if (this.binduserData.length === 0) {
        val.forEach(function(items, indexs, arrays) {
          items.disabled = false
        }, this)
      } else {
        val.forEach(function(items, indexs, arrays) {
          for (let i = 0; i < this.binduserData.length; i++) {
            if (items.realName === this.binduserData[i].userRealName) {
              items.disabled = true
              break
            } else {
              items.disabled = false
            }
          }
        }, this)
      }
    },
    binduserData(val) {
      if (val.length === 0) {
        this.user_options.forEach(function(items, indexs, arrays) {
          items.disabled = false
        }, this)
      } else {
        this.user_options.forEach(function(items, indexs, arrays) {
          for (let i = 0; i < val.length; i++) {
            if (items.realName === val[i].userRealName) {
              items.disabled = true
              break
            } else {
              items.disabled = false
            }
          }
        }, this)
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.items || []
        this.total = response.total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handle_Dialog(row) {
      this.dialogFormVisible = true
      this.customerId = row.id
      this.get_User(row.id)
    },
    load_Option() {
      this.restaurants = []
      if (this.listQuery.name.trim() !== '') {
        this.autoloading = true
        quick_Search({ 'input': this.listQuery.name, 'limit': 20 }).then(response => {
          this.autoloading = false
          this.restaurants = response.map(function(item, index, array) {
            return { value: item.name, address: item.address }
          })
        }).catch(() => {
          this.autoloading = false
        })
      }
    },
    querySearchAsync(queryString, c_back) {
      this.$nextTick(() => {
        c_back(this.restaurants)
        this.$refs.elautocomplete.handleFocus()
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    get_User(customerId) {
      getUser(customerId).then(response => {
        this.binduserData = response || []
      })
    },
    clearOption(callback) {
      if (!callback) {
        this.user_options = []
      }
    },
    do_Bind() {
      if (this.user_value !== '') {
        MessageBox.confirm('此操作将绑定该用户, 是否继续?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认绑定',
          cancelButtonText: '放弃',
          type: 'info',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          doBind({ userId: this.user_value }, this.customerId).then(response => {
            this.user_value = ''
            this.$refs.userSelect.blur()
            this.user_options = []
            this.$message({
              type: 'success',
              message: '绑定成功'
            })
            this.get_User(this.customerId)
          })
        }).catch(() => {
          this.user_value = ''
          this.$refs.userSelect.blur()
          this.user_options = []
          this.$message({
            type: 'warning',
            message: '已放弃绑定'
          })
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        user_quick_Search({ 'input': query, 'limit': 20 }).then(response => {
          this.user_options = response.map(function(item, index, array) {
            return { id: item.id, username: item.username, realName: item.realName, mobile: item.mobile }
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.user_options = []
      }
    },
    handle_Unbind(row) {
      this.unbindLoading = true
      doUnbind({ userId: row.userId }, this.customerId).then(response => {
        this.unbindLoading = false
        this.$message({
          type: 'success',
          message: '解绑成功'
        })
        this.get_User(this.customerId)
      }).catch(() => {
        this.unbindLoading = false
      })
    },
    ClearUserList() {
      this.user_value = ''
      this.user_options = []
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

