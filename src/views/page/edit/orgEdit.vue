<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="添加组织"
      width="30%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-row >
          <el-col :span="20">
            <el-form :rules="rules" :model="orgEdit" label-width="160px">
              <el-form-item  label="机构名称" prop="departName">
                <el-input v-model="orgEdit.departName" placeholder="机构名称请区分明确，不要重复哦"></el-input>
              </el-form-item>
              <el-form-item label="机构编码" prop="departCode">
                <el-input v-model="orgEdit.departCode" placeholder="机构唯一编码"></el-input>
              </el-form-item>
              <el-form-item  label="上级机构" prop="parentId">
                <el-select class="selects"  v-model="orgEdit.parentId" placeholder="请选择">
                  <el-option
                      v-for="item in organizaDataList"
                      :key="item.id"
                      :label="item.departName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
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
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      organizaDataList: null,
      orgEdit: {
        departName: '',
        departCode: '',
        parentId: '',
      },
      rules: {
        departName: [{ required: true, message: "组织机构名称不可为空", trigger: "blur" }],
        departCode: [{ required: true, message: "组织机构编码不可为空", trigger: "blur" }],
      },
    };
  },

  methods: {
    openDialog: function (platform, callback) {
      getAction("/sysDepart/getDepart").then((data) => {
        if (data && data.code === 200) {
          this.organizaDataList = data.result
        }else {
          this.$message({
            showClose: true,
            message: '获取组织信息失败，请联系管理员',
            type: 'error'
          });
        }
      })
      this.showDialog = true;
      this.listChangeCallback = callback;
    },
    onSubmit () {
      let params = {
        departName: this.orgEdit.departName,
        departCode: this.orgEdit.departCode,
        parentId: this.orgEdit.parentId,
        createUser: localStorage.getItem('userAccount')
      }
      postAction("/sysDepart/addDepart",params).then((data) => {
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
