<template>
  <div class="app-container">
    <sticky :sticky-top="60">
      <el-tabs v-model="currState" @tab-click="handleFilter">
        <el-tab-pane v-for="item in stateOption" :key="item.id" :label="item.name" :name="item.name" />
      </el-tabs>
    </sticky>

    <el-table
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      border
      :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
      fit
      highlight-current-row
      style="width: 100%;margin-top:50px;"
    >
      <template slot="empty">
        暂无数据 0.0
      </template>
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
      <el-table-column width="200px" align="center" label="活动批准状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activitiApproveStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="活动进程状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activitiProcessStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="已提交">
        <template slot-scope="scope">
          <span>{{ scope.row.submitted }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已审核">
        <template slot-scope="scope">
          <span>{{ scope.row.approved }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已完成">
        <template slot-scope="scope">
          <span>{{ scope.row.completed }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="用户列表">
        <template slot-scope="scope">
          <span v-if="scope.row.userList === null">无</span>
          <el-button v-if="scope.row.userList !== null" type="info" size="small" icon="el-icon-user" @click="handle_Userlist(scope.row.userList)">
            查看
          </el-button>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="时间线">
        <template slot-scope="scope">
          <el-timeline class="timeline">
            <el-timeline-item v-for="item in scope.row.stepList" :key="item.index">
              {{ item }}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="条件">
        <template slot-scope="scope">
          <span>{{ scope.row.condition }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="合同编号">
        <template slot-scope="scope">
          <span>{{ scope.row.contractFileNo }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="客户名">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="客户省描述">
        <template slot-scope="scope">
          <span>{{ scope.row.customerProvinceDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="禁用时间">
        <template slot-scope="scope">
          <span>{{ scope.row.disableTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="生效日期">
        <template slot-scope="scope">
          <span>{{ scope.row.effectiveDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="启用">
        <template slot-scope="scope">
          <i v-if="scope.row.enabled === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="到期">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="400px" align="center" label="转发列表">
        <template slot-scope="scope">
          <el-timeline class="timeline" style="margin-top:15px;">
            <el-timeline-item v-for="item in scope.row.forwardList" :key="item.index">
              <el-card>
                审核人:<span>{{ item.recipientRealName }}</span>
                <el-divider direction="vertical"></el-divider>
                已知会:
                <i v-if="item.acknowledged === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
                <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
                <el-divider direction="vertical"></el-divider>
                可知会:
                <i v-if="item.acknowledgeable === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
                <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="权限包名称">
        <template slot-scope="scope">
          <span>{{ scope.row.privilegePackName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="权限包标记名称">
        <template slot-scope="scope">
          <span>{{ scope.row.privilegePackTagName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="子表ID">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="主表ID">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectMajorId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="提交人Crm部门名称">
        <template slot-scope="scope">
          <span>{{ scope.row.submitterCrmDepartmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="提交人Crm真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.submitterCrmRealName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="提交人真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.submitterRealName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="版本">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="info" size="small" icon="el-icon-info" @click="handle_Info(scope.row.id)">详情</el-button>
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

    <el-dialog title="用户列表" :visible.sync="dialogUserVisible" @close="ClearUserList">
      <el-card class="box-card">
        <el-table :data="userListData">
          <template slot="empty">
            暂无数据 0.0
          </template>
          <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
          <el-table-column prop="realName" label="用户真实姓名" align="center">
          </el-table-column>
          <el-table-column prop="username" label="用户名" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center">
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogEdit" @close="ClearEdit">
      <el-form ref="Form_Edit" :model="edit_Form" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
        <el-form-item label="CRM合同编号" prop="contractFileNo">
          <el-input v-model="edit_Form.contractFileNo" clearable placeholder="请输入CRM合同编号" style="width: 50%;" />
        </el-form-item>
        <el-form-item label="产品开通时间">
          <el-date-picker
            v-model="edit_Form.effectiveDate"
            type="date"
            placeholder="产品开通时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart"
          />
        </el-form-item>
        <el-form-item label="产品结束时间">
          <el-date-picker
            v-model="edit_Form.expirationDate"
            type="date"
            placeholder="产品结束时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd"
          />
        </el-form-item>
        <el-form-item label="选择用户" prop="userIdList">
          <el-select v-model="edit_Form.userIdList" multiple class="filter-item" placeholder="请选择用户" style="width:350px;">
            <el-option
              v-for="item in userOptionsEdit"
              :key="item.userId"
              :label="item.userRealName"
              :value="item.userId"
            >
              <span>{{ item.userRealName }}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color: #8492a6;">{{ item.userMobile }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品权限">
          <el-tabs v-model="curr_tab_edit" lazy @tab-click="handleClickEdit">
            <el-tab-pane v-for="item in tab_data_edit" :key="item.id" :label="item.name" :name="item.name">
            </el-tab-pane>
          </el-tabs>
          <el-tree
            ref="treeEdit"
            v-loading="treeLoading"
            :data="tree_data_edit"
            node-key="code"
            show-checkbox
            default-expand-all
            :expand-on-click-node="false"
            @check-change="getCheckedNodesEdit"
          >
            <span slot-scope="{ node, data }">
              <label>名称：</label><span>{{ data.name }}</span><el-divider direction="vertical"></el-divider>
              <!-- <label>默认值：</label><span>{{ data.defaultValue }}</span><el-divider direction="vertical"></el-divider> -->
              <label>默认值：</label><el-input v-model="data.defaultValue" :disabled="data.disabled" size="mini" clearable placeholder="请输入数字" style="width:175px;" />
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button :loading="editLoading" type="primary" @click="submit_Edit">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="dialogInfo" @close="ClearInfo">
      <el-card class="box-card">
        <el-row class="text item">
          <label>操作：</label>
          <span v-if="infoData.submitted === false">
            <el-button :loading="submitLoading" type="success" round size="small" icon="el-icon-check" @click="handle_Submit(infoData.id)">提交</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" round size="small" icon="el-icon-edit" @click="handle_Edit(infoData)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="确定删除吗？" @onConfirm="() => handle_Delete(infoData.id)">
              <el-button
                slot="reference"
                type="danger"
                round
                size="small"
                icon="el-icon-delete"
              >删除
              </el-button>
            </el-popconfirm>
          </span>
          <span v-if="infoData.completed === true && infoData.approved === true">
            <el-divider direction="vertical"></el-divider>
            <el-button type="success" plain round size="small" icon="el-icon-bell" @click="handle_Acknowledge(infoData.id)">知会</el-button>
          </span>
        </el-row>
        <el-row class="text item">
          <label>时间线：</label>
          <el-timeline class="timeline" style="margin-top:15px;">
            <el-timeline-item v-for="item in infoData.stepList" :key="item.index">
              <el-card>
                审核人：<span>{{ item.step }}</span>
                <span v-if="item.allowed === true">
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="success" round size="small" icon="el-icon-circle-check" @click="handle_Approve(item.step, infoData.id)">批准</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="warning" round size="small" icon="el-icon-circle-close" @click="handle_Reject(item.step, infoData.id)">驳回</el-button>
                </span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-row>
        <el-row class="text item">
          <label>活动批准状态：</label><span>{{ infoData.activitiApproveStatus }}</span>
        </el-row>
        <el-row class="text item">
          <label>活动进程状态：</label><span>{{ infoData.activitiProcessStatus }}</span>
        </el-row>
        <el-row class="text item">
          <label>条件：</label><span>{{ infoData.condition }}</span>
        </el-row>
        <el-row class="text item">
          <label>合同编号：</label><span>{{ infoData.contractFileNo }}</span>
        </el-row>
        <el-row class="text item">
          <label>客户名：</label><span>{{ infoData.customerName }}</span>
        </el-row>
        <el-row class="text item">
          <label>省/市：</label><span>{{ infoData.customerProvinceDescription }}</span>
        </el-row>
        <el-row class="text item">
          <label>禁用时间：</label><span>{{ infoData.disableTime }}</span>
        </el-row>
        <el-row class="text item">
          <label>生效日期：</label><span>{{ infoData.effectiveDate }}</span>
        </el-row>
        <el-row class="text item">
          <label>到期：</label><span>{{ infoData.expirationDate }}</span>
        </el-row>
        <el-row class="text item">
          <label>启用：</label>
          <i v-if="infoData.enabled === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </el-row>
        <el-row class="text item">
          <label>是主表：</label>
          <i v-if="infoData.isMajor === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </el-row>
        <el-row class="text item">
          <label>是否锁定：</label>
          <i v-if="infoData.locked === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </el-row>
        <el-row class="text item">
          <label>权限包名称：</label><span>{{ infoData.privilegePackName }}</span>
        </el-row>
        <el-row class="text item">
          <label>权限包标记名称：</label><span>{{ infoData.privilegePackTagName }}</span>
        </el-row>
        <el-row class="text item">
          <label>提交人Crm部门名称：</label><span>{{ infoData.submitterCrmDepartmentName }}</span>
        </el-row>
        <el-row class="text item">
          <label>提交人Crm真实姓名：</label><span>{{ infoData.submitterCrmRealName }}</span>
        </el-row>
        <el-row class="text item">
          <label>提交人真实姓名：</label><span>{{ infoData.submitterRealName }}</span>
        </el-row>
        <el-row class="text item">
          <label>版本：</label><span>{{ infoData.version }}</span>
        </el-row>
        <el-row class="text item">
          <label>用户列表：</label>
          <el-table :data="infoData.userList">
            <template slot="empty">
              暂无数据 0.0
            </template>
            <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
            <el-table-column prop="realName" label="用户真实姓名" align="center">
            </el-table-column>
            <el-table-column prop="username" label="用户名" align="center">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" align="center">
            </el-table-column>
          </el-table>
        </el-row>
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
import { searchApplication, getApplicationId, editApplicationId, submitApplicationId, deleteApplicationId, getApprove, getReject, getAcknowledge } from '@/api/PrivilegeApplication/index'
import { getUser } from '@/api/customeruser/index'
import { getPack, getPackId } from '@/api/PrivilegePack/index'
import { getItem } from '@/api/PrivilegeItem/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'
export default {
  name: 'ApprovalApply',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        onlyMine: true,
        submitterId: 0,
        submitted: null,
        completed: null,
        approved: null,
        page: 1,
        limit: 20
      },
      tableHeight: window.innerHeight - 250,
      currState: '全部',
      stateOption: [
        { id: 0, name: '全部' },
        { id: 1, name: '未提交' },
        { id: 2, name: '审批中' },
        { id: 3, name: '已完成' }
      ],
      dialogUserVisible: false,
      userListData: null,
      dialogEdit: false,
      userOptionsEdit: [],
      curr_tab_edit: '自定义',
      tab_data_edit: [],
      treeLoading: false,
      tree_data_edit: [],
      editLoading: false,
      edit_Form: {
        contractFileNo: '',
        userIdList: [],
        effectiveDate: '',
        expirationDate: '',
        privilegePackId: 0,
        privilegeList: []
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.edit_Form.expirationDate) {
            return time.getTime() > new Date(this.edit_Form.expirationDate).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.edit_Form.effectiveDate) {
            return time.getTime() < new Date(this.edit_Form.effectiveDate).getTime()
          }
        }
      },
      rules: {
        userIdList: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      dialogInfo: false,
      infoData: {}
    }
  },
  watch: {

  },
  created() {
    this.getList()
    this.get_Item()
  },
  methods: {
    getList() {
      this.listLoading = true
      searchApplication(this.listQuery).then(response => {
        this.list = response.items || []
        this.total = response.total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter(tab, event) {
      if (tab.label === '全部') {
        this.listQuery.onlyMine = true
        this.listQuery.submitted = null
        this.listQuery.approved = null
        this.listQuery.completed = null
      } else if (tab.label === '未提交') {
        this.listQuery.onlyMine = true
        this.listQuery.submitted = false
        this.listQuery.approved = null
        this.listQuery.completed = null
      } else if (tab.label === '审批中') {
        delete this.listQuery.onlyMine
        this.listQuery.submitted = null
        this.listQuery.approved = true
        this.listQuery.completed = null
      } else if (tab.label === '已完成') {
        delete this.listQuery.onlyMine
        this.listQuery.submitted = null
        this.listQuery.approved = null
        this.listQuery.completed = true
      }
      this.listQuery.page = 1
      this.getList()
    },
    handle_Userlist(useData) {
      this.dialogUserVisible = true
      this.userListData = useData
    },
    ClearUserList() {
      this.userListData = null
    },
    get_Item() {
      this.treeLoading = true
      getItem().then(response => {
        this.treeLoading = false
        this.filted_Edit_Optional(response)
      }).catch(() => {
        this.treeLoading = false
      })
    },
    getuser_EditList(customerId, userList) {
      getUser(customerId).then(response => {
        this.userOptionsEdit = response || []
        this.$nextTick(() => {
          this.edit_Form.userIdList = userList !== null ? userList.map(function(item, index, array) {
            return item.id
          }) : []
        })
      })
    },
    filted_Edit(datas) {
      for (var i in datas) {
        datas[i].disabled = true
        if (datas[i].children) {
          this.filted_Edit(datas[i].children)
        }
      }
      this.tree_data_edit = JSON.parse(JSON.stringify(datas)) || []
    },
    filted_Edit_Optional(datas) {
      for (var i in datas) {
        datas[i].disabled = false
        if (datas[i].children) {
          this.filted_Edit_Optional(datas[i].children)
        }
      }
      this.tree_data_edit = JSON.parse(JSON.stringify(datas)) || []
    },
    handleClickEdit(tab, event) {
      this.edit_Form.privilegePackId = this.tab_data_edit[tab.index].id
      if (this.tab_data_edit[tab.index].id !== 0) {
        this.get_PackId_Edit(this.tab_data_edit[tab.index].id)
        this.filted_Edit(this.tree_data_edit)
      } else {
        this.filted_Edit_Optional(this.tree_data_edit)
      }
    },
    get_PackId_Edit(privilegePackId) {
      getPackId(privilegePackId).then(response => {
        if (response.privilegeList !== null) this.$refs.treeEdit.setCheckedNodes(response.privilegeList)
      })
    },
    async get_PrivilegePack_Edit(privilegeTagId) {
      await getPack(privilegeTagId).then(response => {
        response.push({
          available: true,
          editable: true,
          id: 0,
          name: '自定义',
          privilegeTagId: privilegeTagId
        })
        this.tab_data_edit = response || []
        if (this.tab_data_edit.length === 1) {
          this.curr_tab_edit = '自定义'
          this.filted_Edit_Optional(this.tree_data_edit)
        } else {
          this.filted_Edit(this.tree_data_edit)
        }
      })
    },
    getCheckedNodesEdit() {
      this.edit_Form.privilegeList = this.$refs.treeEdit.getCheckedNodes().map(function(item, index, array) {
        return ({ privilegeItemId: item.id, value: item.defaultValue })
      })
    },
    submit_Edit() {
      this.$refs.Form_Edit.validate((valid) => {
        if (valid) {
          const editQuery = {}
          editQuery.contractFileNo = this.edit_Form.contractFileNo
          editQuery.effectiveDate = this.edit_Form.effectiveDate
          editQuery.expirationDate = this.edit_Form.expirationDate
          editQuery.userIdList = this.edit_Form.userIdList
          editQuery.privilegeList = this.edit_Form.privilegeList
          this.editLoading = true
          editApplicationId(editQuery, this.infoData.id).then(response => {
            this.editLoading = false
            this.dialogEdit = false
            this.dialogInfo = false
            this.getList()
            this.$message({
              message: '已保存 0.0',
              type: 'success'
            })
          }).catch(() => {
            this.editLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handle_Edit(useData) {
      this.dialogEdit = true
      await getApplicationId(useData.id).then(response => {
        this.edit_Form.contractFileNo = response.contractFileNo
        this.edit_Form.effectiveDate = response.effectiveDate
        this.edit_Form.expirationDate = response.expirationDate
        this.getuser_EditList(response.customerId, response.userList)
        this.get_PrivilegePack_Edit(response.privilegePackTagId)
        this.edit_Form.privilegePackId = response.privilegePackId
        this.curr_tab_edit = response.privilegePackName || '自定义'
        if (response.privilegePackPrivilegeList !== null) this.$refs.treeEdit.setCheckedNodes(response.privilegePackPrivilegeList)
      })
    },
    ClearEdit() {
      this.$refs.Form_Edit.resetFields()
      this.$refs.treeEdit.setCheckedNodes([])
    },
    handle_Submit(privilegeApplicationId) {
      this.submitLoading = true
      submitApplicationId({}, privilegeApplicationId).then(response => {
        this.submitLoading = false
        this.dialogInfo = false
        this.getList()
        this.$message({
          message: '提交成功 0.0',
          type: 'success'
        })
      }).catch(() => {
        this.submitLoading = false
      })
    },
    handle_Delete(privilegeApplicationId) {
      deleteApplicationId(privilegeApplicationId).then(response => {
        this.dialogInfo = false
        this.getList()
        this.$message({
          message: '删除成功 0.0',
          type: 'success'
        })
      })
    },
    ClearInfo() {
      this.getList()
    },
    handle_Info(privilegeApplicationId) {
      this.dialogInfo = true
      getApplicationId(privilegeApplicationId).then(response => {
        this.infoData = response || {}
      })
    },
    handle_Approve(stepStr, privilegeApplicationId) {
      getApprove({ step: stepStr }, privilegeApplicationId).then(response => {
        this.dialogInfo = false
        this.getList()
        this.$message({
          message: '批准成功 0.0',
          type: 'success'
        })
      })
    },
    handle_Reject(stepStr, privilegeApplicationId) {
      getReject({ step: stepStr }, privilegeApplicationId).then(response => {
        this.dialogInfo = false
        this.getList()
        this.$message({
          message: '驳回成功 0.0',
          type: 'success'
        })
      })
    },
    handle_Acknowledge(privilegeApplicationId) {
      getAcknowledge({}, privilegeApplicationId).then(response => {
        this.dialogInfo = false
        this.getList()
        this.$message({
          message: '知会成功 0.0',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.timeline{
  padding:0;
  margin:0;
}
.timeline li{
  padding-left:0;
  text-align: left;
}
.text {
  font-size: 14px;
}
.item {
  line-height: 35px;
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
<style>
.el-timeline-item__wrapper{
  padding-left: 20px;
}
.el-timeline-item{
  padding: 5px 0 5px;
  line-height: 17.5px;
}
</style>

