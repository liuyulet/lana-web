<template>
  <div id="app">
    <div class="page-header">
      <div class="page-title">任务管理列表</div>
      <spen style="color: darkcyan ">请在结束日期之前完成哦，如果有疑问请找分配人员协商！</spen>
      <div class="page-header-btn">



<!--        <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addDemandPlatform">添加新需求</el-button>
        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>-->
      </div>
    </div>
    <!--设备列表-->
    <el-table :data="demandList" style="width: 100%;font-size: 13px;" :height="winHeight" header-row-class-name="table-header">
      <el-table-column align="center" prop="demanName" label="名称" min-width="160">
      </el-table-column>

      <el-table-column align="center" prop="demanNum" label="任务编号" min-width="200" >
      </el-table-column>

      <el-table-column align="center" prop="demanDisoName" label="需求交底文件" min-width="200" >

        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="getFiles(scope.row.demanDisclose)">{{ scope.row.demanDisoName }}</el-button>
        </template>

      </el-table-column>


      <el-table-column align="center" prop="demanProjectNam" label="所属项目" min-width="200" >
      </el-table-column>

      <el-table-column align="center" prop="demanConsciAcoun" label="需求负责人" min-width="140" >

      </el-table-column>

      <el-table-column align="center" prop="taskStatus" label="任务状态"  min-width="160">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-if="scope.row.taskStatus == 0">未开始</el-tag>
            <el-tag size="medium" v-if="scope.row.taskStatus == 1">进行中</el-tag>
            <el-tag size="medium" v-if="scope.row.taskStatus == 2">已完成</el-tag>
            <el-tag size="medium" v-if="scope.row.taskStatus == 3">已到下一阶段</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="demanDeadline" label="结束日期" min-width="160" >
      </el-table-column>


      <el-table-column align="center" prop="createTime" label="分配日期" min-width="160" >
      </el-table-column>
      <el-table-column align="center" prop="createUser" label="分配人员" min-width="160" >
      </el-table-column>

<!--      <el-table-column align="center" prop="createUser" label="创建人"  min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
      </el-table-column>-->
      <!--      <el-table-column prop="updateTime" label="更新时间"  width="140">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="createTime" label="创建时间"  width="140">-->
      <!--      </el-table-column>-->
<!--      <el-table-column align="center" prop="demanDeadline" label="截止日期" min-width="160" >
      </el-table-column>-->

      <el-table-column align="center" label="操作" min-width="350" fixed="right">
        <template slot-scope="scope">
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-video-play" v-if="scope.row.taskStatus == 0" type="text" @click="startTask(scope.row.id)">开始任务</el-button>
          <!-- 点击我已完成，如果是开发人员就需要填写代码提交记录；如果是测试人员，需要填写测试结果；如果是实施人员，需要填写实施信息；如果是产品验收人员，需要填写验收信息； -->
          <el-button size="medium" icon="el-icon-finished" v-if="scope.row.taskStatus == 1" type="text" @click="overTask(scope.row.id)">我已完成</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="medium"  icon="el-icon-s-custom"
                     v-if="scope.row.demanStatus<13" @click="getLookColla(scope.row.demanId)">协作者
          </el-button>
          <el-button type="text" size="medium" v-if="scope.row.taskStatus==2" icon="el-icon-right"
                      @click="getNext(scope.row)">下一步
          </el-button>
          <el-divider direction="vertical"></el-divider>
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
    <nextDemdEdit ref="nextDemdEdit"></nextDemdEdit>
    <collaboratorsEdit ref="collaboratorsEdit"></collaboratorsEdit>
    <overTeskEdit ref="overTeskEdit"></overTeskEdit>

  </div>
</template>

<script>
import {getAction} from "../../api/manage";
import nextDemdEdit from './edit/nextDemdEdit.vue'
import collaboratorsEdit from './edit/collaboratorsEdit.vue'
import overTeskEdit from './edit/overTeskEdit.vue'
export default {
  name: "",
  components:{
    nextDemdEdit,
    collaboratorsEdit,
    overTeskEdit
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
    this.getTaskDeman();
  },
  methods: {
    //获取需求管理列表
    getTaskDeman() {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'userId': localStorage.getItem('userId')
      }
      getAction("/sysTask/getDemanTask", params).then((data) => {
        if (data && data.code === 200) {
          this.demandList = data.result.list
          //处理数据
          this.changeRoleData()
          this.totalPage = data.result.totalCount
        }
      })
    },
    //开始任务
    startTask(id) {
      let params = {
        'taskId': id,
      }
      getAction("/sysDemanUser/updateTesk", params).then((data) => {
        if (data && data.code === 200) {
          //处理数据
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              //更新删除后的用户信息
              this.getTaskDeman()
            }
          })
        }
      })
    },
    getNext(demanId) {
      this.getAllOver(demanId);
    },
    getAllOver(demanId){
      let params = {
        'demanId': demanId.demanId,
      }
      getAction("/sysDemanUser/getAllOver", params).then((data) => {
        if (data && data.code === 200) {
          //处理数据
            //触发下一步方法
            this.getTooltipContent(demanId)
        }else {

          this.$message({
            showClose: true,
            message: '还有未完成的协作者，无法进行下一步',
            type: 'error'
          });

        }
      })
    },
    //完成任务，填写代码提交记录
    overTask(demanId) {
      //提交任务完成信息
      this.$refs.overTeskEdit.openDialog(demanId, this.initData)
    },

    //查看协作者信息
    getLookColla(demanId){
      this.$refs.collaboratorsEdit.openDialog(demanId, this.initData)
    },
    //下一步
    getTooltipContent(demandData) {
      this.$confirm(`下一步指定之后，将无法进行回退，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.nextDemdEdit.openDialog(demandData, this.initData)
      })
    },

    getFiles (fileUrl){
      window.open(fileUrl);
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getAllOver()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getAllOver()
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
