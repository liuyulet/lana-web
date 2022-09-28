<template v-slot:default>
  <div class="content-currency">
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        router
        mode="horizontal"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b">
        <!--进度/缺陷/考核统计信息-->
        <el-menu-item index="/deviceList">统计信息</el-menu-item>
        <!--我的管理-->
        <el-menu-item index="/taskmanagement">任务管理</el-menu-item>
        <el-menu-item index="/defectList">缺陷管理</el-menu-item>
        <el-menu-item index="/applyList">审批管理</el-menu-item>
        <!--项目信息-->
        <el-menu-item index="/projectList">项目管理</el-menu-item>
        <el-menu-item index="/demandList">需求管理</el-menu-item>
        <!--组织角色人员管理-->
        <el-menu-item index="/orgRoleList">组织角色管理</el-menu-item>


        <el-submenu index="" style="float: right;">
          <template slot="title">欢迎，admin</template>
  <!--        <el-menu-item >
            <el-switch v-model="alarmNotify" inactive-text="信息推送" @change="alarmNotifyChannge"></el-switch>
          </el-menu-item>-->
          <el-menu-item >修改密码</el-menu-item>
          <el-menu-item @click="loginout">注销</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>


    <router-view ></router-view>

    <div class="line" ></div>
  </div>

</template>
<script>
import {postAction} from "../../api/manage";

export default {
  data() {
    return {
      activeIndex: '/deviceList',
      Indexs:''
    };
  },

  methods: {
    handleSelect(key, keyPath) {

      console.log(key, keyPath);
    },
    //退出登录
    loginout() {
      postAction("/sys/logout").then((data) => {
        if (data && data.code === 200) {
          //消息弹框
          this.$message({
            message: data.msg,
            type: 'success'
          });
          localStorage.setItem('X-Access-Token',null);
          this.$router.replace('/login')
        }
      })
    },
  }
}

</script>
<style>
.el-menu-item{
  font-size: 15px;
}
@import url('../../styles/home.scss');



</style>
