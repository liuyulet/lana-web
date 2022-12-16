<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
        title="流程信息"
        width="80%"
        top="2rem"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >
      <!--列表-->
      <el-table :data="stepList" style="width: 100%;font-size: 13px;"
                :height="winHeight" header-row-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            style="color: #1e1e1e"
            width="55">
        </el-table-column>
        <el-table-column align="center" prop="stepName" label="协作过程名称" min-width="150">
        </el-table-column>

        <el-table-column align="center" prop="stepNum" label="过程节点数" min-width="50" >
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="findStep(scope.row)">{{ scope.row.stepNum }}</el-button>
          </template>

        </el-table-column>

        <el-table-column align="center" prop="createUser" label="创建人"  min-width="100">
        </el-table-column>

        <el-table-column align="center" prop="createTime" label="创建时间"  min-width="150">
        </el-table-column>

      </el-table>
      <el-pagination
          style="float: right"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <div style="margin-top: 50px;text-align: center;">
        <el-button type="primary"  @click="onSubmit">保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <versionDtiolEdit ref="versionDtiolEdit" @get-step="getStep"></versionDtiolEdit>
  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";
import versionDtiolEdit from "./versionDtiolEdit";
export default {
  name: "binDingEdit",
  components: {
    versionDtiolEdit
  },
  computed: {},
  data() {
    return {
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      stepList: null,
      palnItemId: '',
      planId: '',
      planItemName: '',
      planName: '',
      stepId: '',
      selectionL: [],
    };
  },

  methods: {
    openDialogz: function (id,planItemName,planProject, callback) {
      //console.log(platform);
      //任务id
      this.palnItemId = id;
      this.planId = planProject.id;
      this.planItemName = planItemName;
      this.planName = planProject.planName;
      this.showDialog = true;
      this.listChangeCallback = callback;
      this.getStep();
    },
    //过程列表
    getStep() {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize
      }
      getAction("/sysStep/getStep", params).then((data) => {
        if (data && data.code === 200) {
          this.stepList = data.result.list
          //处理数据
          this.totalPage = data.result.totalCount
        }
      })
    },
    onSubmit () {
      let params = {
        stepId: this.stepId,
        palnItemId: this.palnItemId,
        palnItemName: this.planItemName,
        palnName: this.planName,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/busBinding/addBinding",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
          this.$emit('get-planiteams',{id:this.planId})
        }else {
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      })
    },
    handleSelectionChange(val) {
      if(this.selectionL.length<1){
        this.selectionL = [];
        val.forEach(item => {
          if (item.stepId != null && item.stepId != '') {
            this.stepId = item.stepId;
            this.selectionL.push(item.stepId);
          }
        });
      }else {
        this.selectionL = [];
        this.$message({
          showClose: true,
          message: '必须且只能选择一个哦',
          type: 'error'
        });
      }


    },
    //查看节点信息
    findStep(step){
      this.$refs.versionDtiolEdit.openDialoga(step, this.initData)
    },
    close () {
      this.showDialog = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getStep()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getStep()
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
