<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="广告名称" prop="adName">
        <el-input
          v-model="queryParams.adName"
          placeholder="请输入广告名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="广告描述" prop="adDesc">
        <el-input
          v-model="queryParams.adDesc"
          placeholder="请输入广告描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="广告链接" prop="adUrl">
        <el-input
          v-model="queryParams.adUrl"
          placeholder="请输入广告链接"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="跳转类型" prop="directType">
        <el-select v-model="queryParams.directType" placeholder="请选择跳转类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="广告类型" prop="adType">
        <el-select v-model="queryParams.adType" placeholder="请选择广告类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="isAuth('lit:advertisement:add')"
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
          v-if="isAuth('lit:advertisement:edit')"
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
          v-if="isAuth('lit:advertisement:remove')"
        >删除</el-button>
      </el-col>
    <!--  <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-if="isAuth('system:advertisement:export')"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="advertisementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="广告id" align="center" prop="adId" />
      <el-table-column label="广告名称" align="center" prop="adName" />
      <el-table-column label="图片链接" align="center" prop="adImage" />
      <el-table-column label="广告描述" align="center" prop="adDesc" />
      <el-table-column label="广告链接" align="center" prop="adUrl" />
      <el-table-column label="跳转类型:活动页/公众号推文" align="center" prop="directType" />
      <el-table-column label="广告类型：简历精修/面试辅导/轮播广告" align="center" prop="adType" />
      <el-table-column label="广告优先级" align="center" prop="adPriority" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="isAuth('system:advertisement:edit')"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="isAuth('system:advertisement:remove')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改广告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="广告名称" prop="adName">
          <el-input v-model="form.adName" placeholder="请输入广告名称" />
        </el-form-item>
        <el-form-item label="图片链接">
          <imageUpload v-model="form.adImage"/>
        </el-form-item>
        <el-form-item label="广告描述" prop="adDesc">
          <el-input v-model="form.adDesc" placeholder="请输入广告描述" />
        </el-form-item>
        <el-form-item label="广告链接" prop="adUrl">
          <el-input v-model="form.adUrl" placeholder="请输入广告链接" />
        </el-form-item>
        <el-form-item label="跳转类型:活动页/公众号推文" prop="directType">
          <el-select v-model="form.directType" placeholder="请选择跳转类型:活动页/公众号推文">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型：简历精修/面试辅导/轮播广告" prop="adType">
          <el-select v-model="form.adType" placeholder="请选择广告类型：简历精修/面试辅导/轮播广告">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告优先级" prop="adPriority">
          <el-input v-model="form.adPriority" placeholder="请输入广告优先级" />
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
import { listAdvertisement, getAdvertisement, delAdvertisement, addAdvertisement, updateAdvertisement, exportAdvertisement } from "@/api/lit/advertisement";
import ImageUpload from '@/components/ImageUpload';

export default {
  name: "Advertisement",
  components: {
    ImageUpload,
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
      // 广告表格数据
      advertisementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        adName: null,
        adImage: null,
        adDesc: null,
        adUrl: null,
        directType: null,
        adType: null,
        adPriority: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询广告列表 */
    getList() {
      this.loading = true;
      listAdvertisement(this.queryParams).then(response => {
        this.advertisementList = response.rows;
        this.total = response.total;
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
        adId: null,
        adName: null,
        adImage: null,
        adDesc: null,
        adUrl: null,
        directType: null,
        adType: null,
        adPriority: null,
        createTime: null
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
      this.ids = selection.map(item => item.adId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const adId = row.adId || this.ids
      getAdvertisement(adId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改广告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.adId != null) {
            updateAdvertisement(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAdvertisement(this.form).then(response => {
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
      const adIds = row.adId || this.ids;
      this.$confirm('是否确认删除广告编号为"' + adIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAdvertisement(adIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有广告数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAdvertisement(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
