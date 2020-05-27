<template>
  <div class="app-container">
    <sticky :sticky-top="60">
      <el-checkbox v-model="editable" label="仅查看可编辑" border @change="handleFilter(0)"></el-checkbox>
      <el-checkbox v-model="available" label="仅查看可获得" border @change="handleFilter(1)"></el-checkbox>
      <el-button type="primary" :disabled="!checkPermission(['admin'])" size="medium" icon="el-icon-circle-plus-outline" class="new-add" @click="handle_DialogAdd()">新增</el-button>
    </sticky>

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

      <el-table-column min-width="200px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="特权标记Id">
        <template slot-scope="scope">
          <span>{{ scope.row.privilegeTagId }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="特权标记名称">
        <template slot-scope="scope">
          <span>{{ scope.row.privilegeTagName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="可获得">
        <template slot-scope="scope">
          <i v-if="scope.row.available === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="可编辑">
        <template slot-scope="scope">
          <i v-if="scope.row.editable === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
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

    <el-dialog :title="titleMap[curr]" :visible.sync="dialogFormAdd" @close="CloseFormAdd">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品" prop="privilegeTagId">
          <el-select v-model="form.privilegeTagId" clearable placeholder="请选择产品" style="width:50%;">
            <el-option
              v-for="item in productoption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="权限项">
          <el-tree
            ref="tree"
            v-loading="treeLoading"
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
              <label>默认值：</label><el-input v-model="data.defaultValue.value" :disabled="!data.defaultValue.allowed" size="mini" clearable placeholder="请输入数字" style="width:175px;" />
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="formLoading" @click="onSubmit('form')">确定</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="infoData.name" :visible.sync="dialogInfo" @close="CloseInfo">
      <el-card class="box-card">
        <el-row class="text item">
          <label>操作：</label>
          <span v-if="infoData.editable === true">
            <el-button type="primary" :disabled="!checkPermission(['admin'])" round size="small" icon="el-icon-edit" @click="handle_DialogEdit(infoData)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
          </span>
          <span v-if="infoData.available === false">
            <el-button type="success" :disabled="!checkPermission(['admin'])" round size="small" icon="el-icon-edit" @click="handle_release(infoData.id)">发布</el-button>
          </span>
          <span v-if="infoData.available === true">
            <el-button type="danger" :disabled="!checkPermission(['admin'])" round size="small" icon="el-icon-edit" @click="handle_withdraw(infoData.id)">下架</el-button>
          </span>
        </el-row>
        <el-row class="text item">
          <label>名称：</label><span>{{ infoData.name }}</span>
        </el-row>
        <el-row class="text item">
          <label>可编辑：</label>
          <i v-if="infoData.editable === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
        </el-row>
        <el-row class="text item">
          <label>产品名：</label><span>{{ infoData.privilegeTagName }}</span>
        </el-row>
        <el-row class="text item">
          <label>权限项：</label>
          <el-tree
            ref="treeInfo"
            v-loading="EditTreeLoading"
            :data="tree_data_info"
            node-key="code"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }">
              <label>名称：</label><span>{{ data.name }}</span><el-divider direction="vertical"></el-divider>
              <!-- <label>默认值：</label><span>{{ data.defaultValue }}</span><el-divider direction="vertical"></el-divider> -->
              <label>默认值：</label><el-input v-model="data.defaultValue.value" :disabled="data.disabled" size="mini" clearable placeholder="请输入数字" style="width:175px;" />
            </span>
          </el-tree>
        </el-row>
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getTag } from '@/api/Privilege/index'
import { getItem } from '@/api/PrivilegeItem/index'
import { searchPack, addPack, editPackId, postRelease, postWithdraw, getPackId } from '@/api/PrivilegePack/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'

export default {
  name: 'ListPackage',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: { editable: null, available: null, privilegeTagIdList: null, page: 1, limit: 20 },
      editable: null,
      available: null,
      dialogFormAdd: false,
      titleMap: ['新增', '编辑'],
      curr: 0,
      treeLoading: false,
      tree_data: [],
      productoption: [],
      formLoading: false,
      form: {
        privilegeList: [],
        privilegeTagId: '',
        name: ''
      },
      rules: {
        privilegeTagId: [
          { required: true, message: '请输入特权标记id', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      privilegePackId: null,
      dialogInfo: false,
      infoData: {},
      EditTreeLoading: false,
      tree_data_info: [],
      tableHeight: window.innerHeight - 250
    }
  },
  created() {
    this.getList()
    this.get_Tag()
    this.get_Item()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      searchPack(this.listQuery).then(response => {
        this.list = response.items || []
        this.total = response.total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter(curr_num) {
      if (curr_num === 0) {
        this.editable === false ? this.listQuery.editable = null : this.listQuery.editable = true
      } else {
        this.available === false ? this.listQuery.available = null : this.listQuery.available = true
      }
      this.listQuery.page = 1
      this.getList()
    },
    get_Tag() {
      getTag().then(response => {
        this.productoption = response || []
      })
    },
    get_Item() {
      this.treeLoading = true
      getItem().then(response => {
        this.tree_data = JSON.parse(JSON.stringify(response)) || []
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },
    handle_DialogAdd() {
      this.curr = 0
      this.dialogFormAdd = true
    },
    handle_DialogEdit(row_data) {
      this.curr = 1
      this.dialogFormAdd = true
      this.privilegePackId = row_data.id
    },
    getCheckedNodes() {
      this.form.privilegeList = this.$refs.tree.getCheckedNodes().map(function(item, index, array) {
        return ({ privilegeItemId: item.id, value: item.defaultValue })
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formLoading = true
          if (this.curr === 0) {
            addPack(this.form).then(response => {
              this.formLoading = false
              this.dialogFormAdd = false
              this.resetForm()
              this.getList()
              this.$message({
                message: '新增成功 0.0',
                type: 'success'
              })
            }).catch(() => {
              this.formLoading = false
            })
          } else if (this.curr === 1) {
            editPackId(this.form, this.privilegePackId).then(response => {
              this.formLoading = false
              this.dialogFormAdd = false
              this.resetForm()
              this.getList()
              this.$message({
                message: '编辑成功 0.0',
                type: 'success'
              })
            }).catch(() => {
              this.formLoading = false
            })
          }
        } else {
          this.$message({
            message: '新增失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.$refs.tree.setCheckedNodes([])
    },
    CloseFormAdd() {
      this.$refs.form.resetFields()
      this.$refs.tree.setCheckedNodes([])
      this.getList()
    },
    handle_release(curr_id) {
      postRelease({}, curr_id).then(response => {
        this.dialogInfo = false
        this.$message({
          message: '发布成功 0.0',
          type: 'success'
        })
      })
    },
    handle_withdraw(curr_id) {
      postWithdraw({}, curr_id).then(response => {
        this.dialogInfo = false
        this.$message({
          message: '下架成功 0.0',
          type: 'success'
        })
      })
    },
    handle_Info(privilegePackId) {
      this.EditTreeLoading = true
      getPackId(privilegePackId).then(response => {
        this.EditTreeLoading = false
        this.dialogInfo = true
        this.infoData = response
        this.filted_Edit(response.privilegeList)
      }).catch(() => {
        this.EditTreeLoading = false
      })
    },
    CloseInfo() {
      this.infoData = {}
      this.tree_data_info = []
      this.getList()
    },
    filted_Edit(datas) {
      for (var i in datas) {
        datas[i].disabled = true
        if (datas[i].children) {
          this.filted_Edit(datas[i].children)
        }
      }
      this.tree_data_info = JSON.parse(JSON.stringify(datas)) || []
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.new-add{
  margin-left: 50px;
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

