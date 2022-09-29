<template>
  <div id="app" style="width: 98%;margin: auto;">
    <div class="page-header">
      <div class="page-title">组织角色管理</div>
      <div class="page-header-btn">
        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>
      </div>
    </div>
    <!--组织信息-->
    <el-row style="width: 100%">
      <el-col :span="12">
        <div class="control-table" id="ThreadsLoad" style="margin-right:10px;">
            <div class="table-box">
              <el-table
                :data="organizaDataList"
                height="400"
                row-key="id"
                border
                style="width: 100%;"
                :cell-style="columnStyle"
                :header-cell-style="headerStyle"
              >
                <el-table-column
                  v-for="(item,index) in organizaColumns"
                  :key="index"
                  :label="item.label"
                  :prop="item.props"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    <span>{{ JudgmentData(scope.row[item.props])?scope.row[item.props]: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  width="240"
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operation">
                      <div>
                        <el-button type="primary" plain size="small" >修改</el-button>
                        <el-button type="danger" plain size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
      </el-col>

<!--      角色信息-->
      <el-col :span="12">
        <div class="control-table" id="WorkThreadsLoad" style="margin-left:10px;">
            <div class="table-box">
              <el-table
                :data="roleizaDataList"
                height="400"
                row-key="id"
                border
                style="width: 100%;"
                :cell-style="columnStyle"
                :header-cell-style="headerStyle"
              >
                <el-table-column
                  v-for="(item,index) in roleColumns"
                  :key="index"
                  :label="item.label"
                  :prop="item.props"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    <span>{{ JudgmentData(scope.row[item.props])?scope.row[item.props]: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  width="240"
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operation">
                      <div>
                        <el-button type="primary" plain size="small" >修改</el-button>
                        <el-button type="danger" plain size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </div>
      </el-col>
    </el-row>

<!--    用户信息-->
    <el-table :data="uerDataList" style="width: 100%;font-size: 13px;" :height="winHeight" header-row-class-name="table-header">
      <el-table-column align="center" prop="fullname" label="姓名" min-width="200">
      </el-table-column>

      <el-table-column align="center" prop="username" label="用户账号名" min-width="200" >
      </el-table-column>


      <el-table-column align="center" prop="email" label="邮箱" min-width="140" >

      </el-table-column>

      <el-table-column align="center" prop="mobile" label="手机号" min-width="120" >
      </el-table-column>

      <el-table-column align="center" label="status" min-width="120">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="medium" type="info" v-if="scope.row.status == 0">禁用</el-tag>
            <el-tag size="medium" type="info" v-if="scope.row.status == 2">新注册</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="keepaliveTime" label="负责部门" min-width="160" >
      </el-table-column>
      <el-table-column align="center" prop="keepaliveTime" label="所属部门" min-width="160" >
      </el-table-column>
      <el-table-column align="center" prop="registerTime" label="所属角色"  min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"  min-width="160">
      </el-table-column>
      <el-table-column align="center" prop="createUserId" label="创建人"  min-width="160">
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="450" fixed="right">
        <template slot-scope="scope">
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteDevice(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-size="count"
        :page-sizes="[15, 25, 35, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total">
    </el-pagination>

  </div>
</template>


<script>
import { isNull,treeDataTranslate } from "../../utils/utils.js";
import { postAction, getAction,deleteAction,putAction} from '../../api/manage'

export default {
  name: "",
  components: {},
  props: {},
  watch: {},
  data() {
    return {
      uerDataList:null,
      organizaDataList: [],
      roleizaDataList: [],
      organizaColumns: [
        { label: "组织名称", props: "departName", width: "" },
        { label: "创建时间", props: "createTime", width: "" },
      ],

      roleColumns: [
        { label: "角色名称", props: "roleName", width: "" },
        { label: "创建时间", props: "createTime", width: "" },
      ],
    };
  },
  computed: {
    JudgmentData() {
      return (data)=>{
        let status = !isNull(data)
        return status
      }
    }
  },
  created() {
    //this.changeData()
    this.getDeparts();
    this.getRoles();
    this.getUser();
  },
  mounted() {

  },
  methods: {

    // 组织信息
    getDeparts() {
      getAction("/sysDepart/getDepart").then((data) => {
        if (data && data.code === 200) {
          this.organizaDataList = data.result
          this.changeData()
        }
      })
    },
    //角色信息
    getRoles() {
      getAction("/sys/role/getRoleList").then((data) => {
        if (data && data.code === 200) {
          this.roleizaDataList = data.result
          this.changeRoleData()
        }
      })
    },
    //用户列表
    getUser() {
      getAction("/sys/user/getUser").then((data) => {
        if (data && data.code === 200) {
          this.uerDataList = data.result
          this.changeRoleData()
        }
      })
    },
    changeData() {
      this.organizaDataList = treeDataTranslate( this.organizaDataList, 'id')
    },
    changeRoleData() {
      this.organizaDataList = treeDataTranslate( this.organizaDataList, 'roleId')
    },
    // 更改单元格样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if(column.property === "name") {
        return {
          height: "45px",
          // 'padding': '0px',
          'text-align': 'left',
          "padding-left": '50px',
        };
      }else {
        return {
          height: "45px",
          'padding': '0px',
          'text-align': 'center',
        };
      }
    },
    // 更改表头单元格样式
    headerStyle({ row, column, rowIndex, columnIndex }) {
      return {
        height: "45px",
        'background': '#EEF4FF',
        'padding': '0px',
        'text-align': 'center',
        'color': '#333333',
        'font-size': '14px',
        'font-weight': 400,
      };
    },
    deleteHandle() {},
  },

};



</script>

<style>

#app {
  height: 100%;
}
.table-box {

    /deep/ .el-table__row:not([class*='el-table__row--level-']) {
    td:first-child {
      padding-left: 72px !important;
    }
  }
}
.text-cents {
  text-align: center;
}
@import url('../../styles/home.scss');


</style>
