<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="维护角色菜单"
      width="30%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-table
            ref="multipleTable"
            :data="roleMenuDataList"
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
          <el-table-column align="center" prop="name" label="菜单名称" min-width="200">
          </el-table-column>
          <el-table-column align="center" prop="url" label="菜单路径" min-width="200">
          </el-table-column>
        </el-table>
        <div style="margin-top: 2%;">
          <el-button type="primary" v-if="!this.edits" @click="onSubmit">保存</el-button>
          <el-button @click="close">取消</el-button>
        </div>
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
      roleMenuDataList: null,
      userSelection: [],
      userUpdaSelectionRole: [],
      roleId: '',
      roleMenuData: {
        userId: '',
      },
      rules: {
      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {
      //console.log(platform);
      //判断是新增还是修改
      if (platform != null) {
        this.roleId = platform
        let params = {
          roleId: platform
        }
        getAction("/sysMenu/navList",params).then((data) => {
          if (data && data.code === 200) {
            this.roleMenuDataList = data.result.AllMenu
            //已选的数据处理   HavaMenu

            this.$nextTick(() => {
              if (data.result.HavaMenu.length > 0) {
                //每次进入之后置为空
                this.userSelection = []
                for (let i = 0; i < data.result.HavaMenu.length; i++) {
                  for (let j = 0; j < data.result.AllMenu.length; j++) {
                    if (data.result.HavaMenu[i].menuId === data.result.AllMenu[j].menuId) {
                      //如果相等，则记录下这个行号，将数据默认选择上；
                      this.userSelection.push(data.result.AllMenu[j])
                    }
                  }
                }
                //触发默认选中机制
                this.toggleSelection(this.userSelection)
              }
            })

          }else {
            this.$message({
              showClose: true,
              message: '获取组织信息失败，请联系管理员',
              type: 'error'
            });
          }
        })

      }else {
        //如果没有角色id，则提示错误信息
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    handleSelectionChange(val) {
      this.userUpdaSelectionRole = [];
      val.forEach(item => {
        //处理角色
        if (item.menuId != null && item.menuId != '') {
          this.userUpdaSelectionRole.push(item.menuId);
        }
      });
    },

    onSubmit () {
      let params = {
        "roleId": this.roleId,
        "menuUpdateId": this.userUpdaSelectionRole
      }
      postAction("/sysMenu/roleForMenu",params).then((data) => {
        if (data && data.code === 200) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.close()
        }else {
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      })
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
