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
       <el-form :rules="rules" :model="planTaskEdit"  label-width="120px" >
         <el-row :gutter="24">
           <el-col :span="11">
              <el-form-item  label="名称：" prop="planName">
                <el-input v-model="planTaskEdit.planName" placeholder="请填项名称"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item label="结束日期：" prop="planDemanEndTime">
                <div class="block">
                  <el-date-picker
                      style="width: 100%"
                      v-model="planTaskEdit.planDemanEndTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </el-form-item>
          </el-col>
           <el-col :span="24">
             <div>
               <mavon-editor
                   v-model="context"
                   ref="md"
                   @imgAdd="$imgAdd"
                   @imgDel="$imgDel"
                   @change="change"
                   style="min-height: 400px"
               />
             </div>
           </el-col>
         </el-row>
         <el-form-item style="margin-top: 10px">
           <el-button type="primary" v-if="this.edits==false" @click="onSubmit()">新增</el-button>
           <el-button type="primary" v-if="this.edits==true" @click="onEdits()">修改</el-button>
           <el-button @click="close">取消</el-button>
         </el-form-item>
        </el-form>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";
var editor;
export default {
  name: "planTaskEdit",

  data() {
    return {
      editor: null,
      editorContent: '',
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      props: ['catchData'], // 接收父组件的方法
      planTaskEdit: {
        planName: '',
        planDemanEndTime: ''
      },
      demandData: {},
      projects: [],
      rules: {
        fullname: [{required: true, message: "姓名不可为空", trigger: "blur"}],
      },
      context: "  ", //输入的数据
      html: "",//html格式编辑器
    }
  },


  methods: {

    openDialogs: function (platform,types,callback) {
      //新增
      if (types == 0) {
        this.edits = false;
        this.demandData = platform;
      }else {
        //修改
        this.edits = true;
        this.demandData = platform;
        //获取回显数据
        this.planTaskEdit.planName = platform.planName
        this.planTaskEdit.planDemanEndTime = platform.planDemanEndTime
        this.context = platform.planCont
      }
      this.showDialog = true;
      this.listChangeCallback = callback;

    },
    // 绑定@imgAdd event
    $imgAdd() {
      console.log("添加图片");
    },
    $imgDel() {
      console.log("删除图片");
    },
    //修改
    onEdits () {
      let params = {
        //数据怼上去
      }
      postAction("/sysDeman/updateProject",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-planiteams')
        }else {
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      })
    },

    //新增
    onSubmit () {
      let params = {
        planName: this.planTaskEdit.planName,
        //富文本的内容
        planCont: this.context,
        planStatus: 0,
        planDemanName: this.demandData.demanName,
        planDemanEndTime: this.planTaskEdit.planDemanEndTime,
        planDemanId: this.demandData.id,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/palnItem/addPalnItem",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-planiteams',{id:this.demandData.id})
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
