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
                :data="organizaDataList"
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
    <el-table :data="allSessionData"  style="margin-top: 1rem;">
      <el-table-column align="center" prop="peer_ip" label="姓名" ></el-table-column>
      <el-table-column align="center" prop="peer_ip" label="账号" ></el-table-column>
      <el-table-column align="center" prop="peer_ip" label="手机" ></el-table-column>
      <el-table-column align="center" prop="peer_ip" label="邮箱" ></el-table-column>
      <el-table-column align="center" prop="local_ip" label="所属角色"></el-table-column>
      <el-table-column align="center" prop="typeid" label="所属组织"></el-table-column>
      <el-table-column align="center" label="操作" >
        <template v-slot:default="scope" >
          <el-button size="mini" icon="el-icon-refresh-right" circle @click="getAllSession()"></el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, allSessionData)" type="text" size="small">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
import { isNull,treeDataTranslate } from "../../utils/utils.js";

export default {
  name: "",
  components: {},
  props: {},
  watch: {},
  data() {
    return {
      organizaDataList: [
        {
          city: "唐山市",
          createdTime: "2021-12-27 17:15:36",
          deleted: 0,
          districtCounty: "路北区",
          id: 6,
          lastUpdatedTime: "2022-02-22 16:34:31",
          name: "中信银行",
          optimisticLock: 1,
          parentId: 7,
          province: "河北省",
          supervisePastures: "[3]",
          type: 3,
        },
        {
          city: "成都市",
          createdTime: "2022-01-20 14:38:45",
          deleted: 0,
          districtCounty: "锦江区",
          id: 7,
          lastUpdatedTime: "2022-02-24 11:09:01",
          name: "金投银行",
          optimisticLock: 1,
          parentId: 0,
          province: "四川省",
          supervisePastures: "[1,2]",
          type: 3,
        },
        {
          city: "成都市",
          createdTime: "2022-01-20 14:39:02",
          deleted: 0,
          districtCounty: "锦江区",
          id: 8,
          lastUpdatedTime: "2022-02-24 11:09:02",
          name: "中国建设银行",
          optimisticLock: 1,
          parentId: 0,
          province: "四川省",
          supervisePastures: "[1,2]",
          type: 3,
        },
        {
          city: "成都市",
          createdTime: "2022-01-28 14:26:28",
          deleted: 0,
          districtCounty: "锦江区",
          id: 9,
          lastUpdatedTime: "2022-02-24 11:09:02",
          name: "中信银行成都分行",
          optimisticLock: 1,
          parentId: 6,
          province: "四川省",
          supervisePastures: "[1,2,3,4,5,6,7,8,9,10]",
          type: 3,
        },
        {
          city: "成都市",
          createdTime: "2022-01-28 14:26:39",
          deleted: 0,
          districtCounty: "锦江区",
          id: 10,
          lastUpdatedTime: "2022-02-24 11:09:02",
          name: "中信银行成都分行娇子大道支行",
          optimisticLock: 1,
          parentId: 9,
          province: "四川省",
          supervisePastures: null,
          type: 3,
        },
        {
          city: "绵阳市",
          createdTime: "2022-01-28 14:27:08",
          deleted: 0,
          districtCounty: "锦江区",
          id: 11,
          lastUpdatedTime: "2022-02-24 11:09:02",
          name: "中信银行绵阳分行",
          optimisticLock: 1,
          parentId: 6,
          province: "四川省",
          supervisePastures: null,
          type: 3,
        },
        {
          city: "成都市",
          createdTime: "2022-02-08 14:44:27",
          deleted: 0,
          districtCounty: "锦江区",
          id: 15,
          lastUpdatedTime: "2022-02-24 11:09:02",
          name: "招商银行",
          optimisticLock: 1,
          parentId: 0,
          province: "四川省",
          supervisePastures: "[]",
          type: 3,
        }
      ],
      organizaColumns: [
        { label: "组织名称", props: "name", width: "" },
        { label: "创建时间", props: "createdTime", width: "" },
      ],

      roleColumns: [
        { label: "角色名称", props: "name", width: "" },
        { label: "创建时间", props: "createdTime", width: "" },
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
    this.changeData()
  },
  mounted() {},
  methods: {
    // 树形数据转换
    changeData() {
      this.organizaDataList = treeDataTranslate( this.organizaDataList, 'id')
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
  }
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
