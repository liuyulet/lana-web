<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="人员完成状态"
      width="80%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <!--    用户信息-->
        <el-table
            :data="uerDataList"
            style="width: 100%;font-size: 13px;margin-top: 2rem;"
            header-row-class-name="table-header"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              style="color: #1e1e1e"
              width="55">
          </el-table-column>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column align="center" prop="fullname" label="姓名" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="username" label="用户账号名" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="roleName" label="角色" min-width="100">
          </el-table-column>
          <el-table-column align="center" label="任务状态" min-width="100">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" v-if="scope.row.taskStatus == 0">未开始</el-tag>
                <el-tag size="medium" type="info" v-if="scope.row.taskStatus == 1">进行中</el-tag>
                <el-tag size="medium" type="info" v-if="scope.row.taskStatus == 2">已完成</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="taskRecord" label="提交内容(任务完成结果)" min-width="860">

          </el-table-column>
          <el-table-column align="center" prop="taskStartTime" label="任务开始时间" min-width="160">
          </el-table-column>
          <el-table-column align="center" prop="taskEndTime" label="任务结束时间" min-width="160">
          </el-table-column>
        </el-table>

        <div style="margin-top: 50px;text-align: center;">
            <el-button @click="close">取消</el-button>
        </div>

    </el-dialog>
  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";

export default {
  name: "collaboratorsEdit",
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
      userSelection: '',
      demendId: '',
      uerDataList: {
        pams:''

      },
      rules: {
      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {
      //console.log(platform);
      //判断是新增还是修改
      this.demendId = platform;
      if (platform == null) {
        this.uerDataList.pams = 1
      }else {
        //查看协作者信息
        let params = {
          'demanId': platform
        }
        getAction("/sysTask/getLookColla", params).then((data) => {
          if (data && data.code === 200) {
            this.uerDataList = data.result
            //处理数据
            this.totalPage = data.result.totalCount
          }
        })
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
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
