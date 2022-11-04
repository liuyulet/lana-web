<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="变更历史记录"
      width="60%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-table :data="demandHistroyList" style="width: 100%;font-size: 13px;"  header-row-class-name="table-header">
          <el-table-column align="center" prop="demanName" label="名称" min-width="160">
          </el-table-column>

          <el-table-column align="center" prop="demanNum" label="计划编号" min-width="200" >
          </el-table-column>

          <el-table-column align="center" prop="demanDisoName" label="计划交底文件" min-width="200" >

            <template slot-scope="scope">
              <el-button size="medium" type="text" @click="getFiles(scope.row.demanDisclose)">{{ scope.row.demanDisoName }}</el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="demanProjectNam" label="关联项目" min-width="200" >
          </el-table-column>

          <el-table-column align="center" prop="demanConsciAcoun" label="计划负责人" min-width="140" >
          </el-table-column>

          <el-table-column align="center" prop="createUser" label="创建人"  min-width="160">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
          </el-table-column>
          <el-table-column align="center" prop="demanDeadline" label="结束日期" min-width="160" >
          </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;margin-top: 10px"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

        <div style="height: 50px"></div>
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
      demandHistroyList: {
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
      if (platform == null) {
        this.demandHistroyList.pams = 1
      }else {
        let params = {
          "demandId": platform
        }
        getAction("/sysDemanHistroy/getDeman",params).then((data) => {
          if (data && data.code === 200) {
            this.demandHistroyList = data.result.list
            console.log(data)
          }else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
        })
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
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
