<template>
    <div class="login-page">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="登录" name="login">
                <login></login>
            </el-tab-pane>
            <el-tab-pane label="注册" name="second">
                <register></register>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import login from './login'
import register from './register'

export default {
    components:{login,register},
    data(){
        return {
            activeName:'login',
        }
    }
}
</script>

<style lang="stylus">
.login-page
  width 500px
  background-color #fff
  margin 0 auto
  box-shadow: 0 0 25px #cac6c6;
  border-radius: 10px;
</style>
