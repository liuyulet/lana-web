<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="维护人员"
      width="30%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <spen style="color: #a95812;display:block;width:100%;text-align: center">手动添加的用户默认密码为：000000</spen>
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-row >
          <el-col :span="20">
            <el-form :rules="rules" :model="orgEdit" label-width="160px">
              <el-form-item  label="姓名" prop="fullname">
                <el-input v-model="orgEdit.fullname" placeholder="请填写人员姓名"></el-input>
              </el-form-item>
              <el-form-item label="账号" prop="username">
                <el-input v-model="orgEdit.username" placeholder="登录账号"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="orgEdit.email" placeholder="请输入用户邮箱信息"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="orgEdit.mobile" placeholder="手机/电话"></el-input>
              </el-form-item>
              <el-form-item  label="状态" prop="status">
                <el-select class="selects"  v-model="orgEdit.status" placeholder="请选择">
                  <el-option
                      v-for="item in userStatuss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  label="负责部门" prop="departIds">
                <el-select class="selects"  v-model="orgEdit.departIds" placeholder="请选择，普通成员不要指定负责的部门">
                  <el-option
                      v-for="item in organizaDataList"
                      :key="item.id"
                      :label="item.departName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="this.edits" @click="onEdits()">修改</el-button>
                <el-button type="primary" v-if="!this.edits" @click="onSubmit">新增</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
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
      organizaDataList: null,
      orgEdit: {
        userId: '',
        fullname: '',
        username: '',
        email: '',
        mobile: '',
        status: '',
        parentId: '',
        departIds: ''
      },
      userStatuss: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '禁用'
      }],
      rules: {
        fullname: [{ required: true, message: "姓名不可为空", trigger: "blur" }],
        username: [{ required: true, message: "账号不可为空", trigger: "blur" }],
        email: [{ required: true, message: "邮箱不可为空，后续增加功能：任务下发邮箱提醒", trigger: "blur" }],
        mobile: [{ required: true, message: "手机号码不可为空", trigger: "blur" }],
        status: [{ required: true, message: "必须指定用户状态", trigger: "blur" }],
      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {
      //console.log(platform);
      //组织列表
      this.getDepart();
      //判断是新增还是修改
      if (platform == null) {
        //新增
        this.edits = false;
      }else {
        this.edits = true;
        this.orgEdit.userId = platform.userId
        this.orgEdit.fullname = platform.fullname
        this.orgEdit.username = platform.username
        this.orgEdit.email = platform.email
        this.orgEdit.mobile = platform.mobile
        this.orgEdit.status = platform.status
        this.orgEdit.departIds = platform.dutyIds
        this.orgEdit.parentId = platform.parentId
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    getDepart () {
      getAction("/sysDepart/getDepart").then((data) => {
        if (data && data.code === 200) {
          this.organizaDataList = data.result
        }else {
          this.$message({
            showClose: true,
            message: '获取组织信息失败，请联系管理员',
            type: 'error'
          });
        }
      })
    },

    //修改
    onEdits () {
      let params = {
        userId: this.orgEdit.userId,
        fullname: this.orgEdit.fullname,
        username: this.orgEdit.username,
        email: this.orgEdit.email,
        mobile: this.orgEdit.mobile,
        status: this.orgEdit.status,
        parentId: this.orgEdit.parentId,
        departIds: this.orgEdit.departIds,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sys/user/update",params).then((data) => {
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
            message: '操作成功,手动添加用户密码默认为：000000',
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
