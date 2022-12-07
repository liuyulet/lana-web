<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
        title="过程详情展示"
        width="80%"
        top="2rem"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >

      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <div>
          <el-steps :active="active" align-center finish-status="success">
            <el-step
                v-for="astep in stepList"
                :title=astep.label
                description="节点信息"
            ></el-step>
          </el-steps>
        </div>

        <el-table
            ref="multipleTable"
            :data="uerDataList"
            style="width: 100%;font-size: 13px;margin-top: 2rem;"
            header-row-class-name="table-header"
            @selection-change="handleSelectionChange">
          <el-table-column
              style="color: #1e1e1e"
              width="55">
          </el-table-column>
          <el-table-column align="center" prop="fullname" label="姓名" min-width="80">
          </el-table-column>
          <el-table-column align="center" prop="username" label="用户账号名" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="dutyName" label="负责部门" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="departName" label="所属部门" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="roleName" label="所属角色" min-width="100">
          </el-table-column>
        </el-table>

        <el-form :rules="rules" style="margin-top: 40px">
          <el-form-item>
            <el-button @click="pres" type="success" plain v-if="this.active>0">返回上一节点</el-button>
            <el-button @click="nextto" v-if="this.stepList.length-1>this.active" type="primary" plain
                       style="margin-right: 30px">进入下一节点
            </el-button>
            <el-button @click="close" type="primary" plain>关闭</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {getAction, postAction} from "../../../api/manage";

export default {
  name: "versionDtiolEdit",

  computed: {},
  data() {
    return {
      active: 0,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      userSelection: {},
      props: ['catchData'], // 接收父组件的方法
      uerDataList: {},
      //步骤信息
      stepId: '',
      stepList: [],
      nowStepList: [],
      rules: {
        fullname: [{required: true, message: "姓名不可为空", trigger: "blur"}],

      },
    };
  },
  methods: {

    openDialoga: function (step, callback) {
      if (step == null) {
        //新增
      } else {
        //如果是修改，就获取修改过程节点信息
        this.getSteps(step.stepId);
        this.stepId = step.stepId;
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    //下一步
    nextto() {
      this.active++;
      //重新获取用户列表
      this.getUsers(this.active)
    },
    overto() {
      this.active++;
      this.getUsers(this.active)
    },
    //上一步
    pres() {
      this.active--;
      this.getUsers(this.active)
      //获取当前阶段的id，并且取出当前ID的绑定人员的数组
    },
    //获取用户信息
    getUsers(stepNode) {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'stepId':  this.stepId,
        'stepNode': stepNode,

      }
      getAction("/sys/UserDepartRole/getstepNodeUser", params).then((data) => {
        if (data && data.code === 200) {
          this.uerDataList = data.result
        }
      })
    },
    //编辑获取过程集信息
    getSteps(stepId) {
      let params = {
        'stepId': stepId
      }
      getAction("/sysStep/getstepNode", params).then((data) => {
        if (data && data.code === 200) {
          this.stepList = data.result.stepNode
          this.userSelection = data.result.stepPeople
          var max;
          this.stepList.forEach(item => {
            max = max === undefined ? item.value : (max > item.value ? max : item.value)
          });
          this.active = max;
          //开始执行
          this.getUsers(max);
        }
      })
    },
    close() {
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
input {
  -moz-appearance: textfield;
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
