<template>
    <div>
        <el-row :gutter="15">
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
                     label-position="top">
                <el-col :span="24">
                    <el-form-item label="主题" prop="subject">
                        <el-input v-model="formData.subject" placeholder="请输入主题"
                                  prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="正文" prop="content">
                        <el-input v-model="formData.content" type="textarea" placeholder="请输入正文(支持html)"
                                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="上传收件人" prop="file">
                        <!--<el-upload ref="file" :file-list="filefileList" :auto-upload="false"
                                   :before-upload="fileBeforeUpload">
                            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                        </el-upload>-->
                        <el-upload
                            class="upload-demo"
                            action=""
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed"
                            :limit="limitUpload"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                            :auto-upload="false">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div> -->
                        </el-upload>
                    </el-form-item>
                    <!-- 数据展示 -->
                    <el-main>
                        <el-table :data="da">
                            <el-table-column prop="name" label="姓名">
                            </el-table-column>
                            <el-table-column prop="email" label="邮箱">
                            </el-table-column>
                        </el-table>
                    </el-main>

                </el-col>
                <el-col :span="6">
                    <el-form-item label="host" prop="host">
                        <el-input v-model="formData.host" placeholder="请输入host" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="from" prop="from">
                        <el-input v-model="formData.from" placeholder="请输入from" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="userName" prop="userName">
                        <el-input v-model="formData.userName" placeholder="请输入userName" clearable
                                  :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="password" prop="password">
                        <el-input v-model="formData.password" placeholder="请输入password" clearable
                                  :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item size="large">
                        <el-button type="primary" @click="submitForm">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script>
    export default {
        components: {},
        props: [],
        data() {
            return {
                limitUpload: 1,
                fileTemp: null,
                file: null,
                da: [],
                dalen: 0,
                formData: {
                    subject: '',
                    content: undefined,
                    // file: null,
                    tos: [],
                    host: "smtp.163.com",
                    from: "18875144883@163.com",
                    userName: "18875144883@163.com",
                    password: "DUXYEAPCRMVZHCWQ",
                },
                rules: {
                    subject: [{
                        required: true,
                        message: '请输入主题',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入正文(支持html)',
                        trigger: 'blur'
                    }],
                    host: [{
                        required: true,
                        message: '请输入host',
                        trigger: 'blur'
                    }],
                    from: [{
                        required: true,
                        message: '请输入from',
                        trigger: 'blur'
                    }],
                    userName: [{
                        required: true,
                        message: '请输入userName',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入password',
                        trigger: 'blur'
                    }],
                },
            }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {
        },
        methods: {
            submitForm() {
                this.$refs['elForm'].validate(valid => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`/email/send`),
                            method: "post",
                            data: this.$http.adornData(this.formData)
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: "操作成功",
                                    type: "success",
                                    duration: 1500
                                });
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                    }
                })
            },
            resetForm() {
                this.$refs['elForm'].resetFields()
            },
            handleChange(file, fileList) {
                this.fileTemp = file.raw;
                if (this.fileTemp) {
                    if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        || (this.fileTemp.type == 'application/vnd.ms-excel')) {
                        this.importfxx(this.fileTemp);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '附件格式错误，请删除后重新上传！'
                        })
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传附件！'
                    })
                }
            },
            handleExceed() {
                this.$message({
                    type: 'warning',
                    message: '超出最大上传文件数量的限制！'
                })
                return;
            },
            handleRemove(file, fileList) {
                this.fileTemp = null
            },
            importfxx(obj) {
                let _this = this;
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require("xlsx");
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), {
                                //手动转化
                                type: "base64"
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: "binary"
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                        console.log('未处理的原始数据如下：');
                        console.log(outdata);
                        //此处可对数据进行处理
                        let arr = [];
                        outdata.map(v => {
                            let obj = {}
                            obj.name = v['姓名']
                            obj.email = v['邮箱']
                            _this.formData.tos.push(v['邮箱'])
                            arr.push(obj)
                        });
                        _this.da = arr;
                        console.log("test")
                        console.log(arr)
                        _this.dalen = arr.length;
                        console.log(_this.formData.tos)
                        return arr;
                    };
                    reader.readAsArrayBuffer(f);
                };
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            }
        }
    }

</script>
<style>
    .el-upload__tip {
        line-height: 1.2;
    }

</style>
