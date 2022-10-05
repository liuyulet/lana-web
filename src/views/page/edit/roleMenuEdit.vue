<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="维护角色菜单"
      width="30%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-table
            :data="roleMenuDataList"
            style="width: 100%;font-size: 13px;margin-top: 2rem;"
            header-row-class-name="table-header"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              style="color: #1e1e1e"
              width="55">
          </el-table-column>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column align="center" prop="fullname" label="姓名" min-width="200">
          </el-table-column>
          <el-table-column align="center" prop="username" label="用户账号名" min-width="200">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";

export default {
  name: "orgEdit",
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      roleMenuDataList: null,
      roleMenuData: {
        userId: '',

      },

      rules: {

      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {
      console.log(platform);
      //判断是新增还是修改
      if (platform != null) {
        let params = {
          roleId: platform
        }
        getAction("/sysMenu/navList",params).then((data) => {
          if (data && data.code === 200) {
            this.roleMenuDataList = data.result
          }else {
            this.$message({
              showClose: true,
              message: '获取组织信息失败，请联系管理员',
              type: 'error'
            });
          }
        })

      }else {
        //如果没有角色id，则提示错误信息
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    handleSelectionChange(val) {
      console.log(val)
    },

    onSubmit () {
      let params = {
        fullname: this.orgEdit.fullname,
        username: this.orgEdit.username,
        email: this.orgEdit.email,
        mobile: this.orgEdit.mobile,
        status: this.orgEdit.status,
        parentId: this.orgEdit.parentId,
        departIds: this.orgEdit.departIds,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sys/user/hadlesave",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
        }else {
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      })
    },
    close () {
      this.showDialog = false;
    },

  },
};
</script>

<style>
/* 谷歌 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
/* 火狐 */
input{
  -moz-appearance:textfield;
}

.control-btn i {
  font-size: 20px;
  color: #78aee4;
  display: flex;
  justify-content: center;
  align-items: center;
}



.control-top i {
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
  left: -1px;
  bottom: 0;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-top .fa {
  transform: rotate(45deg) translateY(-7px);
}

.control-left i {
  transform: rotate(-45deg);
}

.control-left .control-inner {
  right: -1px;
  top: -1px;
  border-bottom: 1px solid #78aee4;
  border-left: 1px solid #78aee4;
  border-radius: 0 0 0 100%;
}

.control-left .fa {
  transform: rotate(-45deg) translateX(-7px);
}
.selects {
  width: 100%;
}

.control-right i {
  transform: rotate(-45deg);
}

.control-right .control-inner {
  left: -1px;
  bottom: -1px;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-right .fa {
  transform: rotate(-45deg) translateX(7px);
}

.control-bottom i {
  transform: rotate(-45deg);
}

.control-bottom .control-inner {
  top: -1px;
  left: -1px;
  border-bottom: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 0 100% 0;
}

.control-bottom .fa {
  transform: rotate(-45deg) translateY(7px);
}
</style>
