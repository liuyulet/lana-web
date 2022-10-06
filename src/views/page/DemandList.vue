<template>
  <div id="app">
    <div class="page-header">
      <div class="page-title">需求池管理列表</div>
      <div class="page-header-btn">
        <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addParentPlatform">添加新需求</el-button>
        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>
      </div>
    </div>
    <!--设备列表-->
    <el-table :data="demandList" style="width: 100%;font-size: 13px;" :height="winHeight" header-row-class-name="table-header">
      <el-table-column align="center" prop="demanName" label="名称" min-width="160">
      </el-table-column>

      <el-table-column align="center" prop="demanNum" label="任务编号" min-width="200" >
      </el-table-column>

      <el-table-column align="center" prop="demanDisclose" label="需求交底文件" min-width="200" >
      </el-table-column>

      <el-table-column align="center" prop="demanProject" label="关联项目" min-width="200" >
      </el-table-column>

      <el-table-column align="center" prop="demanConsci" label="需求负责人" min-width="140" >

      </el-table-column>

      <el-table-column align="center" prop="demanStatus" label="需求状态"  min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
<!--            1:新建待分配，2：已分配，3:变更中，4：变更完成；
            11:开发中，12:开发完成；
            21:待测试，22:测试中，23:测试完成；
            31:产品代验收，32：验收检查，33:验收完成；
            41：待实施，42：实施中，43:实施完成-->

            <el-tag size="medium" v-if="scope.row.demanStatus == 1">新建</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 2">已分配</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 3">变更中</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 4">变更完成</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 11">开发中</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 12">开发完成</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 13">待测试</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 22">测试中</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 23">测试完成</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 31">产品代验收</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 31">验收检查</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 33">验收完成</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 41">待实施</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 42">实施中</el-tag>
            <el-tag size="medium" v-if="scope.row.demanStatus == 43">实施完成</el-tag>
          </div>
        </template>
      </el-table-column>


      <el-table-column align="center" prop="demanChange" label="变更历史记录" min-width="100" >
      </el-table-column>

      <el-table-column align="center" prop="createUser" label="创建人"  min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
      </el-table-column>
      <!--      <el-table-column prop="updateTime" label="更新时间"  width="140">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="createTime" label="创建时间"  width="140">-->
      <!--      </el-table-column>-->
      <el-table-column align="center" prop="demanDeadline" label="截止日期" min-width="160" >
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="350" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="medium" v-bind:disabled="scope.row.online==0" icon="el-icon-refresh" @click="refDevice(scope.row)"
                     @mouseover="getTooltipContent(scope.row.deviceId)">分配流转
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-edit" type="text" @click="edit(scope.row)">变更</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-delete" v-if="scope.row.demanStatus<2" type="text" @click="deleteDevice(scope.row)" style="color: #f56c6c">删除</el-button>
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
    <deviceEdit ref="deviceEdit"></deviceEdit>
    <syncChannelProgress ref="syncChannelProgress"></syncChannelProgress>
  </div>
</template>

<script>
import {getAction} from "../../api/manage";

export default {
  name: "",
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
    this.getUser();
  },
  methods: {
    //获取需求管理列表
    //用户列表
    getUser() {
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
