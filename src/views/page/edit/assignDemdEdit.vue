<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="需求分配"
      width="60%"
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

          <el-table-column align="center" prop="fullname" label="姓名" min-width="200">
          </el-table-column>
          <el-table-column align="center" prop="username" label="用户账号名" min-width="200">
          </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱" min-width="140">
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" min-width="120">
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="120">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" v-if="scope.row.status == 1">正常</el-tag>
                <el-tag size="medium" type="info" v-if="scope.row.status == 0">禁用</el-tag>
                <el-tag size="medium" type="info" v-if="scope.row.status == 2">新注册</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="dutyName" label="负责部门" min-width="160">
          </el-table-column>
          <el-table-column align="center" prop="departName" label="所属部门" min-width="160">
          </el-table-column>
          <el-table-column align="center" prop="roleName" label="所属角色" min-width="160">
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
            <el-button type="primary" v-if="!this.edits" @click="onSubmit">保存</el-button>
            <el-button @click="close">取消</el-button>
        </div>

    </el-dialog>
  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";

export default {
  name: "orgEdit",
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
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },
    //提交
    onSubmit () {
      if (this.userSelection.length < 1 ) {
        this.$message({
          showClose: true,
          message: "请在下方勾选要绑定或修改绑定的用户",
          type: 'error'
        });
      } else {
        let parms = {
          "demendId": this.demendId,
          "userId": this.userSelection
        }
        postAction("/sysDeman/userForDeman", parms).then((data) => {
          if (data && data.code === 200) {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
            this.close()
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
        })
      }
    },

    //选择用户
    handleSelectionChange(val) {
      //绑定角色维护两个，一个是未授权用户的，一个是修改已授权用户的
      this.userSelection = [];
      val.forEach(item => {
          this.userSelection.push(item.userId);
      });
      console.log(this.userSelection)
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
