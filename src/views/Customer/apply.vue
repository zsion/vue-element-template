<template>
  <div class="app-container">
    <div class="filter-container">
      <sticky :sticky-top="60">
        <el-checkbox v-model="completed" label="仅查看未处理" border @change="handle_Filter"></el-checkbox>
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

      <el-table-column width="100px" align="center" label="审批人ID">
        <template slot-scope="scope">
          <span>{{ scope.row.approverId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="审批人真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.approverRealName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="邮编">
        <template slot-scope="scope">
          <span>{{ scope.row.cityCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <i v-if="scope.row.completed === true" class="el-icon-success" style="color:#67C23A;"> 已处理</i>
          <i v-else class="el-icon-error" style="color:#909399;"> 未处理</i>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="国家代码">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="国家名称">
        <template slot-scope="scope">
          <span>{{ scope.row.countryName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="地区代码">
        <template slot-scope="scope">
          <span>{{ scope.row.districtCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="地区名称">
        <template slot-scope="scope">
          <span>{{ scope.row.districtName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="行业">
        <template slot-scope="scope">
          <span>{{ scope.row.industry }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="名字">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="省代码">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="省名称">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="职位">
        <template slot-scope="scope">
          <span>{{ scope.row.userPosition }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="用户真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userRealName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="详情" fixed="right">
        <template slot-scope="scope">
          <el-button type="info" size="small" icon="el-icon-info" @click="handle_Dialog(scope.row)">
            详情
          </el-button>
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

    <el-dialog title="详情" :visible.sync="dialogFormVisible" @close="ClearState">
      <el-card class="box-card">
        <el-row class="text item">
          <label>操作：</label>
          <span v-if="detail_data.completed">
            <i class="el-icon-success" style="color:#67C23A;"> 已处理</i>
          </span>
          <span v-else>
            <el-button type="warning" :loading="AbandonLoading" size="small" icon="el-icon-circle-close" @click="handle_Abandon(scope.row.id)">
              放弃
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" :loading="CompleteLoading" size="small" icon="el-icon-circle-check" @click="handle_Complete(scope.row.id)">
              处理
            </el-button>
          </span>
        </el-row>
        <el-row class="text item">
          <label>审批人ID：</label><span>{{ detail_data.approverId }}</span>
        </el-row>
        <el-row class="text item">
          <label>审批人真实姓名：</label><span>{{ detail_data.approverRealName }}</span>
        </el-row>
        <el-row class="text item">
          <label>邮编：</label><span>{{ detail_data.cityCode }}</span>
        </el-row>
        <el-row class="text item">
          <label>城市：</label><span>{{ detail_data.cityName }}</span>
        </el-row>
        <el-row class="text item">
          <label>状态：</label><span>
            <i v-show="detail_data.completed === true" class="el-icon-success" style="color:#67C23A;"> 已处理</i>
            <i v-show="detail_data.completed === false" class="el-icon-error" style="color:#909399;"> 未处理</i>
          </span>
        </el-row>
        <el-row class="text item">
          <label>国家代码：</label><span>{{ detail_data.countryCode }}</span>
        </el-row>
        <el-row class="text item">
          <label>国家名称：</label><span>{{ detail_data.countryName }}</span>
        </el-row>
        <el-row class="text item">
          <label>地区代码：</label><span>{{ detail_data.districtCode }}</span>
        </el-row>
        <el-row class="text item">
          <label>地区名称：</label><span>{{ detail_data.districtName }}</span>
        </el-row>
        <el-row class="text item">
          <label>行业：</label><span>{{ detail_data.industry }}</span>
        </el-row>
        <el-row class="text item">
          <label>名字：</label><span>{{ detail_data.name }}</span>
        </el-row>
        <el-row class="text item">
          <label>省代码：</label><span>{{ detail_data.provinceCode }}</span>
        </el-row>
        <el-row class="text item">
          <label>省名称：</label><span>{{ detail_data.provinceName }}</span>
        </el-row>
        <el-row class="text item">
          <label>提交时间：</label><span>{{ detail_data.submitTime }}</span>
        </el-row>
        <el-row class="text item">
          <label>用户ID：</label><span>{{ detail_data.userId }}</span>
        </el-row>
        <el-row class="text item">
          <label>职位：</label><span>{{ detail_data.userPosition }}</span>
        </el-row>
        <el-row class="text item">
          <label>用户真实姓名：</label><span>{{ detail_data.userRealName }}</span>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { quick_Search, do_complete, do_abandon } from '@/api/customerapplication/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'

export default {
  name: 'ApplyCustomer',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        completed: null,
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      detail_data: {},
      completed: false,
      AbandonLoading: false,
      CompleteLoading: false,
      tableHeight: window.innerHeight - 250
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      quick_Search(this.listQuery).then(response => {
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
    handle_Filter() {
      this.completed === true ? this.listQuery.completed = false : this.listQuery.completed = null
      this.handleFilter()
    },
    handle_Complete(customerApplicationId) {
      this.dialogFormVisible = false
      this.CompleteLoading = true
      do_complete({}, customerApplicationId).then(response => {
        this.CompleteLoading = false
        this.$message({
          type: 'success',
          message: '处理成功 0.0'
        })
        this.getList()
      }).catch(() => {
        this.CompleteLoading = false
      })
    },
    handle_Abandon(customerApplicationId) {
      this.dialogFormVisible = false
      this.AbandonLoading = true
      do_abandon({}, customerApplicationId).then(response => {
        this.AbandonLoading = false
        this.$message({
          type: 'success',
          message: '已放弃 0.0'
        })
        this.getList()
      }).catch(() => {
        this.AbandonLoading = false
      })
    },
    handle_Dialog(row_data) {
      this.dialogFormVisible = true
      this.detail_data = row_data
    },
    ClearState() {
      this.detail_data = {}
      this.getList()
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
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
</style>

