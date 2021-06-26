<template>
    <div>
        <div class="edit-avatar">
            <span class="label">修改头像</span>
            <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <el-avatar :size=" 200" :src="url"></el-avatar>
            </el-upload>
        </div>
        <div class="edit-item">
            <el-form ref="myform" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="用户名:" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                    <el-radio-group v-model="form.gender">
                        <el-radio label="male"><i class="el-icon-male"></i>男</el-radio>
                        <el-radio label="female"><i class="el-icon-female"></i>女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址:">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="用户ID">
                    <span style="font-size: 14px;color: #898989;">{{info._id}}</span>
                </el-form-item>
                <el-form-item label="我的签名:">
                    <el-input type="textarea"  rows="3" v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('myform')">保存</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {userEdit} from "@/service/api"
export default {
    
    data(){
        const userInfo = this.$store.state.userInfo;
        const imgurl = userInfo.avatar || '/bjt.jpg';
        return {
            url:imgurl,
            info:userInfo,
            imgMaxWidth:210,
            maxSize:2,
            form: {
                name: userInfo.name,
                sign: userInfo.sign,
                avatar:userInfo.avatar,
                gender:userInfo.gender,
                address:userInfo.address,
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
        if(res.code === 1){
            this.$message({
            message: res.mes,
            type: 'warning'
            });
            return;
        }
        this.url = URL.createObjectURL(file.raw);
        this.form.avatar = res.data.url;
        },
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < this.maxSize;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
                let data = await userEdit(this.form);
                if(data.code === 0){
                    this.$router.push({
                    name: 'home'
                })
            }
            } else {
                //console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="stylus">
.edit-item 
    .el-input
        width 300px
    .el-textarea
        width 500px
    .el-icon-male
        color blue
        padding 2px 5px 2px 5px
        text-align center
        border-radius 5px
        background-color white
        margin-right 5px
    .el-icon-female
        color red
        padding 2px 5px 2px 5px
        text-align center
        border-radius 5px
        background-color white
        margin-right 5px
</style>