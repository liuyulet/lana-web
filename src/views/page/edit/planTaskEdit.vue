<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
        title="计划维护"
        width="80%"
        top="2rem"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >

      <div id="shared" style="text-align: right; margin-top: 1rem;">
       <el-form :rules="rules" :model="demandEdit"  label-width="120px" >
         <el-row :gutter="24">
           <el-col :span="12">
              <el-form-item  label="名称：" prop="demanName">
                <el-input v-model="demandEdit.demanName" placeholder="请填需求名称"></el-input>
              </el-form-item>
              <el-form-item label="计划编号：" prop="demanNum">
                <el-input v-model="demandEdit.demanNum" placeholder="项目编号，默认自动生成"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="结束日期：" prop="demanDeadline">
                <div class="block">
                  <el-date-picker
                      style="width: 100%"
                      v-model="demandEdit.demanDeadline"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item  label="关联项目：" prop="status">
                <el-select class="selects"  v-model="demandEdit.demanProject" placeholder="请选择项目">
                  <el-option
                      v-for="item in projects"
                      :key="item.projectId"
                      :label="item.projectName"
                      :value="item.projectId">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="计划负责人：" prop="demanConsci">
                <el-select class="selects"  v-model="demandEdit.demanConsci" placeholder="请选择计划负责人">
                  <el-option
                      v-for="item in dutyUser"
                      :key="item.userId"
                      :label="item.fullname+item.mobile"
                      :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
           <el-col :span="24">
             <div class='clearfix'>
               <!-- 富文本编辑框 -->
               <div id="wangEditorElem" style="height:210px;background: #ffffff;"></div>
             </div>
           </el-col>
          <el-col :span="12">
              <el-form-item>
                <el-button type="primary" v-if="this.edits" @click="onEdits()">修改</el-button>
                <el-button type="primary" v-if="!this.edits" @click="onSubmit">新增</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
          </el-col>


         </el-row>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import E from 'wangeditor'
import {getAction,postAction} from "../../../api/manage";
export default {
  name: "planTaskEdit",
  computed: {},
  data() {
    return {
      wEditor: '',
      name: '',
      editor: null,
      editorContent: '',
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      dutyUser: [],
      fileList: [],
      props: ['catchData'], // 接收父组件的方法
      demandEdit: {

      },
      projects: [],
      rules: {
        fullname: [{ required: true, message: "姓名不可为空", trigger: "blur" }],
      },

    };
  },


  methods: {

    openDialogs: function (platform, callback) {

      //获取人员
      this.getUsers()
      this.getProjectAll()
      if (platform == null) {
        //新增
        this.edits = false;
      }else {
        //修改
        this.edits = true;
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    getUsers () {
      getAction("/sys/user/getUserAll").then((data) => {
        if (data && data.code === 200) {
          this.dutyUser = data.result.userData
          console.log(this.dutyUser)
        }else {
          this.$message({
            showClose: true,
            message: '获取组织信息失败，请联系管理员',
            type: 'error'
          });
        }
      })
    },

    getProjectAll () {
      getAction("/sysProject/getProjectAll").then((data) => {
        if (data && data.code === 200) {
          this.projects = data.result.projectData
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
        //数据怼上去
        demanChange: this.demandEdit.demanChange,
        demanConsci: this.demandEdit.demanConsci,
        demanConsciAcoun: this.demandEdit.demanConsciAcoun,
        demanDeadline: this.demandEdit.demanDeadline,
        demanDisclose: this.demandEdit.demanDisclose,
        demanDisoName: this.demandEdit.demanDisoName,
        demanName: this.demandEdit.demanName,
        demanNum: this.demandEdit.demanNum,
        demanProject: this.demandEdit.demanProject,
        id:this.demandEdit.id,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sysDeman/updateProject",params).then((data) => {
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
        createTime: this.demandEdit.createTime,
        demanChange: this.demandEdit.demanChange,
        demanConsci: this.demandEdit.demanConsci,
        demanConsciAcoun: this.demandEdit.demanConsciAcoun,
        demanDeadline: this.demandEdit.demanDeadline,
        demanDisclose: this.demandEdit.demanDisclose,
        demanDisoName: this.demandEdit.demanDisoName,
        demanName: this.demandEdit.demanName,
        demanNum: this.demandEdit.demanNum,
        demanProject: this.demandEdit.demanProject,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sysDeman/addDeman",params).then((data) => {
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
