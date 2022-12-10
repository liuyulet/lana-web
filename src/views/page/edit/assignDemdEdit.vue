<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="计划内容维护"
      width="90%"
      height="100%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div style="text-align: center;">
        <el-button type="primary" v-if="!this.edits" @click="planAdd">新增任务项</el-button>
      </div>
      <!--    用户信息-->
        <el-table
            :data="palnItem"
            style="width: 100%;font-size: 13px;margin-top: 2rem;"
            header-row-class-name="table-header">

          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column align="center" prop="planName" label="名称" min-width="200" >
            <template slot-scope="scope">
              <el-button size="medium" type="text"@click="planEdit(scope.row)">{{scope.row.planName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center"  label="计划内要求内容描述" min-width="300">
            <template slot-scope="scope">
              {{scope.row.planCont.substring(0,50)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="120">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" v-if="scope.row.planStatus == 0">新建</el-tag>
                <el-tag size="medium" type="success" v-if="scope.row.planStatus == 1">进行中</el-tag>
                <el-tag size="medium" type="success" v-if="scope.row.planStatus == 2">驳回</el-tag>
                <el-tag size="medium" type="success" v-if="scope.row.planStatus == 3">完成</el-tag>
                <el-tag size="medium" type="success" v-if="scope.row.planStatus == 4">已分配</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="username" label="操作" min-width="200">
            <template slot-scope="scope">
            <el-button size="medium" icon="el-icon-edit" v-if="scope.row.planStatus == 0 || scope.row.planStatus == 2" type="text" @click="planEdit(scope.row)">编辑</el-button>
            <el-divider direction="vertical"v-if="scope.row.planStatus == 0 || scope.row.planStatus == 2" ></el-divider>
            <el-button size="medium" icon="el-icon-edit" v-if="scope.row.planStatus == 0 || scope.row.planStatus == 2" type="text" @click="binDing(scope.row.id,scope.row.planName)">绑定过程</el-button>
            <el-button size="medium" icon="el-icon-edit" v-if="scope.row.planStatus == 4 || scope.row.planStatus == 1 || scope.row.planStatus == 3" type="text" @click="checkPrecee(scope.row.id)">进度查看</el-button>
            <el-divider direction="vertical" ></el-divider>
            <el-button size="medium" icon="el-icon-edit" v-if="scope.row.planStatus == 0 || scope.row.planStatus == 2" type="text">指定人员</el-button>
            <el-button size="medium" icon="el-icon-edit" v-if="scope.row.planStatus == 4 " type="text">撤销绑定</el-button>
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
        <div style="margin-top: 50px;text-align: center;">
            <el-button @click="close">关闭</el-button>
        </div>
    </el-dialog>
    <planTaskEdit ref="planTaskEdit" @get-planiteams="getPalnItem"></planTaskEdit>
    <binDingEdit ref="binDingEdit" @get-planiteams="getPalnItem"></binDingEdit>

  </div>
</template>

<script>
import {getAction,postAction} from "../../../api/manage";
import planTaskEdit from './planTaskEdit'
import binDingEdit from './binDingEdit'
export default {
  name: "orgEdit",
  components: {
    planTaskEdit,
    binDingEdit
  },
  data() {
    return {
      demendData: null,
      edits: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      userSelection: '',
      palnItem: {

      },

      rules: {
      },
    };
  },

  methods: {
    openDialog(platform, callback) {
      //console.log(platform);
      //判断是新增还是修改
      if (platform == null) {


      }else {
        this.demendData = platform
        this.getPalnItem(platform);
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    //新增需求planAdd
    planAdd() {
      this.$refs.planTaskEdit.openDialogs(this.demendData,0, this.initData)
    },
    //编辑需求planAdd
    planEdit(planData) {
      this.$refs.planTaskEdit.openDialogs(planData,1, this.initData)
    },

    //任务绑定流程
    binDing(id,planItemName) {
      this.$refs.binDingEdit.openDialogz(id,planItemName,this.demendData.demanName, this.initData)
    },

    //获取r任务计划列表
    getPalnItem(platform) {
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'planDemanId': platform.id
      }
      getAction("/palnItem/getPalnItem", params).then((data) => {
        if (data && data.code === 200) {
          this.palnItem = data.result.list
          //处理数据
          this.totalPage = data.result.totalCount
        }
      })
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getPalnItem(this.demendData.id)
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getPalnItem(this.demendData.id)
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
