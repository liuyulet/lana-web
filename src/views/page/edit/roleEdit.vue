<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="维护角色"
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
            <el-form :rules="rules" :model="roleEdit" label-width="160px">
              <el-form-item  label="角色名称" prop="roleName">
                <el-input v-model="roleEdit.roleName" placeholder="角色名称"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="remark">
                <el-input v-model="roleEdit.remark" placeholder="角色描述"></el-input>
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
  name: "roleEdit",
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      roleEdit: {
        roleId: '',
        roleName: '',
        remark: ''
      },
      rules: {
        roleName: [{ required: true, message: "角色名称不可为空", trigger: "blur" }],

      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {

      //判断是新增还是修改
      if (platform == null) {
        //新增
        this.edits = false;
      }else {
        this.edits = true;
        this.roleEdit.roleId = platform.roleId
        this.roleEdit.roleName = platform.roleName
        this.roleEdit.remark = platform.remark
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    //修改
    onEdits () {
      let params = {
        roleId: this.roleEdit.roleId,
        roleName: this.roleEdit.roleName,
        remark: this.roleEdit.remark,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sys/role/update",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-role')
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
        roleName: this.roleEdit.roleName,
        remark: this.roleEdit.remark,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sys/role/save",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-role')
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
