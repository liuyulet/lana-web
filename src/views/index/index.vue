<template v-slot:default>
    <div class="content-currency">
        <el-header style="padding: 0">
            <div>
                <el-menu :default-active="activeIndex"
                         class="el-menu-demo"
                         router
                         mode="horizontal"
                         @select="handleSelect"
                         background-color="#001529"
                         text-color="#fff"
                         active-text-color="#ffd04b">
                    <!--进度/缺陷/考核统计信息-->

                    <el-menu-item v-for="(menu,index) in menus" :index="menu.url" :key="index">
                        {{menu.name}}
                    </el-menu-item>

                    <!--
                            我的管理
                            <el-menu-item index="/taskmanagement">任务管理</el-menu-item>
                            <el-menu-item index="/defectList">缺陷管理</el-menu-item>
                            <el-menu-item index="/applyList">变更管理</el-menu-item>
                            项目信息
                            <el-menu-item index="/projectList">项目管理</el-menu-item>
                            <el-menu-item index="/demandList">需求管理</el-menu-item>
                            <el-menu-item index="/versioniteraList">版本迭代管理</el-menu-item>
                            组织角色人员管理
                            <el-menu-item index="/orgRoleList">组织角色管理</el-menu-item>
                    -->

                    <el-submenu index="" style="float: right;">
                        <template slot="title">欢迎，{{this.userFullname}}[{{this.userAccount}}]</template>
                        <!--        <el-menu-item >
                                  <el-switch v-model="alarmNotify" inactive-text="信息推送" @change="alarmNotifyChannge"></el-switch>
                                </el-menu-item>-->
                        <!--          <el-menu-item >修改密码</el-menu-item>-->
                        <el-menu-item @click="loginout">注销</el-menu-item>
                      <el-menu-item @click="updatePassword">修改密码</el-menu-item>
                      <el-menu-item @click="desge">设计表单</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </el-header>


        <router-view></router-view>
      <updatePasswordEdit ref="updatePasswordEdit"></updatePasswordEdit>
        <div class="line"></div>
    </div>

</template>
<script>
    import {postAction, getAction} from "../../api/manage";
    import updatePasswordEdit from '../page/edit/updatePasswordEdit.vue'

    export default {
        components:{
          updatePasswordEdit
        },
        data() {
            return {
                activeIndex: '/deviceList',
                Indexs: '',
                userAccount: '',
                userFullname: '',
                menus: []
            };
        },
        created() {
            this.userAccount = localStorage.getItem('userAccount');
            this.userFullname = localStorage.getItem('userFullname');
            this.getnavList()
        },
        methods: {
            getnavList() {
                let params = {
                    userid: localStorage.getItem("userId")
                };
                getAction("/sysMenu/nav", params).then((resp) => {
                    if (resp && resp.code === 200) {
                        this.menus = resp.result.menus
                    }
                })
            },

            handleSelect(key, keyPath) {

                console.log(key, keyPath);
            },
            //退出登录
            loginout() {
              console.log("调用注销接口")
                postAction("/sys/logout").then((data) => {
                    if (data && data.code === 200) {
                        //消息弹框
                        this.$message({
                            message: data.msg,
                            type: '操作成功'
                        });
                        localStorage.setItem('userAccount', null);
                        localStorage.setItem('userFullname', null);
                        localStorage.setItem('userId', null);
                        localStorage.setItem('X-Access-Token', null);
                        this.$router.replace('/login')
                    }
                })
            },
          //修改密码
            updatePassword(){

                this.$refs.updatePasswordEdit.openDialog(null, this.initData)

            },
            desge(){
              this.$router.replace('/desge')
            },
        }
    }

</script>
<style scoped lang="scss">
    .el-menu-item {
        font-size: 15px;
    }

    @import url('../../styles/home.scss');


</style>
