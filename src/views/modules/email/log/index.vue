<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="邮箱账户" prop="accountEmail">
        <el-input
          v-model="queryParams.accountEmail"
          placeholder="请输入邮箱账户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮件标题" prop="tempId">
        <el-input
          v-model="queryParams.tempId"
          placeholder="请输入邮件标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item><!--
      <el-form-item label="收件人组" prop="groupId">
        <el-input
          v-model="queryParams.groupId"
          placeholder="请输入收件人组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="成功标志" prop="sendStatus">
        <el-select v-model="queryParams.sendStatus" placeholder="请选择发送成功标志" clearable size="small">
          <el-option label="已完成" value="1" />
          <el-option label="执行中" value="2" />
          <el-option label="任务异常" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常消息" prop="errorMessage">
        <el-input
          v-model="queryParams.errorMessage"
          placeholder="请输入异常消息"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
<!--
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="邮箱账户" align="center" prop="accountEmail" />
      <el-table-column label="邮件标题" align="center" prop="emailTemp.subject" />
<!--      <el-table-column label="关联草稿邮件" align="center" prop="tempId" />-->
      <el-table-column label="收件人组" align="center" prop="groupId" />
     <!-- <el-table-column label="收件人" align="center" prop="sendList" />-->
      <el-table-column label="发送成功的收件人" align="center" prop="successList" />
      <el-table-column label="发送失败的收件人" align="center" prop="wornList" />
      <el-table-column label="状态" align="center" prop="sendStatusName" />
      <el-table-column label="报错异常消息" align="center" prop="errorMessage" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

    <!-- 添加或修改邮件发送记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邮箱账户" prop="accountEmail">
          <el-input v-model="form.accountEmail" placeholder="请输入邮箱账户" />
        </el-form-item>
       <!-- <el-form-item label="关联草稿邮件" prop="tempId">
          <el-input v-model="form.tempId" placeholder="请输入关联草稿邮件" />
        </el-form-item>-->
        <el-form-item label="收件人组" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入收件人组" />
        </el-form-item>
       <!-- <el-form-item label="收件人" prop="sendList">
          <el-input v-model="form.sendList" type="textarea" placeholder="请输入内容" />
        </el-form-item>-->
        <el-form-item label="发送成功的收件人" prop="successList">
          <el-input v-model="form.successList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发送失败的收件人" prop="wornList">
          <el-input v-model="form.wornList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发送成功标志，1完成，2执行中，3任务异常">
          <el-radio-group v-model="form.sendStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报错异常消息" prop="errorMessage">
          <el-input v-model="form.errorMessage" placeholder="请输入报错异常消息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog, delLog, addLog, updateLog, exportLog } from "@/api/email/log";

export default {
  name: "Log",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 邮件发送记录表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountEmail: null,
        tempId: null,
        groupId: null,
        sendList: null,
        successList: null,
        wornList: null,
        sendStatus: "1",
        errorMessage: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
       /* accountEmail: [
          { required: true, message: "邮箱账户不能为空", trigger: "blur" }
        ],
        tempId: [
          { required: true, message: "关联草稿邮件不能为空", trigger: "blur" }
        ],
        sendStatus: [
          { required: true, message: "发送成功标志，1完成，2执行中，3任务异常不能为空", trigger: "blur" }
        ],*/
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邮件发送记录列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(({data}) => {
          if (data!== null && data.code === 200) {
              this.logList = data.rows;
              this.total = data.total;
              console.log(data)
              console.log(this.total)
          } else {
              this.$message.error(data.msg);
          }
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        accountEmail: null,
        tempId: null,
        groupId: null,
        sendList: null,
        successList: null,
        wornList: null,
        sendStatus: 0,
        errorMessage: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加邮件发送记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改邮件发送记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLog(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除邮件发送记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
      // 每页数
      sizeChangeHandle(val) {
          this.pageSize = val
          this.pageIndex = 1
          this.getList()
      },
      // 当前页
      currentChangeHandle(val) {
          this.queryParams.pageNum = val
          this.getList()
      },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有邮件发送记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLog(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
