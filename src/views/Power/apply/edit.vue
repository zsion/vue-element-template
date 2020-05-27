<template>
  <div class="app-container">
    <el-steps :active="current" align-center finish-status="success">
      <el-step :title="titleMap[0]"></el-step>
      <el-step :title="titleMap[1]"></el-step>
      <el-step :title="titleMap[2]"></el-step>
      <el-step :title="titleMap[3]"></el-step>
      <el-step :title="titleMap[4]"></el-step>
    </el-steps>

    <div v-show="toggleArray[0] === true">
      <el-form ref="Form_customer" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
        <el-form-item label="选择客户（企业）" prop="company">
          <el-select
            v-model="ruleForm.company"
            class="filter-item"
            filterable
            remote
            clearable
            placeholder="请输入并选择客户(企业)"
            style="width:350px;"
            :remote-method="getcustomerList"
            :loading="listLoading"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="companySure(1)">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="toggleArray[1] === true">
      <el-form ref="Form_user" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
        <el-form-item label="选择用户" prop="user">
          <el-select v-model="ruleForm.user" class="filter-item" clearable placeholder="请选择用户" style="width:350px;">
            <el-option
              v-for="item in userOptions"
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
        <el-form-item>
          <el-button type="primary" @click="userSure(2)">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="toggleArray[2] === true">
      <el-form ref="Form_privilegeTagId" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
        <el-form-item label="产品" prop="privilegeTagId">
          <el-select v-model="ruleForm.privilegeTagId" class="filter-item" clearable placeholder="请选择产品" style="width:350px;">
            <el-option
              v-for="item in productoption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="正式/试用" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="1">正式</el-radio>
            <el-radio :label="0">试用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="productSure(3)">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="toggleArray[3] === true">
      <el-form ref="Form_contract" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
        <el-form-item label="CRM合同编号" prop="contract">
          <el-input v-model="ruleForm.contract" clearable placeholder="请输入CRM合同编号" style="width: 50%;" />
        </el-form-item>
        <el-form-item label="产品开通时间" prop="startdate">
          <el-date-picker
            v-model="ruleForm.startdate"
            type="date"
            placeholder="产品开通时间"
            style="width: 50%;"
          />
        </el-form-item>
        <el-form-item label="产品结束时间" prop="enddate">
          <el-date-picker
            v-model="ruleForm.enddate"
            type="date"
            placeholder="产品结束时间"
            style="width: 50%;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="contractSure(4)">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="toggleArray[4] === true">
      <el-form ref="Form_power" :model="ruleForm" :rules="rules" label-width="57px" label-position="left" style="margin:50px 0 0 50px;">
        <el-tabs v-model="curr_tab" @tab-click="handleClick">
          <el-tab-pane label="高级版" name="CN">
            高级版
          </el-tab-pane>
          <el-tab-pane label="标准版" name="US">
            标准版
          </el-tab-pane>
          <el-tab-pane label="基础版" name="JP">
            基础版
          </el-tab-pane>
          <el-tab-pane label="自定义" name="EU">
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
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="powerSure(5)">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="line-center">
      <el-button @click="handleReset()">重置</el-button>
    </div>
  </div>
</template>

<script>
import { customerList } from '@/api/user/user'
import { getUser } from '@/api/customeruser/index'
import { getTag } from '@/api/Privilege/index'
import { getItem } from '@/api/PrivilegeItem/index'

export default {
  name: 'EditApply',
  components: { },
  data() {
    return {
      listLoading: false,
      titleMap: ['选择客户（企业）', '选择用户', '选择产品', '合同信息', '新增产品权限'],
      toggleArray: [true, false, false, false, false],
      current: 0,
      tree_data: [],
      ruleForm: {
        company: '',
        user: '',
        privilegeTagId: '',
        type: '',
        contract: '',
        startdate: '',
        enddate: '',
        privilegeList: []
      },
      companyOptions: [],
      userOptions: [],
      productOption: [],
      rules: {
        company: [
          { required: true, message: '请选择客户（企业）', trigger: ['blur', 'change'] }
        ],
        user: [
          { required: true, message: '请选择用户', trigger: ['blur', 'change'] }
        ],
        privilegeTagId: [
          { required: true, message: '请选择产品', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择正式/试用', trigger: 'change' }
        ],
        contract: [
          { required: true, message: '请输入CRM合同编号', trigger: 'blur' }
        ],
        startdate: [
          { required: true, message: '请选择产品开通时间', trigger: 'change' }
        ],
        enddate: [
          { required: true, message: '请选择产品结束时间', trigger: 'change' }
        ]
      },
      curr_tab: 'EU'
    }
  },
  watch: {
    curr_tab(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.curr_tab = tab
    }
    this.get_Tag()
    this.get_Item()
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    getcustomerList(query) {
      if (query !== '') {
        this.listLoading = true
        setTimeout(() => {
          this.listLoading = false
          customerList({ name: query, page: 1, limit: 50 }).then(response => {
            this.companyOptions = response.items || []
          }).catch(() => {
            this.listLoading = false
          })
        }, 200)
      } else {
        this.companyOptions = []
      }
    },
    getuser_List() {
      this.listLoading = true
      getUser(this.ruleForm.company).then(response => {
        this.userOptions = response || []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    get_Tag() {
      this.listLoading = true
      getTag().then(response => {
        this.productoption = response || []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    get_Item() {
      this.listLoading = true
      getItem().then(response => {
        this.tree_data = JSON.parse(JSON.stringify(response)) || []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getCheckedNodes() {
      this.ruleForm.privilegeList = this.$refs.tree.getCheckedNodes().map(function(item, index, array) {
        return ({ privilegeItemId: item.id, value: item.defaultValue })
      })
    },
    handleReset() {
      this.toggleArray = [true, false, false, false, false]
      this.current = 0
      this.$refs.Form_customer.resetFields()
      this.$refs.Form_user.resetFields()
      this.ruleForm.privilegeTagId = ''
      this.ruleForm.type = ''
    },
    allChanges(cur) {
      this.toggleArray = this.toggleArray.map(function(item, index, array) {
        return (item = false)
      })
      this.current = cur
      this.toggleArray[cur] = true
    },
    contractSure(cur) {
      this.$refs.Form_contract.validate((valid) => {
        if (valid) {
          this.allChanges(cur)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    productSure(cur) {
      this.$refs.Form_privilegeTagId.validate((valid) => {
        if (valid) {
          this.allChanges(cur)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    companySure(cur) {
      this.$refs.Form_customer.validate((valid) => {
        if (valid) {
          this.allChanges(cur)
          this.getuser_List()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    userSure(cur) {
      this.$refs.Form_user.validate((valid) => {
        if (valid) {
          this.allChanges(cur)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    powerSure(cur) {
      this.allChanges(cur)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
.line-center {
  text-align: center;
  margin-left: -185px;
}
</style>

