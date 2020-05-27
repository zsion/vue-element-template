<template>
  <div class="app-container">
    <sticky :sticky-top="60">
      <el-input
        v-model="listQuery.companyName"
        clearable
        placeholder="请输入用客户名"
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
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handle_Dialog()">新增</el-button>
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
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>

      <el-table-column width="200px" align="center" label="客户名">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="活动批准状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activitiApproveStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="活动进程状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activitiProcessStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已审批">
        <template slot-scope="scope">
          <span>{{ scope.row.approved }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已完成">
        <template slot-scope="scope">
          <span>{{ scope.row.completed }}</span>
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

      <el-table-column width="100px" align="center" label="客户省描述">
        <template slot-scope="scope">
          <span>{{ scope.row.customerProvinceDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column width="270px" align="center" label="禁用时间">
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

      <el-table-column width="100px" align="center" label="转发列表">
        <template slot-scope="scope">
          <span>{{ scope.row.forwardList }}</span>
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

      <el-table-column width="150px" align="center" label="时间线">
        <template slot-scope="scope">
          <el-timeline class="timeline">
            <el-timeline-item v-for="item in scope.row.stepList" :key="item.index">
              {{ item }}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="主题id">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="主要主题id">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectMajorId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="已提交">
        <template slot-scope="scope">
          <span>{{ scope.row.submitted }}</span>
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
          <el-button type="info" size="small" icon="el-icon-info" @click="handle_Detail(scope.row.id)">详情</el-button>
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

    <el-dialog title="新增" :visible.sync="dialogVisible" @close="ClearAdd">
      <el-steps :active="current" align-center finish-status="success">
        <el-step :title="titleMap[0]"></el-step>
        <el-step :title="titleMap[1]"></el-step>
        <el-step :title="titleMap[2]"></el-step>
        <el-step :title="titleMap[3]"></el-step>
        <el-step :title="titleMap[4]"></el-step>
      </el-steps>
      <div v-show="toggleArray[0] === true">
        <el-form ref="Form_customer" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
          <el-form-item label="选择客户（企业）" prop="customerId">
            <el-select
              v-model="ruleForm.customerId"
              class="filter-item"
              filterable
              remote
              clearable
              placeholder="请输入并选择客户(企业)"
              style="width:350px;"
              :remote-method="getcustomerList"
              :loading="customerLoading"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="customerSure(1)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="toggleArray[1] === true">
        <el-form ref="Form_user" :model="ruleForm" :rules="rules" label-width="135px" style="margin:50px 0 0 50px;">
          <el-form-item label="选择用户" prop="userIdList">
            <el-select v-model="ruleForm.userIdList" multiple class="filter-item" placeholder="请选择用户" style="width:350px;">
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
          <el-form-item label="CRM合同编号" prop="contractFileNo">
            <el-input v-model="ruleForm.contractFileNo" clearable placeholder="请输入CRM合同编号" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="产品开通时间">
            <el-date-picker
              v-model="ruleForm.effectiveDate"
              type="date"
              placeholder="产品开通时间"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerStart"
            />
          </el-form-item>
          <el-form-item label="产品结束时间">
            <el-date-picker
              v-model="ruleForm.expirationDate"
              type="date"
              placeholder="产品结束时间"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerEnd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="contractSure(4)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="toggleArray[4] === true">
        <el-form ref="Form_power" :model="ruleForm" :rules="rules" label-width="57px" label-position="left" style="margin:50px 0 0 50px;">
          <el-tabs v-model="curr_tab" @tab-click="handleClick">
            <el-tab-pane v-for="item in tab_data" :key="item.id" :label="item.name" :name="item.name">
            </el-tab-pane>
          </el-tabs>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            :data="tree_data"
            node-key="code"
            show-checkbox
            default-expand-all
            :expand-on-click-node="false"
            @check-change="getCheckedNodes"
          >
            <span slot-scope="{ node, data }">
              <label>名称：</label><span>{{ data.name }}</span><el-divider direction="vertical"></el-divider>
              <!-- <label>默认值：</label><span>{{ data.defaultValue }}</span><el-divider direction="vertical"></el-divider> -->
              <label>默认值：</label><el-input v-model="data.defaultValue" :disabled="data.disabled" size="mini" clearable placeholder="请输入数字" style="width:175px;" />
            </span>
          </el-tree>
          <el-form-item>
            <el-button :loading="submitLoading" type="primary" @click="powerSure(5)">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="line-center">
        <el-button @click="handleReset()">重置</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogEdit" @close="ClearEdit">
      <el-form ref="Form_edit" :model="edit_Form" :rules="rules" label-width="135px">
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
          <el-tabs v-model="curr_tab_edit" @tab-click="handleClickEdit">
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

    <el-dialog title="详情" :visible.sync="dialogDetail" @close="ClearInfo">
      <el-tabs v-model="activeInfo" @tab-click="handleTabInfo">
        <el-tab-pane label="主表详情" name="first">
          <el-card class="box-card">
            <el-row class="text item">
              <label>操作：</label>
              <span v-if="detailData.locked === false">
                <el-button type="primary" round size="small" icon="el-icon-edit" @click="handle_Edit(detailData)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
              </span>
              <span v-if="detailData.enabled === true">
                <el-button type="warning" round size="small" icon="el-icon-lock" @click="handle_Disable(detailData.id)">废弃</el-button>
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-button type="success" round size="small" icon="el-icon-circle-plus-outline" @click="handle_Dialog(detailData.id)">新增子表</el-button>
            </el-row>
            <el-row class="text item">
              <label>活动批准状态：</label><span>{{ detailData.activitiApproveStatus }}</span>
            </el-row>
            <el-row class="text item">
              <label>活动进程状态：</label><span>{{ detailData.activitiProcessStatus }}</span>
            </el-row>
            <el-row class="text item">
              <label>条件：</label><span>{{ detailData.condition }}</span>
            </el-row>
            <el-row class="text item">
              <label>合同编号：</label><span>{{ detailData.contractFileNo }}</span>
            </el-row>
            <el-row class="text item">
              <label>客户名：</label><span>{{ detailData.customerName }}</span>
            </el-row>
            <el-row class="text item">
              <label>省/市：</label><span>{{ detailData.customerProvinceDescription }}</span>
            </el-row>
            <el-row class="text item">
              <label>禁用时间：</label><span>{{ detailData.disableTime }}</span>
            </el-row>
            <el-row class="text item">
              <label>生效日期：</label><span>{{ detailData.effectiveDate }}</span>
            </el-row>
            <el-row class="text item">
              <label>到期：</label><span>{{ detailData.expirationDate }}</span>
            </el-row>
            <el-row class="text item">
              <label>启用：</label>
              <i v-if="detailData.enabled === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
              <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
            </el-row>
            <el-row class="text item">
              <label>是主表：</label>
              <i v-if="detailData.isMajor === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
              <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
            </el-row>
            <el-row class="text item">
              <label>是否锁定：</label>
              <i v-if="detailData.locked === true" class="el-icon-success" style="color:#67C23A;"> 是</i>
              <i v-else class="el-icon-error" style="color:#909399;"> 否</i>
            </el-row>
            <el-row class="text item">
              <label>权限包名称：</label><span>{{ detailData.privilegePackName }}</span>
            </el-row>
            <el-row class="text item">
              <label>权限包标记名称：</label><span>{{ detailData.privilegePackTagName }}</span>
            </el-row>
            <el-row class="text item">
              <label>提交人Crm部门名称：</label><span>{{ detailData.submitterCrmDepartmentName }}</span>
            </el-row>
            <el-row class="text item">
              <label>提交人Crm真实姓名：</label><span>{{ detailData.submitterCrmRealName }}</span>
            </el-row>
            <el-row class="text item">
              <label>提交人真实姓名：</label><span>{{ detailData.submitterRealName }}</span>
            </el-row>
            <el-row class="text item">
              <label>版本：</label><span>{{ detailData.version }}</span>
            </el-row>
            <el-row class="text item">
              <label>用户列表：</label>
              <el-table :data="detailData.userList">
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
        </el-tab-pane>
        <el-tab-pane label="子表详情" name="second">
          <el-card class="box-card">
            <el-table
              v-loading="childLoading"
              :data="subData"
              border
              fit
              highlight-current-row
              style="width: 100%;margin-top:20px;"
            >
              <template slot="empty">
                暂无数据 0.0
              </template>
              <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
              <el-table-column width="120px" align="center" label="活动批准状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.activitiApproveStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="活动进程状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.activitiProcessStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="条件">
                <template slot-scope="scope">
                  <span>{{ scope.row.condition }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="合同编号">
                <template slot-scope="scope">
                  <span>{{ scope.row.contractFileNo }}</span>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="客户名">
                <template slot-scope="scope">
                  <span>{{ scope.row.customerName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="省/市">
                <template slot-scope="scope">
                  <span>{{ scope.row.customerProvinceDescription }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="禁用时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.disableTime }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="生效日期">
                <template slot-scope="scope">
                  <span>{{ scope.row.effectiveDate }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="到期">
                <template slot-scope="scope">
                  <span>{{ scope.row.expirationDate }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="启用">
                <template slot-scope="scope">
                  <span>{{ scope.row.enabled }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="是主表">
                <template slot-scope="scope">
                  <span>{{ scope.row.isMajor }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="是否锁定">
                <template slot-scope="scope">
                  <span>{{ scope.row.locked }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="权限包名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.privilegePackName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="权限包标记名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.privilegePackTagName }}</span>
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
              <el-table-column width="120px" align="center" label="提交人真实姓名">
                <template slot-scope="scope">
                  <span>{{ scope.row.submitterRealName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="用户列表">
                <template slot-scope="scope">
                  <span>{{ scope.row.userList }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="版本">
                <template slot-scope="scope">
                  <span>{{ scope.row.version }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="third">
          <el-card class="box-card">
            <el-table
              v-loading="historyLoading"
              :data="historyData"
              border
              fit
              highlight-current-row
              style="width: 100%;margin-top:20px;"
            >
              <template slot="empty">
                暂无数据 0.0
              </template>
              <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
              <el-table-column width="100px" align="center" label="主表ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.subjectMajorId }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="活动批准状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.activitiApproveStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="活动进程状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.activitiProcessStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="条件">
                <template slot-scope="scope">
                  <span>{{ scope.row.condition }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="合同编号">
                <template slot-scope="scope">
                  <span>{{ scope.row.contractFileNo }}</span>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="客户名">
                <template slot-scope="scope">
                  <span>{{ scope.row.customerName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="省/市">
                <template slot-scope="scope">
                  <span>{{ scope.row.customerProvinceDescription }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="禁用时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.disableTime }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="生效日期">
                <template slot-scope="scope">
                  <span>{{ scope.row.effectiveDate }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="到期">
                <template slot-scope="scope">
                  <span>{{ scope.row.expirationDate }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="启用">
                <template slot-scope="scope">
                  <span>{{ scope.row.enabled }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="权限包名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.privilegePackName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="权限包标记名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.privilegePackTagName }}</span>
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
              <el-table-column width="120px" align="center" label="提交人真实姓名">
                <template slot-scope="scope">
                  <span>{{ scope.row.submitterRealName }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="用户列表">
                <template slot-scope="scope">
                  <span v-if="scope.row.userList === null">无</span>
                  <el-button v-if="scope.row.userList !== null" type="info" size="small" icon="el-icon-user" @click="handle_userList(scope.row.userList)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="版本">
                <template slot-scope="scope">
                  <span>{{ scope.row.version }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="用户列表" :visible.sync="dialogUserList">
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

  </div>
</template>

<script>
import { searchMajor, createSubject, getSubjectId, editSubject, getsubsubject, getHistory } from '@/api/PrivilegeApplicationSubject/index'
import { getDisable } from '@/api/PrivilegeApplication/index'
import { customerList } from '@/api/user/user'
import { getUser } from '@/api/customeruser/index'
import { getTag } from '@/api/Privilege/index'
import { getItem } from '@/api/PrivilegeItem/index'
import { getPack, getPackId } from '@/api/PrivilegePack/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Sticky from '@/components/Sticky'

export default {
  name: 'ListApply',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        companyName: '',
        page: 1,
        limit: 20
      },
      tableHeight: window.innerHeight - 250,
      dialogVisible: false,
      titleMap: ['选择客户（企业）', '选择用户', '选择产品', '合同信息', '新增产品权限'],
      toggleArray: [true, false, false, false, false],
      current: 0,
      tab_data: [],
      treeLoading: false,
      tree_data: [],
      submitLoading: false,
      customerLoading: false,
      ruleForm: {
        majorId: 0,
        customerId: '',
        userIdList: [],
        privilegeTagId: '',
        type: '',
        contractFileNo: '',
        effectiveDate: '',
        expirationDate: '',
        privilegePackId: 0,
        privilegeList: []
      },
      pickerStart: {
        disabledDate: time => {
          if (this.ruleForm.expirationDate) {
            return time.getTime() > new Date(this.ruleForm.expirationDate).getTime()
          }
        }
      },
      pickerEnd: {
        disabledDate: time => {
          if (this.ruleForm.effectiveDate) {
            return time.getTime() < new Date(this.ruleForm.effectiveDate).getTime()
          }
        }
      },
      customerOptions: [],
      userOptions: [],
      productOption: [],
      rules: {
        customerId: [
          { required: true, message: '请选择客户（企业）', trigger: ['blur', 'change'] }
        ],
        userIdList: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        privilegeTagId: [
          { required: true, message: '请选择产品', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择正式/试用', trigger: 'change' }
        ]
      },
      curr_tab: '自定义',
      dialogEdit: false,
      userOptionsEdit: [],
      curr_tab_edit: '自定义',
      tab_data_edit: [],
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
      dialogDetail: false,
      historyLoading: false,
      historyData: null,
      detailData: {},
      childLoading: false,
      subData: null,
      activeInfo: 'first',
      dialogUserList: false,
      userListData: null
    }
  },
  watch: {

  },
  created() {
    this.getList()
    this.get_Tag()
    this.get_Item()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.listLoading = true
      searchMajor(this.listQuery).then(response => {
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
        this.customerLoading = true
        setTimeout(() => {
          customerList({ name: query, page: 1, limit: 50 }).then(response => {
            this.customerLoading = false
            this.customerOptions = response.items || []
          }).catch(() => {
            this.customerLoading = false
          })
        }, 200)
      } else {
        this.customerOptions = []
      }
    },
    getuser_List() {
      getUser(this.ruleForm.customerId).then(response => {
        this.userOptions = response || []
      })
    },
    get_Tag() {
      getTag().then(response => {
        this.productoption = response || []
      })
    },
    get_Item() {
      this.treeLoading = true
      getItem().then(response => {
        this.treeLoading = false
        this.filted_Data_Optional(response)
        this.filted_Edit_Optional(response)
      }).catch(() => {
        this.treeLoading = false
      })
    },
    get_PackId(privilegePackId) {
      this.treeLoading = true
      getPackId(privilegePackId).then(response => {
        this.$refs.tree.setCheckedNodes(response.privilegeList)
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },
    get_PrivilegePack(privilegeTagId) {
      getPack(privilegeTagId).then(response => {
        response.push({
          available: true,
          editable: true,
          id: 0,
          name: '自定义',
          privilegeTagId: privilegeTagId
        })
        this.tab_data = response || []
      })
    },
    getCheckedNodes() {
      this.ruleForm.privilegeList = this.$refs.tree.getCheckedNodes().map(function(item, index, array) {
        return ({ privilegeItemId: item.id, value: item.defaultValue })
      })
    },
    ClearAdd() {
      this.handleReset()
      this.getList()
    },
    handleReset() {
      this.toggleArray = [true, false, false, false, false]
      this.current = 0
      this.$refs.Form_customer.resetFields()
      this.customerOptions = []
      this.$refs.Form_user.resetFields()
      this.ruleForm.privilegeTagId = ''
      this.ruleForm.type = ''
      this.ruleForm.contractFileNo = ''
      this.ruleForm.effectiveDate = ''
      this.ruleForm.expirationDate = ''
      this.ruleForm.majorId = 0
      this.curr_tab = '自定义'
      this.filted_Data_Optional(this.tree_data)
    },
    allChanges(cur) {
      this.toggleArray = this.toggleArray.map(function(item, index, array) {
        return (item = false)
      })
      this.current = cur
      this.toggleArray[cur] = true
      if (cur === 2) {
        this.$nextTick(() => {
          this.$refs.Form_privilegeTagId.clearValidate('privilegeTagId')
          this.$refs.Form_privilegeTagId.clearValidate('type')
        })
      }
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
          this.get_PrivilegePack(this.ruleForm.privilegeTagId)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    customerSure(cur) {
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
      this.$refs.Form_power.validate((valid) => {
        if (valid) {
          const createQuery = {}
          createQuery.majorId = this.ruleForm.majorId
          createQuery.customerId = this.ruleForm.customerId
          createQuery.contractFileNo = this.ruleForm.contractFileNo
          createQuery.effectiveDate = this.ruleForm.effectiveDate
          createQuery.expirationDate = this.ruleForm.expirationDate
          createQuery.privilegePackId = this.ruleForm.privilegePackId
          createQuery.userIdList = this.ruleForm.userIdList
          createQuery.privilegeList = this.ruleForm.privilegeList
          this.submitLoading = true
          createSubject(createQuery).then(response => {
            this.dialogVisible = false
            this.submitLoading = false
            this.$message({
              message: '已提交 0.0',
              type: 'success'
            })
            this.getList()
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    filted_Data(datas) {
      for (var i in datas) {
        datas[i].disabled = true
        if (datas[i].children) {
          this.filted_Data(datas[i].children)
        }
      }
      this.tree_data = JSON.parse(JSON.stringify(datas)) || []
    },
    filted_Data_Optional(datas) {
      for (var i in datas) {
        datas[i].disabled = false
        if (datas[i].children) {
          this.filted_Data_Optional(datas[i].children)
        }
      }
      this.tree_data = JSON.parse(JSON.stringify(datas)) || []
    },
    handleClick(tab, event) {
      this.ruleForm.privilegePackId = this.tab_data[tab.index].id
      if (this.tab_data[tab.index].id !== 0) {
        this.get_PackId(this.tab_data[tab.index].id)
        this.filted_Data(this.tree_data)
      } else {
        this.filted_Data_Optional(this.tree_data)
      }
    },
    handle_Dialog(majorId) {
      majorId !== undefined ? this.ruleForm.majorId = majorId : 0
      this.dialogVisible = true
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
        this.$refs.treeEdit.setCheckedNodes(response.privilegeList)
      })
    },
    get_PrivilegePack_Edit(privilegeTagId) {
      getPack(privilegeTagId).then(response => {
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
    ClearEdit() {
      this.$refs.Form_edit.resetFields()
    },
    handle_Edit(useData) {
      this.dialogEdit = true
      this.$nextTick(() => {
        getSubjectId(useData.id).then(response => {
          this.edit_Form.contractFileNo = response.contractFileNo
          this.edit_Form.effectiveDate = response.effectiveDate
          this.edit_Form.expirationDate = response.expirationDate
          this.getuser_EditList(response.customerId, response.userList)
          this.get_PrivilegePack_Edit(response.privilegePackTagId)
          this.edit_Form.privilegePackId = response.privilegePackId
          this.curr_tab_edit = response.privilegePackName || '自定义'
          if (response.privilegePackPrivilegeList !== null) this.$refs.treeEdit.setCheckedNodes(response.privilegePackPrivilegeList)
        })
      })
    },
    submit_Edit() {
      this.$refs.Form_edit.validate((valid) => {
        if (valid) {
          const editQuery = {}
          editQuery.contractFileNo = this.edit_Form.contractFileNo
          editQuery.effectiveDate = this.edit_Form.effectiveDate
          editQuery.expirationDate = this.edit_Form.expirationDate
          editQuery.privilegePackId = this.edit_Form.privilegePackId
          editQuery.userIdList = this.edit_Form.userIdList
          editQuery.privilegeList = this.edit_Form.privilegeList
          this.editLoading = true
          editSubject(editQuery, editQuery.privilegePackId).then(response => {
            this.editLoading = false
            this.dialogEdit = false
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
    get_History(privilegeApplicationSubjectId) {
      this.historyLoading = true
      getHistory(privilegeApplicationSubjectId).then(response => {
        this.historyLoading = false
        this.historyData = response
      }).catch(() => {
        this.historyLoading = false
      })
    },
    handle_Detail(privilegeApplicationSubjectId) {
      this.dialogDetail = true
      this.get_History(privilegeApplicationSubjectId)
      getSubjectId(privilegeApplicationSubjectId).then(response => {
        this.detailData = response
      })
      this.childLoading = true
      getsubsubject(privilegeApplicationSubjectId).then(response => {
        this.childLoading = false
        this.subData = response
      })
    },
    ClearInfo() {
      this.getList()
    },
    handleTabInfo(tab, event) {

    },
    handle_userList(listData) {
      this.dialogUserList = true
      this.userListData = listData
    },
    handle_Disable(privilegeApplicationId) {
      getDisable({}, privilegeApplicationId).then(response => {
        this.dialogDetail = false
        this.getList()
        this.$message({
          message: '禁用成功 0.0',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.line-center {
  text-align: center;
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

