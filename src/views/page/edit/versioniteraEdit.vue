<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
        title="开发过程管理"
        width="80%"
        top="2rem"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >

      <div style="text-align: center">
        <el-button type="text" @click="opens">增加步骤节点</el-button>
      </div>
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <div>
          <el-steps :active="active" align-center finish-status="success">
            <el-step
                v-for="astep in stepList"
                :title=astep.label
                @click.native="deletPlay(astep.value)"
                description="点击删除该节点"
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
              type="selection"
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
        <el-form :rules="rules" style="margin-top: 40px" label-width="120px">

          <el-form-item>
            <el-button @click="pres">上一步</el-button>
            <el-button @click="nextto">下一步</el-button>
            <el-button type="primary" v-if="this.edits">修改</el-button>
            <el-button type="primary" v-if="!this.edits">新增</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>

        </el-form>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {getAction, postAction} from "../../../api/manage";

export default {
  name: "versioniteraEdit",

  computed: {},
  data() {
    return {
      active: 0,
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      userSelection: {},
      props: ['catchData'], // 接收父组件的方法
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      uerDataList: {},
      //步骤信息
      stepList: [],
      nowStepList: [],
      rules: {
        fullname: [{required: true, message: "姓名不可为空", trigger: "blur"}],

      },
    };
  },


  methods: {

    openDialog: function (platform, callback) {
      //获取人员
      this.getUsers()
      this.getSteps()
      if (platform == null) {
        //新增
        this.edits = false;
      } else {

        this.edits = true;
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },
    //删除节点
    deletPlay(ids) {
      this.$confirm(`节点一旦删除，将无法进行回退，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //简单快捷
        this.nowStepList = [];
        this.stepList.forEach(item => {
          if (item.value != ids) {
            this.nowStepList.push(item);
          }
        });
        this.stepList = this.nowStepList;
      })
    },

    nextto() {
      this.active++;
      //重新获取用户列表
      this.getUsers()
    },
    pres() {
      this.active--;
      /*重新获取用户列表，并且将已经选择的用户添加上，切支持修改*/

      //this.getUsers();


      let modleuser =this.userSelection[this.active]
      //获取当前阶段的id，并且取出当前ID的绑定人员的数组
      let modeUserList = [];
      for (let i = 0; i < this.uerDataList.length; i++) {
        //对比选择的用户，并重新勾选上
        for (let j = 0; j < modleuser.length; j++) {
          if(this.uerDataList[i].userId===modleuser[j]){
            modeUserList.push(this.uerDataList[i])
          }
        }
      }
      this.toggleSelection(modeUserList)
    },
    //选中操作
    toggleSelection(rows) {
      if (rows) {
        this.$refs.multipleTable.clearSelection();
        for (let i = 0; i < rows.length; i++) {
          this.$refs.multipleTable.toggleRowSelection(rows[i]);
        }
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //新增节点
    opens() {
      this.$prompt('请输入过程名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        var max;
        //拼接到过程节点后面
        this.stepList.forEach(item => {
          max = max === undefined ? item.value : (max > item.value ? max : item.value)
        });
        //添加过程
        let aaaa= {
          "value": max+1,
          "label": value,
        }

        this.stepList.push(aaaa);

        this.$message({
          type: 'success',
          message: '你新增的过程是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    getUsers() {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize
      }
      getAction("/sys/UserDepartRole/getUserMessage", params).then((data) => {
        if (data && data.code === 200) {
          this.uerDataList = data.result.list
          //处理数据
          this.totalPage = data.result.totalCount
        }
      })
    },

    getSteps() {
      getAction("/sysTask/getstep").then((data) => {
        if (data && data.code === 200) {
          this.stepList = data.result
        }
      })
    },

    //选择用户
    handleSelectionChange(val) {
      //绑定角色维护两个，一个是未授权用户的，一个是修改已授权用户的
      //this.userSelection = {};
      let datas = [];
      val.forEach(item => {
        datas.push(item.userId);
      });
      this.userSelection[this.active]=datas;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
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
