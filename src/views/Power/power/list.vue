<template>
  <div class="app-container">
    <el-tree
      v-loading="listLoading"
      :data="tree_data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }">
        <label>名称：</label><span class="bg">{{ data.name }}</span><el-divider direction="vertical"></el-divider>
        <label>产品：</label><span v-for="item in data.privilegeTagList" :key="item.id" class="bg">{{ item.name }}</span><el-divider direction="vertical"></el-divider>
        <label>默认值：</label><span class="bg">{{ data.defaultValue.value }}</span><el-divider direction="vertical"></el-divider>
        <label>匿名值：</label><span class="bg">{{ data.anonymousValue.value }}</span><el-divider direction="vertical"></el-divider>
        <span>
          <el-button
            type="primary"
            :disabled="!checkPermission(['admin'])"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="() => append(data)"
          >
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确定删除吗？" @onConfirm="() => remove(node, data)">
            <el-button
              slot="reference"
              type="danger"
              :disabled="!checkPermission(['admin'])"
              :loading="removeLoading"
              size="mini"
              icon="el-icon-delete"
            >
            </el-button>
          </el-popconfirm>
        </span>
      </span>
    </el-tree>
    <el-dialog title="查看用户" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品" prop="product">
          <el-select v-model="form.product" multiple clearable placeholder="请选择产品" style="width:50%;">
            <el-option
              v-for="item in productoption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父级id" prop="parentId">
          <el-input v-model="form.parentId" clearable placeholder="请输入父级id" />
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="form.code" clearable placeholder="请输入code" />
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" clearable placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="form.defaultValue" clearable placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="匿名值" prop="anonymousValue">
          <el-input v-model="form.anonymousValue" clearable placeholder="请输入匿名值" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="onSubmit('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getTag } from '@/api/Privilege/index'
import { getItem, addItem, deleteItem } from '@/api/PrivilegeItem/index'
export default {
  data() {
    var validate_number = (rule, value, callback) => {
      if (!(/^(-|\+)?\d+$/.test(value))) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      tree_data: [],
      listLoading: false,
      productoption: [],
      form: {
        product: [],
        parentId: '',
        code: '',
        name: '',
        defaultValue: '',
        anonymousValue: ''
      },
      rules: {
        product: [
          { required: true, message: '请选择产品', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入父级id', trigger: 'blur' },
          { validator: validate_number, trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入code', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        defaultValue: [
          { required: true, message: '请输入默认值', trigger: 'blur' },
          { validator: validate_number, trigger: ['blur', 'change'] }
        ],
        anonymousValue: [
          { required: true, message: '请输入匿名值', trigger: 'blur' },
          { validator: validate_number, trigger: ['blur', 'change'] }
        ]
      },
      dialogFormVisible: false,
      add_data: null,
      submitLoading: false,
      removeLoading: false
    }
  },
  created() {
    this.get_Tag()
    this.get_Item()
  },
  methods: {
    checkPermission,
    get_Tag() {
      getTag().then(response => {
        this.productoption = response || []
      })
    },
    get_Item() {
      this.listLoading = true
      getItem().then(response => {
        this.listLoading = false
        this.tree_data = JSON.parse(JSON.stringify(response)) || []
      }).catch(() => {
        this.listLoading = false
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newChild = { parentId: this.form.parentId, code: this.form.code, name: this.form.name, anonymousValue: this.form.anonymousValue, defaultValue: this.form.defaultValue, privilegeTagIdList: this.form.product }
          this.submitLoading = true
          addItem(newChild).then(response => {
            if (!this.add_data.children) {
              this.$set(this.add_data, 'children', [])
            }
            this.add_data.children.push(newChild)
            this.submitLoading = false
            this.$message({
              message: '追加成功 0.0',
              type: 'success'
            })
          }).catch(() => {
            this.submitLoading = false
          })
          this.resetForm('form')
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '追加失败 0.0',
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$refs.form.resetFields()
    },
    append(data) {
      this.dialogFormVisible = true
      this.add_data = data
      this.form.parentId = data.parentId
    },
    remove(node, data) {
      const privilegeItemId = data.id
      this.removeLoading = true
      deleteItem(privilegeItemId).then(response => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
        this.removeLoading = false
        this.$message({
          message: '删除成功 0.0',
          type: 'success'
        })
      }).catch(() => {
        this.removeLoading = false
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.bg{
  padding:7px 15px 7px 15px;
  border-radius: 5px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, .12), 0 0 7px rgba(0, 0, 0, .05);
}
</style>

