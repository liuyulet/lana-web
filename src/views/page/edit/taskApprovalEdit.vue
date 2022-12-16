<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
        title="协作者与进度情况"
        width="80%"
        top="2rem"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >

      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <H2 style="text-align: center">任务进度：{{dataType}}</H2>
        <div>
          <el-steps :active="active" align-center >
            <el-step
                v-for="astep in stepList"
                :title= astep.label
                :description= "astep.description"
            >
              <template  slot="description">
                <div v-html="astep.description"></div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <span slot="footer">
      <el-button @click="close">关闭</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";
export default {
  name: "taskApprovalEdit",

  computed: {},
  data() {
    return {
      active: 0,
      visible: false,
      dataType: '',
      showDialog: false,
      isLoging: false,
      stepList: [

      ],
    }
  },

  methods: {
    openDialog: function (platformid, callback) {
      this.getByStuts(platformid);
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    getByStuts (platformid) {
      let params = {
        itemid: platformid
      }
      getAction("/sysDemanUser/findByStatus",params).then((data) => {
        if (data && data.code === 200) {
          this.handleStep(data.result);
        }else {
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      })
    },


    handleStep(results){

      let stepLists = [];

      for (let i = 0; i < results.length; i++) {
        let data ={label:'',value:'',description:''};
        data.label = results[i].nodeId;
        data.value = results[i].nodeId;
        let desc = "";
        for (let j = 0; j < results[i].sysDemanUserEntity.length; j++) {

          let erOpin = "";
          //1:数据被驳回，2:数据审批通过，3:审批中
          if(results[i].sysDemanUserEntity[j].dataType ==1){
            this.dataType = "驳回"
          }else if (results[i].sysDemanUserEntity[j].dataType ==2){
            this.dataType = "执行完成"
          }else {
            this.dataType = "执行中"
          }

          //1:进行中，2:驳回，3应做，0待办（刚分配），4完成
          if(results[i].sysDemanUserEntity[j].userOpinion ==1){
            erOpin = "已接受"
          }else if (results[i].sysDemanUserEntity[j].userOpinion ==2){
            erOpin = "驳回"
          }else if (results[i].sysDemanUserEntity[j].userOpinion ==4){
            erOpin = "完成"
            this.active = results[i].nodeId
          }else if(results[i].sysDemanUserEntity[j].userOpinion ==3){
            erOpin = "待接受"
            this.active = results[i].nodeId -1
            //这个就是当前阶段
          }

          desc +=
              "执行人："+results[i].sysDemanUserEntity[j].userName+"；"+"<br>" +
              "执行结果："+erOpin +"；"+"<br>"+
              "执行意见："+results[i].sysDemanUserEntity[j].userRemarks +"；"+"<br>"
        }
        data.description = desc;
        stepLists.push(data);
      }
      this.stepList = stepLists;
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
