<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="修改密码"
      width="30%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-row >
          <el-col :span="20">
            <el-form :rules="rules" :model="updatePassword" label-width="160px">
              <el-form-item  label="原始密码" prop="password">
                <el-input v-model="updatePassword.password" placeholder="机构名称请区分明确，不要重复哦"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPasswordone">
                <el-input v-model="updatePassword.newPasswordone" placeholder="新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="newPasswordtwo">
                <el-input v-model="updatePassword.newPasswordtwo" placeholder="确认新密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onEdits()">修改</el-button>
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
  name: "updatePasswordEdit",
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      organizaDataList: null,
      updatePassword: {
        password: '',
        newPasswordone: '',
        newPasswordtwo: ''
      },
      rules: {
        password: [{ required: true, message: "组织机构名称不可为空", trigger: "blur" }],
        newPasswordone: [{ required: true, message: "组织机构编码不可为空", trigger: "blur" }],
        newPasswordtwo: [{ required: true, message: "组织机构编码不可为空", trigger: "blur" }],
      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {

      this.showDialog = true;
      this.listChangeCallback = callback;
    },


    //修改
    onEdits () {
      if(this.updatePassword.newPasswordone===this.updatePassword.newPasswordtwo){
        let params = {
          password: this.updatePassword.password,
          newPassword: this.updatePassword.newPasswordone
        }
        postAction("/sys/user/password",params).then((data) => {
          console.log(data);
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
              message: '原密码不正确',
              type: 'error'
            });
          }
        })
      }else {
        this.$message({
          showClose: true,
          message: "两次密码不一致",
          type: 'error'
        });
      }
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
