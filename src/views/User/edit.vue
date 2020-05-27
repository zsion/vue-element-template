<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="115px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="ruleForm.username"
          type="text"
          minlength="2"
          maxlength="16"
          show-word-limit
          clearable
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          ref="password"
          v-model="ruleForm.password"
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
          v-model="ruleForm.checkPass"
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
      <el-form-item label="手机号" :prop="test_email == true ? 'mobile': ''">
        <el-input
          ref="mobile"
          v-model="ruleForm.mobile"
          type="text"
          maxlength="11"
          show-word-limit
          clearable
          placeholder="请输入手机号"
          @change="check_mobile"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :prop="test_mobile == true ? 'email': ''">
        <el-input
          ref="email"
          v-model="ruleForm.email"
          clearable
          placeholder="请输入邮箱地址"
          @change="check_email"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="ruleForm.realName"
          type="text"
          minlength="2"
          maxlength="16"
          show-word-limit
          clearable
          placeholder="请输入真实姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="公司名" prop="companyName">
        <el-input v-model="ruleForm.companyName" type="text" clearable placeholder="请输入公司名"></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="companyAddress">
        <el-input v-model="ruleForm.companyAddress" type="text" clearable placeholder="请输入公司地址"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input v-model="ruleForm.position" type="text" clearable placeholder="请输入职位"></el-input>
      </el-form-item>
      <el-form-item label="省/市/地区" prop="provinceCode">
        <el-select v-model="ruleForm.provinceCode" class="filter-item" placeholder="请选择省/市/地区">
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enabled">
        <el-switch v-model="ruleForm.enabled"></el-switch>
      </el-form-item>
      <el-form-item label="VIP" prop="isVip">
        <el-switch v-model="ruleForm.isVip"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          v-waves
          :disabled="!checkPermission(['salesadmin','admin'])"
          :loading="submitLoading"
          type="primary"
          @click="submitForm('ruleForm')"
        >确认创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getProvince } from '@/api/system/province'
import { registerUser } from '@/api/user/user'
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  data() {
    var validate_password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validate_checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
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
      test_mobile: true,
      test_email: true,
      password_Type: 'password',
      checkPass_Type: 'password',
      provinceList: [],
      submitLoading: false,
      ruleForm: {
        username: '',
        password: '',
        checkPass: '',
        mobile: '',
        email: '',
        realName: '',
        companyName: '',
        companyAddress: '',
        position: '',
        provinceCode: '',
        enabled: true,
        isVip: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validate_password, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validate_checkPass, trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, min: 11, max: 11, message: '请输入手机号', trigger: 'blur' },
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
      }
    }
  },
  created() {
    this.initial_province()
  },
  methods: {
    checkPermission,
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
        (/^1[3456789]\d{9}$/.test(this.ruleForm.mobile)) ? this.test_mobile = false : this.test_mobile = true
        if (this.test_mobile === false) this.$refs.ruleForm.clearValidate('email')
      })
    },
    check_email() {
      this.$nextTick(() => {
        (/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.ruleForm.email)) ? this.test_email = false : this.test_email = true
        if (this.test_email === false) this.$refs.ruleForm.clearValidate('mobile')
      })
    },
    initial_province() {
      getProvince().then(response => {
        this.provinceList = response || []
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          registerUser(this.ruleForm).then(response => {
            this.submitLoading = false
            this.$message({
              message: '操作成功 0.0',
              type: 'success'
            })
            this.resetForm('ruleForm')
          }).catch(() => {
            this.submitLoading = false
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.test_mobile = true
      this.test_email = true
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
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

