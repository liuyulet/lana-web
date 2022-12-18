<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="描述内容"
      width="70%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-row >
          <el-col :span="22">
            <el-form :rules="rules" :model="overTeskEdit" label-width="160px">

              <el-form-item label="完成内容：" prop="contents">
                <el-input
                    style="min-height: 200px"
                    type="textarea"
                    placeholder="驳回则填写因为什么原因驳回；产品请填写需求简介；开发人员请填写git提交记录，标注好代码注释；测试人员请填写测试评价；实施人员请填写实施记录"
                    v-model="overTeskEdit.contents"
                    maxlength="2000"
                    show-word-limit>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"  @click="onSubmit">保存</el-button>
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
  name: "overTeskEdit",
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      dutyUser: [],
      urls:'',
      fileList: [],
      taskType: '',
      overTeskEdit: {
        contents: '',
        demanId: ''

      },
      projects: [],
      rules: {
        contents: [
            { required: true, message: "功能完成内容必填", trigger: "blur" },
            { min: 1, max: 2000, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
    };
  },


  methods: {

    openDialog: function (platform,submitType, callback) {
      //是否完成，1是，0驳回
      this.overTeskEdit.demanId = platform
      this.taskType = submitType
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    onSubmit () {
      let params = {
        contents: this.overTeskEdit.contents,
        demanId: this.overTeskEdit.demanId,
        taskType: this.taskType
      }
      postAction("/sysDemanUser/overTask",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-task')
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

.el-textarea__inner {
  min-height: 300px !important;
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
