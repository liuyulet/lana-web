<template>
  <div id="addlatform" v-loading="isLoging">
    <el-dialog
      title="添加组织"
      width="50%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="text-align: right; margin-top: 1rem">
        <el-row >
          <el-col :span="20">
            <el-form ref="platform1" :rules="rules" :model="platform" label-width="160px">
              <el-form-item label="机构名称" prop="name">
                <el-input v-model="platform.name" placeholder="机构名称请区分明确，不要重复哦"></el-input>
              </el-form-item>
              <el-form-item label="机构编码" prop="serverGBId">
                <el-input v-model="platform.serverGBId" clearable @input="serverGBIdChange" placeholder="机构编码唯一"></el-input>
              </el-form-item>
              <el-form-item label="所属机构" prop="serverGBDomain">
                <el-input v-model="platform.serverGBDomain" clearable placeholder="请输选择所属机构"></el-input>
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
export default {
  name: "orgEdit",
  props: {},
  computed: {},
  data() {
    return {
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      saveUrl: "/api/platform/save",

      platform: {
        id: null,
        enable: true,
        ptz: true,
        rtcp: false,
        name: null,
        serverGBId: null,
        serverGBDomain: null,
        serverIP: null,
        serverPort: null,
        deviceGBId: null,
        deviceIp: null,
        devicePort: null,
        username: null,
        password: null,
        expires: 300,
        keepTimeout: 60,
        transport: "UDP",
        characterSet: "GB2312",
        startOfflinePush: false,
        catalogGroup: 1,
        administrativeDivision: null,
        treeType: "BusinessGroup",
      },
      rules: {
        name: [{ required: true, message: "请输入平台名称", trigger: "blur" }],
        serverGBId: [
          { required: true, message: "请输入SIP服务国标编码", trigger: "blur" },
        ],
        serverGBDomain: [
          { required: true, message: "请输入SIP服务国标域", trigger: "blur" },
        ],
        serverIP: [{ required: true, message: "请输入SIP服务IP", trigger: "blur" }],
        serverPort: [{ required: true, message: "请输入SIP服务端口", trigger: "blur" }],
        username: [{ required: false, message: "请输入SIP认证用户名", trigger: "blur" }],
        password: [{ required: false, message: "请输入SIP认证密码", trigger: "blur" }],
        expires: [{ required: true, message: "请输入注册周期", trigger: "blur" }],
        keepTimeout: [{ required: true, message: "请输入心跳周期", trigger: "blur" }],
        transport: [{ required: true, message: "请选择信令传输", trigger: "blur" }],
        characterSet: [{ required: true, message: "请选择编码字符集", trigger: "blur" }],
      },
    };
  },
  methods: {
    openDialog: function (platform, callback) {
      var that = this;
      if (platform == null) {
        this.saveUrl = "/api/platform/add";
        this.$axios({
          method: 'get',
          url:`/api/platform/server_config`
        }).then(function (res) {
          console.log(res);
          if (res.data.code === 0) {
            that.platform.deviceGBId = res.data.data.username;
            that.platform.deviceIp = res.data.data.deviceIp;
            that.platform.devicePort = res.data.data.devicePort;
            that.platform.username = res.data.data.username;
            that.platform.password = res.data.data.password;
            that.platform.treeType = "BusinessGroup";
            that.platform.administrativeDivision = res.data.data.username.substr(0, 6);
          }

        }).catch(function (error) {
          console.log(error);
        });
      }else {
        this.platform.id = platform.id;
        this.platform.enable = platform.enable;
        this.platform.ptz = platform.ptz;
        this.platform.rtcp = platform.rtcp;
        this.platform.name = platform.name;
        this.platform.serverGBId = platform.serverGBId;
        this.platform.serverGBDomain = platform.serverGBDomain;
        this.platform.serverIP = platform.serverIP;
        this.platform.serverPort = platform.serverPort;
        this.platform.deviceGBId = platform.deviceGBId;
        this.platform.deviceIp = platform.deviceIp;
        this.platform.devicePort = platform.devicePort;
        this.platform.username = platform.username;
        this.platform.password = platform.password;
        this.platform.expires = platform.expires;
        this.platform.keepTimeout = platform.keepTimeout;
        this.platform.transport = platform.transport;
        this.platform.characterSet = platform.characterSet;
        this.platform.catalogId = platform.catalogId;
        this.platform.startOfflinePush = platform.startOfflinePush;
        this.platform.catalogGroup = platform.catalogGroup;
        this.platform.administrativeDivision = platform.administrativeDivision;
        this.platform.treeType = platform.treeType;
        this.saveUrl = "/api/platform/save";
      }
      this.showDialog = true;
      this.listChangeCallback = callback;
    },
    serverGBIdChange: function () {
      if (this.platform.serverGBId.length > 10) {
        this.platform.serverGBDomain = this.platform.serverGBId.substr(0, 10);
      }
    },
    deviceGBIdChange: function () {

      this.platform.username = this.platform.deviceGBId ;
      if (this.platform.administrativeDivision == null) {
        this.platform.administrativeDivision = this.platform.deviceGBId.substr(0, 6);
      }

    },
    onSubmit: function () {
      this.saveForm()
    },
    saveForm: function (){
      this.$axios({
        method: 'post',
        url: this.saveUrl,
        data: this.platform
      }).then((res) =>{
        if (res.data.code === 0) {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success",
          });
          this.showDialog = false;
          if (this.listChangeCallback != null) {
            this.listChangeCallback();
          }
        }else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error",
          });
        }
      }).catch((error)=> {
        console.log(error);
      });
    },
    close: function () {
      this.showDialog = false;
      this.$refs.platform1.resetFields();
      this.$refs.platform2.resetFields();
      this.platform = {
        id: null,
        enable: true,
        ptz: true,
        rtcp: false,
        name: null,
        serverGBId: null,
        administrativeDivision: null,
        serverGBDomain: null,
        serverIP: null,
        serverPort: null,
        deviceGBId: null,
        deviceIp: null,
        devicePort: null,
        username: null,
        password: null,
        expires: 300,
        keepTimeout: 60,
        transport: "UDP",
        characterSet: "GB2312",
        treeType: "BusinessGroup",
        startOfflinePush: false,
        catalogGroup: 1,
      }
    },
    deviceGBIdExit: async function (deviceGbId) {
      var result = false;
      var that = this;
      await that.$axios({
                method: 'get',
                url:`/api/platform/exit/${deviceGbId}`})
        .then(function (res) {
            if (res.data.code === 0) {
              result = res.data.data;
            }
        })
        .catch(function (error) {
          console.log(error);
        });
      return result;
    },
    checkExpires: function() {
      if (this.platform.enable && this.platform.expires == "0") {
        this.platform.expires = "300";
      }
    },
    rtcpCheckBoxChange: function (result){
      if (result) {
        this.$message({
          showClose: true,
          message: "开启RTCP保活需要上级平台支持，可以避免无效推流",
          type: "warning",
        });
      }
    },
    treeTypeChange: function (){
      this.$message({
        showClose: true,
        message: "修改目录结构会导致关联目录与通道数据被清空，保存后生效",
        type: "warning",
      });
    }
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
.control-wrapper-not-used {
  position: relative;
  width: 6.25rem;
  height: 6.25rem;
  max-width: 6.25rem;
  max-height: 6.25rem;
  border-radius: 100%;
  margin-top: 2.5rem;
  margin-left: 0.5rem;
  float: left;
}

.control-panel {
  position: relative;
  top: 0;
  left: 5rem;
  height: 11rem;
  max-height: 11rem;
}

.control-btn {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 44%;
  height: 44%;
  border-radius: 5px;
  border: 1px solid #78aee4;
  box-sizing: border-box;
  transition: all 0.3s linear;
}

.control-btn i {
  font-size: 20px;
  color: #78aee4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: #fff;
  border-radius: 100%;
}

.control-round-inner {
  position: absolute;
  left: 13%;
  top: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  font-size: 40px;
  color: #78aee4;
  border: 1px solid #78aee4;
  border-radius: 100%;
  transition: all 0.3s linear;
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fafafa;
}

.control-top {
  top: -8%;
  left: 27%;
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
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

.control-left {
  top: 27%;
  left: -8%;
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
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

.control-right {
  top: 27%;
  right: -8%;
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
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

.control-bottom {
  left: 27%;
  bottom: -8%;
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
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
