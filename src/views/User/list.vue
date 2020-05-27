<template>
  <div class="app-container">
    <div class="filter-container">
      <sticky :sticky-top="60">
        <el-input
          v-model="listQuery.realName"
          clearable
          placeholder="请输入用户姓名"
          style="width: 350px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
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
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
      <el-table-column width="300px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="客户名">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="客户地址">
        <template slot-scope="scope">
          <span>{{ scope.row.companyAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column width="500px" align="center" label="客户列表">
        <template slot-scope="scope">
          <el-collapse v-model="activeName" accordion @change="handleChange">
            <el-collapse-item
              v-for="(item,index) in scope.row.customerList"
              :key="item.id"
              :title="item.name"
              :name="index"
            >
              <div class="side-left">
                <span>地址:{{ item.address }}</span>
                <div v-for="(order,number) in item.privilegeList" :key="number">
                  <el-divider content-position="left">
                    <span>{{ order.privilegeApplicationSubjectMajorId }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>产品:{{ order.privilegePackTagName }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>权限:{{ order.privilegePackName }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>定制:{{ order.customized == true ? '是' : '否' }}</span>
                  </el-divider>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="产品权限">
        <template slot-scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="!checkPermission(['salesadmin','admin'])"
            size="small"
            icon="el-icon-edit"
            style="margin-left:10px;"
            @click="handleDialog(scope.row)"
          >编辑</el-button>
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
    <el-dialog
      :title="'编辑-' +dialog_Data.realName || '用户'"
      :visible.sync="FormVisible"
      @close="handleClose"
    >
      <el-collapse v-model="activeForm" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <span>手机</span>
            <el-divider direction="vertical"></el-divider>
            <span>邮箱</span>
            <el-divider direction="vertical"></el-divider>
            <span>密码</span>
            <el-divider direction="vertical"></el-divider>
            <span>启用/禁用</span>
            <el-divider direction="vertical"></el-divider>
            <span>VIP</span>
          </template>
          <el-form ref="dialogMobile" :model="dialog_Data" :rules="rules" label-width="115px">
            <el-form-item label="手机号" :prop="test_email == true ? 'mobile': ''">
              <el-input
                ref="mobile"
                v-model="dialog_Data.mobile"
                type="text"
                maxlength="11"
                show-word-limit
                clearable
                placeholder="请输入手机号"
                @change="check_mobile"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                :disabled="!checkPermission(['salesadmin','admin'])"
                :loading="mobileLoading"
                type="success"
                size="small"
                @click="submitMobile('dialogMobile')"
              >保存手机号</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="dialogEmail" :model="dialog_Data" :rules="rules" label-width="115px">
            <el-form-item label="邮箱" :prop="test_mobile == true ? 'email': ''">
              <el-input
                ref="email"
                v-model="dialog_Data.email"
                clearable
                placeholder="请输入邮箱地址"
                @change="check_email"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                :disabled="!checkPermission(['salesadmin','admin'])"
                :loading="emailLoading"
                type="success"
                size="small"
                @click="submitEmail('dialogEmail')"
              >保存邮箱</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="dialogPassword" :model="Password_Data" :rules="rules" label-width="115px">
            <el-form-item label="密码" prop="password">
              <el-input
                ref="password"
                v-model="Password_Data.password"
                :type="password_Type"
                minlength="6"
                maxlength="16"
                clearable
                autocomplete="off"
                placeholder="请输入密码"
              ></el-input>
              <span class="show-pwd" @click="show_password">
                <svg-icon :icon-class="password_Type === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="checkPass">
              <el-input
                ref="checkPass"
                v-model="Password_Data.checkPass"
                :type="checkPass_Type"
                minlength="6"
                maxlength="16"
                clearable
                autocomplete="off"
                placeholder="请再次输入密码"
              ></el-input>
              <span class="show-pwd" @click="show_checkPass">
                <svg-icon :icon-class="checkPass_Type === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                :disabled="!checkPermission(['salesadmin','admin'])"
                :loading="passwordLoading"
                type="success"
                size="small"
                @click="submitPassword('dialogPassword')"
              >保存密码</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="dialogEnabled" :model="dialog_Data" :rules="rules" label-width="115px">
            <el-form-item label="启用/禁用" prop="enabled">
              <el-switch v-model="dialog_Data.enabled"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                :disabled="!checkPermission(['salesadmin','admin'])"
                :loading="enabledLoading"
                type="success"
                size="small"
                @click="submitEnable(dialog_Data.enabled, dialog_Data.id)"
              >保存</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="dialogisVip" :model="dialog_Data" :rules="rules" label-width="115px">
            <el-form-item label="VIP" prop="isVip">
              <el-switch v-model="dialog_Data.isVip"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                :disabled="!checkPermission(['salesadmin','admin'])"
                :loading="isVipLoading"
                type="success"
                size="small"
                @click="submitisVip(dialog_Data.isVip, dialog_Data.id)"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <span>真实姓名</span>
            <el-divider direction="vertical"></el-divider>
            <span>公司名</span>
            <el-divider direction="vertical"></el-divider>
            <span>公司地址</span>
            <el-divider direction="vertical"></el-divider>
            <span>职位</span>
            <el-divider direction="vertical"></el-divider>
            <span>省/市/地区</span>
          </template>
          <el-form ref="dialogForm" :model="dialog_Data" :rules="rules" label-width="115px">
            <el-form-item label="真实姓名" prop="realName">
              <el-input
                v-model="dialog_Data.realName"
                type="text"
                minlength="2"
                maxlength="16"
                show-word-limit
                clearable
                placeholder="请输入真实姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司名" prop="companyName">
              <el-input
                v-model="dialog_Data.companyName"
                type="text"
                clearable
                placeholder="请输入公司名"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input
                v-model="dialog_Data.companyAddress"
                type="text"
                clearable
                placeholder="请输入公司地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="dialog_Data.position" type="text" clearable placeholder="请输入职位"></el-input>
            </el-form-item>
            <el-form-item label="省/市/地区" prop="provinceCode">
              <el-select
                v-model="dialog_Data.provinceCode"
                class="filter-item"
                placeholder="请选择省/市/地区"
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button v-waves :loading="FormLoading" type="primary" @click="submitForm('dialogForm')">确认保存</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { fetchList, editUser, editMobile, editEmail, editPassword, editEnable, editisVip, getuserId } from '@/api/user/user'
import { getProvince } from '@/api/system/province'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'

export default {
  name: 'ListUser',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    var validate_password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.Password_Data.checkPass !== '') {
          this.$refs.dialogPassword.validateField('checkPass')
        }
        callback()
      }
    }
    var validate_checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.Password_Data.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validate_mobile = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: { mobile: '', realName: '', companyName: '', page: 1, limit: 20 },
      FormVisible: false,
      activeName: 0,
      activeForm: '2',
      dialog_Data: {},
      provinceList: [],
      test_mobile: true,
      test_email: true,
      password_Type: 'password',
      checkPass_Type: 'password',
      Password_Data: { password: '', checkPass: '' },
      rules: {
        password: [
          { required: true, min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validate_password, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validate_checkPass, trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: validate_mobile, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      },
      use_Data: {},
      mobileLoading: false,
      emailLoading: false,
      passwordLoading: false,
      enabledLoading: false,
      isVipLoading: false,
      FormLoading: false,
      tableHeight: window.innerHeight - 250
    }
  },
  watch: {

  },
  created() {
    this.getList()
    this.initial_province()
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
    getInfo(userId) {
      getuserId(userId).then(response => {
        this.dialog_Data = response || {}
      })
    },
    handleDialog(useData) {
      this.FormVisible = true
      this.use_Data = useData
      this.getInfo(useData.id)
    },
    handleClose() {
      this.use_Data = {}
      this.dialog_Data = {}
      this.$refs.dialogMobile.resetFields()
      this.$refs.dialogEmail.resetFields()
      this.$refs.dialogPassword.resetFields()
      this.$refs.dialogForm.resetFields()
      this.getList()
    },
    handleChange(val) {
      console.log(val)
    },
    initial_province() {
      getProvince().then(response => {
        this.provinceList = response || []
      })
    },
    show_password() {
      this.password_Type === 'password' ? this.password_Type = '' : this.password_Type = 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    show_checkPass() {
      this.checkPass_Type === 'password' ? this.checkPass_Type = '' : this.checkPass_Type = 'password'
      this.$nextTick(() => {
        this.$refs.checkPass.focus()
      })
    },
    check_mobile() {
      this.$nextTick(() => {
        (/^1[3456789]\d{9}$/.test(this.dialog_Data.mobile)) ? this.test_mobile = false : this.test_mobile = true
        if (this.test_mobile === false) this.$refs.dialogMobile.clearValidate('email')
      })
    },
    check_email() {
      this.$nextTick(() => {
        (/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.dialog_Data.email)) ? this.test_email = false : this.test_email = true
        if (this.test_email === false) this.$refs.dialogEmail.clearValidate('mobile')
      })
    },
    submitMobile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.use_Data.mobile !== this.dialog_Data.mobile) {
            this.mobileLoading = true
            editMobile({ 'mobile': this.dialog_Data.mobile }, this.dialog_Data.id).then(response => {
              this.mobileLoading = false
              this.$message({
                message: '操作成功 0.0',
                type: 'success'
              })
            }).catch(() => {
              this.mobileLoading = false
            })
          } else {
            this.$message({
              message: '手机号未改变，不能提交 0.0',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '操作失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.use_Data.email !== this.dialog_Data.email) {
            this.emailLoading = true
            editEmail({ 'email': this.dialog_Data.email }, this.dialog_Data.id).then(response => {
              this.emailLoading = false
              this.$message({
                message: '操作成功 0.0',
                type: 'success'
              })
            }).catch(() => {
              this.emailLoading = false
            })
          } else {
            this.$message({
              message: '邮箱未改变，不能提交 0.0',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '操作失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    submitPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.passwordLoading = true
          editPassword({ 'password': this.Password_Data.password }, this.dialog_Data.id).then(response => {
            this.passwordLoading = false
            this.$message({
              message: '操作成功 0.0',
              type: 'success'
            })
            this.Password_Data = { password: '', checkPass: '' }
            this.$nextTick(() => {
              this.$refs.dialogPassword.clearValidate('checkPass')
            })
          }).catch(() => {
            this.passwordLoading = false
          })
        } else {
          this.$message({
            message: '操作失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEnable(enabled, userId) {
      this.enabledLoading = true
      editEnable({ 'enabled': enabled }, userId).then(response => {
        this.enabledLoading = false
        this.$message({
          message: '操作成功 0.0',
          type: 'success'
        })
      }).catch(() => {
        this.enabledLoading = false
      })
    },
    submitisVip(isVip, userId) {
      this.isVipLoading = true
      editisVip({ 'isVip': isVip }, userId).then(response => {
        this.isVipLoading = false
        this.$message({
          message: '操作成功 0.0',
          type: 'success'
        })
      }).catch(() => {
        this.isVipLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const edit_data = { 'realName': this.dialog_Data.realName, 'companyName': this.dialog_Data.companyName, 'companyAddress': this.dialog_Data.companyAddress, 'position': this.dialog_Data.position, 'provinceCode': this.dialog_Data.provinceCode }
          this.FormLoading = true
          editUser(edit_data, this.dialog_Data.id).then(response => {
            this.FormLoading = false
            this.$message({
              message: '操作成功 0.0',
              type: 'success'
            })
          }).catch(() => {
            this.FormLoading = false
          })
        } else {
          this.$message({
            message: '操作失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.side-left {
  text-align: left;
  padding: 0 10px 0 10px;
}
.show-pwd {
  position: absolute;
  right: 30px;
  top: 2px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>

