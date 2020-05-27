<template>
  <div class="app-container">
    <div class="filter-container">
      <sticky :sticky-top="60">
        <el-input
          v-model="listQuery.realName"
          clearable
          placeholder="请输入真实姓名"
          style="width: 350px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜 索</el-button>
        <el-button type="primary" :disabled="!checkPermission(['admin'])" icon="el-icon-circle-plus-outline" @click="handle_DialogAdd()">新增关联</el-button>
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

      <el-table-column min-width="150px" align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="crm真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.crmRealName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="crm用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.crmUsername }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="crm部门">
        <template slot-scope="scope">
          <span>{{ scope.row.crmDepartmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="crm职位">
        <template slot-scope="scope">
          <span>{{ scope.row.crmPosition }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="info" size="small" icon="el-icon-info" @click="handle_Dialog(scope.row)">详情</el-button>
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
    <el-dialog title="新增关联" :visible.sync="dialog_Visible_Add" @close="ClearAdd">
      <el-form ref="userinfo_form" :model="userinfo_form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-select
            v-model="userinfo_form.username"
            filterable
            remote
            clearable
            placeholder="请输入并选择用户名"
            :remote-method="remoteUsername"
            :loading="loading"
            loading-text="加载中"
            style="width:60%;"
          >
            <el-option
              v-for="item in username_options"
              :key="item.index"
              :label="item.name"
              :value="item.username"
            >
              <span>{{ item.name }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ item.username }}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color: #8492a6;">{{ item.email }}（{{ item.subjectId }}）</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CRM用户" prop="crmId">
          <el-select
            v-model="userinfo_form.crmId"
            filterable
            remote
            clearable
            placeholder="请输入并选择CRM用户"
            :remote-method="remoteMethod"
            :loading="loading"
            loading-text="加载中"
            style="width:60%;"
          >
            <el-option
              v-for="item in crmId_options"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
              <span>{{ item.realName }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ item.username }}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color: #8492a6;">{{ item.position }}（{{ item.departmentName }}）</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="addLoading" @click="handle_Add('userinfo_form')">确定</el-button>
          <el-button @click="handle_Reset('userinfo_form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="row_data.realName" :visible.sync="dialog_Visible" @close="ClearInfo">
      <el-tabs v-model="curr_tab" @tab-click="handleClick">
        <el-tab-pane label="关联/取关" name="first">
          <el-form ref="connect_form" :model="connect_form" :rules="rules" label-width="100px">
            <el-form-item label="用户名">
              <span>{{ row_data.username }}</span>
            </el-form-item>
            <el-form-item label="真实姓名">
              <span>{{ row_data.realName }}</span>
            </el-form-item>
            <el-form-item v-if="row_data.crmRealName !== null" label="CRM真实姓名">
              <span>{{ row_data.crmRealName }}</span>
            </el-form-item>
            <el-form-item v-if="row_data.crmUsername !== null" label="CRM用户名">
              <span>{{ row_data.crmUsername }}</span>
            </el-form-item>
            <el-form-item v-if="row_data.crmDepartmentName !== null" label="CRM部门">
              <span>{{ row_data.crmDepartmentName }}</span>
            </el-form-item>
            <el-form-item v-if="row_data.crmPosition !== null" label="CRM职位">
              <span>{{ row_data.crmPosition }}</span>
            </el-form-item>
            <el-form-item v-if="row_data.crmRealName === null" label="CRM用户" prop="crmId">
              <el-select
                v-model="connect_form.crmId"
                filterable
                remote
                clearable
                placeholder="请输入并选择CRM用户"
                :remote-method="remoteMethod_edit"
                :loading="loading"
                loading-text="加载中"
                style="width:60%;"
              >
                <el-option
                  v-for="item in crmId_options_edit"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                  <span>{{ item.realName }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>{{ item.username }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span style="color: #8492a6;">{{ item.position }}（{{ item.departmentName }}）</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button v-if="row_data.crmRealName === null" type="primary" :loading="connectLoading" @click="handle_connect('connect_form')">关联</el-button>
              <el-button v-if="row_data.crmRealName !== null" type="warning" :loading="disconnectLoading" @click="handle_disconnect()">取关</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="授予/撤销" name="second">
          <el-form ref="grant_form" :model="grant_form" :rules="rules" label-width="100px">
            <el-form-item label="已有角色">
              <el-table
                v-loading="grantLoading || revoke_Loading"
                :data="rolelist"
                fit
                highlight-current-row
              >
                <template slot="empty">
                  暂无数据 0.0
                </template>
                <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
                <el-table-column min-width="200px" align="center" label="编码">
                  <template slot-scope="scope">
                    <span>{{ scope.row.code }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="200px" align="center" label="名称">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column width="100px" align="center" label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="warning" :disabled="!checkPermission(['admin'])" :loading="revoke_Loading" round size="small" icon="el-icon-unlock" @click="handle_revoke(scope.row)">撤销</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="grant_form.roleId" clearable placeholder="请选择角色" style="width:50%;">
                <el-option
                  v-for="item in roleId_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!checkPermission(['admin'])" :loading="grantLoading" @click="handle_grant('grant_form')">授予</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="区域授予/撤销" name="third">
          <el-form ref="region_form" :model="region_form" :rules="rules" label-width="100px">
            <el-form-item label="已有区域">
              <el-table
                v-loading="region_grantLoading || region_revoke_Loading"
                :data="regionlist"
                fit
                highlight-current-row
              >
                <template slot="empty">
                  暂无数据 0.0
                </template>
                <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
                <el-table-column min-width="150px" align="center" label="名称">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="100px" align="center" label="全部">
                  <template slot-scope="scope">
                    <i v-if="scope.row.isAll === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
                    <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
                  </template>
                </el-table-column>
                <el-table-column min-width="100px" align="center" label="直接">
                  <template slot-scope="scope">
                    <i v-if="scope.row.isDirect === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
                    <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
                  </template>
                </el-table-column>
                <el-table-column min-width="100px" align="center" label="国内">
                  <template slot-scope="scope">
                    <i v-if="scope.row.isDomestic === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
                    <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
                  </template>
                </el-table-column>
                <el-table-column min-width="100px" align="center" label="包含类型">
                  <template slot-scope="scope">
                    <span>{{ scope.row.includingType }}</span>
                  </template>
                </el-table-column>
                <el-table-column width="100px" align="center" label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="warning" :disabled="!checkPermission(['salesadmin'])" :loading="region_revoke_Loading" round size="small" icon="el-icon-unlock" @click="handle_region_revoke(scope.row)">撤销</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="区域" prop="regionId">
              <el-select v-model="region_form.regionId" clearable placeholder="请选择区域" style="width:50%;">
                <el-option
                  v-for="item in regionId_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!checkPermission(['salesadmin'])" :loading="region_grantLoading" @click="handle_region_grant('region_form')">授予</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getRole, getRegion, authSearch, crmSearch } from '@/api/Admin/index'
import { fetchList, addUser, getConnect, getDisconnect, getGrant, getRevoke, getHaveRole, getHaveRegion, getRegionGrant, getRegionRevoke } from '@/api/AdminUser/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'

export default {
  name: 'ListAdministrators',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        username: '',
        realName: '',
        page: 1,
        limit: 20
      },
      restaurants: [],
      dialog_Visible_Add: false,
      username_options: [],
      userinfo_form: {
        username: null,
        crmId: null
      },
      row_data: [],
      dialog_Visible: false,
      curr_tab: 'first',
      loading: false,
      crmId_options: [],
      crmId_options_edit: [],
      connect_form: {
        crmId: null
      },
      revoke_Loading: false,
      roleId_options: [],
      grant_form: {
        roleId: null
      },
      rolelist: [],
      region_revoke_Loading: false,
      regionId_options: [],
      region_form: {
        regionId: null
      },
      regionlist: [],
      rules: {
        crmId: [
          { required: true, message: '请输入并选择CRM用户', trigger: ['blur', 'change'] }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ],
        regionId: [
          { required: true, message: '请选择区域', trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      disconnectLoading: false,
      connectLoading: false,
      grantLoading: false,
      region_grantLoading: false,
      addLoading: false,
      tableHeight: window.innerHeight - 250
    }
  },
  watch: {
    rolelist(val) {
      if (val.length === 0) {
        this.roleId_options.forEach(function(items, indexs, arrays) {
          items.disabled = false
        }, this)
      } else {
        this.roleId_options.forEach(function(items, indexs, arrays) {
          for (let i = 0; i < val.length; i++) {
            if (items.name === val[i].name) {
              items.disabled = true
              break
            } else {
              items.disabled = false
            }
          }
        }, this)
      }
    },
    regionlist(val) {
      if (val.length === 0) {
        this.regionId_options.forEach(function(items, indexs, arrays) {
          items.disabled = false
        }, this)
      } else {
        this.regionId_options.forEach(function(items, indexs, arrays) {
          for (let i = 0; i < val.length; i++) {
            if (items.name === val[i].name) {
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
    this.get_Role()
    this.get_Region()
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
    get_HaveRole() {
      getHaveRole(this.row_data.id).then(response => {
        this.rolelist = response || []
      })
    },
    get_HaveRegion() {
      getHaveRegion(this.row_data.id).then(response => {
        this.regionlist = response || []
      })
    },
    handle_DialogAdd() {
      this.dialog_Visible_Add = true
    },
    handle_Add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true
          addUser({ username: this.userinfo_form.username, crmId: this.userinfo_form.crmId }).then(response => {
            this.addLoading = false
            this.$refs.userinfo_form.resetFields()
            this.$message({
              message: '已关联 0.0',
              type: 'success'
            })
          }).catch(() => {
            this.addLoading = false
          })
        } else {
          this.$message({
            message: '关联失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handle_Reset() {
      this.$refs.userinfo_form.resetFields()
    },
    handle_Dialog(row) {
      this.row_data = row
      this.dialog_Visible = true
      this.get_HaveRole()
      this.get_HaveRegion()
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    remoteUsername(query) {
      if (query !== '') {
        this.loading = true
        authSearch({ 'input': query, 'limit': 20 }).then(response => {
          this.username_options = response
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.username_options = []
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        crmSearch({ 'input': query, 'limit': 20 }).then(response => {
          this.crmId_options = response
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.crmId_options = []
      }
    },
    remoteMethod_edit(query) {
      if (query !== '') {
        this.loading = true
        crmSearch({ 'input': query, 'limit': 20 }).then(response => {
          this.crmId_options_edit = response
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.crmId_options_edit = []
      }
    },
    handle_connect(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.connectLoading = true
          getConnect({ crmId: this.connect_form.crmId }, this.row_data.id).then(response => {
            this.connectLoading = false
            this.$refs.connect_form.resetFields()
            this.dialog_Visible = false
            this.$message({
              message: '已关联 0.0',
              type: 'success'
            })
          }).catch(() => {
            this.connectLoading = false
          })
        } else {
          this.$message({
            message: '关联失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handle_disconnect() {
      this.disconnectLoading = true
      getDisconnect({}, this.row_data.id).then(response => {
        this.disconnectLoading = false
        this.dialog_Visible = false
        this.$message({
          message: '已取关 0.0',
          type: 'success'
        })
      }).catch(() => {
        this.disconnectLoading = false
      })
    },
    get_Role() {
      getRole().then(response => {
        this.roleId_options = response || []
      })
    },
    handle_grant(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.grantLoading = true
          getGrant({ roleId: this.grant_form.roleId }, this.row_data.id).then(response => {
            this.grantLoading = false
            this.$refs.grant_form.resetFields()
            this.$message({
              message: '已授予 0.0',
              type: 'success'
            })
            this.get_HaveRole()
          }).catch(() => {
            this.grantLoading = false
          })
        } else {
          this.$message({
            message: '授予失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handle_revoke(rowdata) {
      this.revoke_Loading = true
      getRevoke({ roleId: rowdata.id }, this.row_data.id).then(response => {
        this.revoke_Loading = false
        this.$message({
          message: '已撤销 0.0',
          type: 'success'
        })
        this.get_HaveRole()
      }).catch(() => {
        this.revoke_Loading = false
      })
    },
    get_Region() {
      getRegion().then(response => {
        this.regionId_options = response || []
      })
    },
    handle_region_grant(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.region_grantLoading = true
          getRegionGrant({ regionId: this.region_form.regionId }, this.row_data.id).then(response => {
            this.region_grantLoading = false
            this.$refs.region_form.resetFields()
            this.$message({
              message: '已授予 0.0',
              type: 'success'
            })
            this.get_HaveRegion()
          }).catch(() => {
            this.region_grantLoading = false
          })
        } else {
          this.$message({
            message: '授予失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handle_region_revoke(rowdata) {
      this.region_revoke_Loading = true
      getRegionRevoke({ regionId: rowdata.id }, this.row_data.id).then(response => {
        this.region_revoke_Loading = false
        this.$message({
          message: '已撤销 0.0',
          type: 'success'
        })
        this.get_HaveRegion()
      }).catch(() => {
        this.region_revoke_Loading = false
      })
    },
    ClearInfo() {
      this.curr_tab = 'first'
      this.$nextTick(() => {
        this.connect_form.crmId = null
        this.crmId_options_edit = []
      })
      this.getList()
    },
    ClearAdd() {
      this.$nextTick(() => {
        this.$refs.userinfo_form.resetFields()
      })
      this.getList()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

