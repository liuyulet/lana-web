<template>
  <div id="app">
    <div class="page-header">
      <div class="page-title">计划管理列表</div>
      <div class="page-header-btn">
        <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addDemandPlatform">添加新计划</el-button>
        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>
      </div>
    </div>
    <!--设备列表-->
    <el-table :data="demandList" style="width: 100%;font-size: 13px;" :height="winHeight" header-row-class-name="table-header">
      <el-table-column align="center" prop="demanName" label="计划名称" min-width="160">
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

      <el-table-column align="center" prop="demanStatus" label="计划状态状态"  min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-if="scope.row.demanStatus == 1">新建</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 2">执行中</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 3">完成</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="demanChange" label="计划变更记录"  min-width="100" >
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="changeDemEdit(scope.row.id)">{{ scope.row.demanChange }}</el-button>
        </template>

      </el-table-column>

      <el-table-column align="center" prop="createUser" label="创建人"  min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
      </el-table-column>
      <!--      <el-table-column prop="updateTime" label="更新时间"  width="140">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="createTime" label="创建时间"  width="140">-->
      <!--      </el-table-column>-->
      <el-table-column align="center" prop="demanDeadline" label="结束日期" min-width="160" >
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="350" fixed="right">
        <template slot-scope="scope">
<!--          <el-button type="text" size="medium" v-bind:disabled="scope.row.online==0" icon="el-icon-refresh"
                     v-if="scope.row.demanStatus<2" @click="getTooltipContent(scope.row.id)">需求分配
          </el-button>-->
          <el-button size="medium" icon="el-icon-edit" type="text" @click="getTooltipContent(scope.row.id)">维护</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-edit" type="text" @click="editDemandPlatform(scope.row)">变更</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-view" type="text" @click="demandStatus(scope.row.id)">进度</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-delete" v-if="scope.row.demanStatus<2" type="text" @click="deleteDemand(scope.row.id)" style="color: #f56c6c">删除</el-button>

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
    <demandEdit ref="demandEdit"></demandEdit>

    <changeDemEdit ref="changeDemEdit"></changeDemEdit>

    <assignDemdEdit ref="assignDemdEdit"></assignDemdEdit>

    <collaboratorsEdit ref="collaboratorsEdit"></collaboratorsEdit>
  </div>
</template>

<script>
import {getAction} from "../../api/manage";
import demandEdit from './edit/demandEdit.vue'
import changeDemEdit from './edit/changeDemEdit.vue'
import assignDemdEdit from './edit/assignDemdEdit.vue'
import collaboratorsEdit from './edit/collaboratorsEdit.vue'
export default {
  name: "",
  components:{
    demandEdit,
    changeDemEdit,
    assignDemdEdit,
    collaboratorsEdit
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      demandList: null
    }
  },
  computed: {

  },
  created() {
    this.getDeman();
  },
  methods: {
    //获取需求管理列表
    getDeman() {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize
      }
      getAction("/sysDeman/getDeman", params).then((data) => {
        if (data && data.code === 200) {
          this.demandList = data.result.list
          //处理数据
          this.changeRoleData()
          this.totalPage = data.result.totalCount
        }
      })
    },
    //需求状态
    demandStatus(demanId){
      this.$refs.collaboratorsEdit.openDialog(demanId, this.initData)
    },
    //新增需求
    addDemandPlatform() {
      this.$refs.demandEdit.openDialog(null, this.initData)
    },
    //变更需求
    editDemandPlatform(demandData) {
      this.$refs.demandEdit.openDialog(demandData, this.initData)
    },

    //需求变更历史
    changeDemEdit(demandData) {
      this.$refs.changeDemEdit.openDialog(demandData, this.initData)
    },
    //变更需求
    getTooltipContent(demandData) {
        this.$refs.assignDemdEdit.openDialog(demandData, this.initData)
    },

    getFiles (fileUrl){
      window.open(fileUrl);
    },

    deleteDemand (id) {
      let params = {
        'id': id
      }
      this.$confirm(`该需求没有被分配，可以删除，是否要删掉?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAction("/sysDeman/delDeman", params).then((data) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                //更新删除后的用户信息
                this.getDeman()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
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
