<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="维护项目"
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
            <el-form :rules="rules" :model="projectEdit" label-width="160px">
              <el-form-item  label="名称" prop="projectName">
                <el-input v-model="projectEdit.projectName" placeholder="请填写人项目名称"></el-input>
              </el-form-item>
              <el-form-item label="项目编号" prop="projectNum">
                <el-input v-model="projectEdit.projectNum" placeholder="项目编号，不填写则默认生成"></el-input>
              </el-form-item>
              <el-form-item label="项目负责人" prop="projectDutyUser">
                <el-select class="selects"  v-model="projectEdit.projectDutyUser" placeholder="请选择项目负责人">
                <el-option
                    v-for="item in projectStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>

              </el-form-item>
<!--              <el-form-item label="项目章程" prop="projectConstitution">
                <el-input v-model="projectEdit.projectConstitution" placeholder="上传项目章程"></el-input>
              </el-form-item>-->
              <el-form-item  label="状态" prop="status">
                <el-select class="selects"  v-model="projectEdit.projectStatus" placeholder="请选择">
                  <el-option
                      v-for="item in projectStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目备注" prop="projectMakr">
                <el-input v-model="projectEdit.projectMakr" placeholder="项目备注"></el-input>
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
  name: "projectEdit",
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      userDataList: [],
      projectEdit: {
        projectName: '',
        projectNum: '',
        projectDutyUser: '',
        projectConstitution: '',
        projectStatus: '',
        projectMakr: '',

      },
      projectStatus: [{
        value: '1',
        label: '进行中'
      }, {
        value: '0',
        label: '未开始'
      }, {
        value: '2',
        label: '已完成'
      }],
      rules: {
        fullname: [{ required: true, message: "姓名不可为空", trigger: "blur" }],

      },
    };
  },

  methods: {

    openDialog: function (platform, callback) {
      //console.log(platform);
      //获取用户信息
      this.getUsers();
      //判断是新增还是修改
      if (platform == null) {
        //新增
        this.edits = false;
      }else {
        this.edits = true;
        this.projectEdit.projectName = platform.projectName
        this.projectEdit.projectNum = platform.projectNum
        this.projectEdit.projectDutyUser = platform.projectDutyUser
        this.projectEdit.projectConstitution = platform.projectConstitution
        this.projectEdit.projectStatus = platform.projectStatus
        this.projectEdit.projectMakr = platform.projectMakr
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    getUsers () {
      getAction("/sys/user/getUserAll").then((data) => {
        if (data && data.code === 200) {
          this.userDataList = data.result
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
        userId: this.projectEdit.userId,

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
        fullname: this.projectEdit.fullname,
        projectName: this.projectEdit.projectName,
        projectNum: this.projectEdit.projectNum,
        projectDutyUser: this.projectEdit.projectDutyUser,
        projectConstitution: this.projectEdit.projectConstitution,
        projectStatus: this.projectEdit.projectStatus,
        projectMakr:this.projectEdit.projectMakr,
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
