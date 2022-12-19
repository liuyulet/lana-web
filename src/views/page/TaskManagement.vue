<template>
  <div id="app">
    <div class="page-header">
      <div class="page-title">任务管理列表</div>
      <div class="page-header-btn">

<!--        查找计划:
        <el-input @input="getPushList" style="margin-right: 1rem; width: auto;" size="mini" placeholder="输入计划名称"
                  prefix-icon="el-icon-search" v-model="searchSrt" clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="ckeckData">搜索</el-button>-->

        我的任务状态:
        <el-select size="mini" style="margin-right: 1rem;" @change="getTaskDeman" v-model="taskStart" placeholder="请选择"
                   default-first-option>
          <el-option label="全部" value=""></el-option>
          <el-option label="未开始" value="3"></el-option>
          <el-option label="进行中" value="1"></el-option>
          <el-option label="已完成" value="4"></el-option>
          <el-option label="我的驳回" value="2"></el-option>
          <el-option label="任务预告" value="0"></el-option>
        </el-select>

      </div>
    </div>
    <!--设备列表-->
    <el-table :data="demandList" style="width: 100%;font-size: 13px;" :height="winHeight"
              header-row-class-name="table-header">
      <el-table-column align="center" prop="planName" label="任务名称" min-width="160">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看该任务的详情信息" placement="top">
            <el-button size="medium" type="text" @click="taskPlan(scope.row)">{{ scope.row.planName }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="demanName" label="所属计划" min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="demanFileName" label="计划交底文件" min-width="160">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击下载计划交底文件" placement="top">
            <el-button size="medium" type="text" @click="getFiles(scope.row.demanFileUrl)">{{
                scope.row.demanFileName
              }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" prop="demanProjectNam" label="所属项目" min-width="200" >
            </el-table-column>-->

      <el-table-column align="center" prop="demanPersName" label="计划负责人" min-width="140">

      </el-table-column>

      <el-table-column align="center" prop="planCreatTime" label="任务创建时间" min-width="140">

      </el-table-column>
      <el-table-column align="center" prop="planEndTime" label="任务完成日期" min-width="140">

      </el-table-column>

      <!--自己任务状态1:进行中，2:驳回，3应做，0待办（刚分配），只有为3的时候才会显示到任务中
      计划中任务的整体数据状态。1:任务被驳回，2:任务完成，3:进行中
      -->
      <el-table-column align="center" prop="taskMeStatus" label="我得任务状态" min-width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tooltip class="item" effect="dark" content="上一个节点的人没有完成，自己是无法接受的哦，但是可以提前看到已经分配给自己的任务。" placement="top">
              <el-tag size="medium" v-if="scope.row.taskMeStatus == 0">任务预告</el-tag>
            </el-tooltip>
            <el-tag size="medium" v-if="scope.row.taskMeStatus == 1">进行中</el-tag>
            <el-tag size="medium" v-if="scope.row.taskMeStatus == 2">驳回</el-tag>
            <el-tooltip class="item" effect="dark" content="上一个节点的人已经完成了，自己可以接受该任务了哦。" placement="top">
              <el-tag size="medium" v-if="scope.row.taskMeStatus == 3">未开始</el-tag>
            </el-tooltip>
            <el-tag size="medium" v-if="scope.row.taskMeStatus == 4">完成</el-tag>
          </div>
        </template>
      </el-table-column>


      <el-table-column align="center" prop="taskDataStatus" label="整体任务情况" min-width="100">

        <template slot-scope="scope">
          <!--              整体数据状态。1:任务被驳回，2:任务完成，3:进行中中-->

          <el-tooltip class="item" effect="dark" content="这里的状态是整条任务的状态哦，不是自己一个人的。可以通过右侧【协作者】查看共同执行这条任务的人员信息。"
                      placement="top">
            <el-tag size="medium" v-if="scope.row.taskDataStatus == 1">驳回</el-tag>
            <el-tag size="medium" v-if="scope.row.taskDataStatus == 2">任务完成</el-tag>
            <el-tag size="medium" v-if="scope.row.taskDataStatus == 3">进行中</el-tag>
          </el-tooltip>
        </template>

      </el-table-column>

      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="medium" icon="el-icon-video-play" type="text" v-if="scope.row.taskMeStatus == 3"
                     @click="startTask(scope.row.id)">开始任务
          </el-button>
          <!-- 点击我已完成，如果是开发人员就需要填写代码提交记录；如果是测试人员，需要填写测试结果；如果是实施人员，需要填写实施信息；如果是产品验收人员，需要填写验收信息； -->
          <el-button size="medium" icon="el-icon-finished" type="text" v-if="scope.row.taskMeStatus == 1"
                     @click="overTask(scope.row.id,1)">完成提交
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="medium" icon="el-icon-s-custom" @click="getLookColla(scope.row.id)">协作者
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="medium" icon="el-icon-right" v-if="scope.row.taskMeStatus == 1"
                     @click="overTask(scope.row.id,0)">驳回任务
          </el-button>
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
    <taskApprovalEdit ref="taskApprovalEdit"></taskApprovalEdit>
    <overTeskEdit ref="overTeskEdit"  @get-task="getTaskDeman"></overTeskEdit>
    <taskCheck ref="taskCheck"></taskCheck>
  </div>
</template>

<script>
import {getAction} from "../../api/manage";
import nextDemdEdit from './edit/nextDemdEdit.vue'
import taskApprovalEdit from './edit/taskApprovalEdit.vue'
import overTeskEdit from './edit/overTeskEdit.vue'
import taskCheck from './edit/taskCheck'

export default {
  name: "",
  components: {
    nextDemdEdit,
    taskApprovalEdit,
    overTeskEdit,
    taskCheck
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      demandList: null,
      taskStart: '',
    }
  },
  computed: {},
  created() {
    this.getTaskDeman();
  },
  methods: {
    //获取需求任务管理列表
    getTaskDeman() {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'taskStart': this.taskStart,
        'userId': localStorage.getItem('userId')
      }
      getAction("/sysDemanUser/getTesk", params).then((data) => {
        if (data && data.code === 200) {
          this.demandList = data.result.list
          //处理数据
          //this.changeRoleData()
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
    getAllOver(demanId) {
      let params = {
        'demanId': demanId.demanId,
      }
      getAction("/sysDemanUser/getAllOver", params).then((data) => {
        if (data && data.code === 200) {
          //处理数据
          //触发下一步方法
          this.getTooltipContent(demanId)
        } else {

          this.$message({
            showClose: true,
            message: '还有未完成的协作者，无法进行下一步',
            type: 'error'
          });

        }
      })
    },
    //完成任务，填写代码提交记录
    overTask(planItemId,submitType) {
      //提交任务完成信息
      this.$refs.overTeskEdit.openDialog(planItemId,submitType, this.initData)
    },

    //查看需求
    taskPlan(planData) {
      this.$refs.taskCheck.openDialogs(planData, 1, this.initData)
    },
    //查看协作者信息
    getLookColla(id) {
      this.$refs.taskApprovalEdit.openDialog(id, 0, this.initData)
    },


    getFiles(fileUrl) {
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
