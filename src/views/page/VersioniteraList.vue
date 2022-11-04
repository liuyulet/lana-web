<template>
  <div id="app">
    <div class="page-header">
      <div class="page-title">协作过程列表</div>
      <div class="page-header-btn">
        <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addPlatform">创建协作过程</el-button>
        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>
      </div>
    </div>
    <!--设备列表-->
    <el-table :data="stepList" style="width: 100%;font-size: 13px;" :height="winHeight" header-row-class-name="table-header">
      <el-table-column align="center" prop="stepName" label="协作过程名称" min-width="250">
      </el-table-column>

      <el-table-column align="center" prop="stepNum" label="过程节点数" min-width="50" >
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="findStep(scope.row)">{{ scope.row.stepNum }}</el-button>
        </template>

      </el-table-column>

      <el-table-column align="center" prop="createUser" label="创建人"  min-width="160">
      </el-table-column>

      <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
      </el-table-column>


      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="medium" icon="el-icon-edit" type="text" @click="editStep(scope.row)">修改</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteStep(scope.row.stepId)" style="color: #f56c6c">删除</el-button>
        </template>
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
    <versioniteraEdit ref="versioniteraEdit" @get-step="getStep"></versioniteraEdit>
    <versionDtiolEdit ref="versionDtiolEdit" @get-step="getStep"></versionDtiolEdit>
  </div>
</template>

<script>
import {getAction} from "../../api/manage";
import versioniteraEdit from "./edit/versioniteraEdit";
import versionDtiolEdit from "./edit/versionDtiolEdit";

export default {
  name: "",
  components: {
    versioniteraEdit,
    versionDtiolEdit
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      stepList: null
    }
  },
  computed: {

  },
  created() {
    this.getStep();
  },
  methods: {
    //获取需求管理列表
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
    //新增项目
    addPlatform() {
      this.$refs.versioniteraEdit.openDialog(null, this.initData)
    },
    //查看节点信息
    findStep(step){
      this.$refs.versionDtiolEdit.openDialog(step, this.initData)
    },
    //修改项目
    editStep(step) {
      this.$refs.versioniteraEdit.openDialog(step, this.initData)
    },
    deleteStep(stepId){
      this.$confirm(`删除无法恢复，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'stepId': stepId
        }
        getAction("/sysStep/delstep",params).then((data) => {
          if (data && data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            //更新数据
            this.getStep();
          }
        })
      })
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

}

</script>

<style>
/*定义标题栏*/
.page-header {
  background-color: #FFFFFF;
  margin-bottom: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-weight: bold;
  text-align: left;
}

.page-header-btn {
  text-align: right;
}
.el-table-column {
  text-align: center;
}

</style>
