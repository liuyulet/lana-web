<template>
    <div id="app" class="orgRoleList">
        <div class="page-header">
            <div class="page-title">组织角色管理</div>
            <div class="page-header-btn">
                <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary"
                           @click="addParentPlatform">添加组织
                </el-button>
                <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary"
                           @click="addRolePlatform">添加角色
                </el-button>
                <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary"
                           @click="addUserPlatform">添加人员
                </el-button>

            </div>
        </div>
        <div style="width: 100%;">
            <!--组织信息-->
            <el-row style="width: 100%">
                <el-col :span="12">
                    <div class="control-table" id="ThreadsLoad" style="margin-right:10px;">
                        <div class="table-box">
                            <el-table :data="organizaDataList"
                                      height="400"
                                      row-key="id"
                                      border
                                      style="width: 100%;"
                                      :cell-style="columnStyle"
                                      :header-cell-style="headerStyle">

                                <el-table-column v-for="(item,index) in organizaColumns"
                                                 :key="index"
                                                 :label="item.label"
                                                 :prop="item.props"
                                                 :width="item.width">
                                    <template slot-scope="scope">
                                        <span>{{ JudgmentData(scope.row[item.props]) ? scope.row[item.props] : '-' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        header-align="center"
                                        align="center"
                                        width="300"
                                        label="操作">
                                    <template slot-scope="scope">
                                        <div class="operation">
                                            <div>
                                                <el-button size="medium" icon="el-icon-edit" type="text"
                                                           @click="userForDepart(scope.row.id)">绑定人员
                                                </el-button>
                                                <!--                        <el-button size="medium" icon="el-icon-edit" type="text">添加下级</el-button>-->
                                                <el-button size="medium" icon="el-icon-edit" type="text"
                                                           @click="editParentPlatform(scope.row)">修改
                                                </el-button>
                                                <el-button size="medium" icon="el-icon-delete" type="text"
                                                           style="color: #f56c6c"
                                                           @click="deleteDepart(scope.row.id)">删除
                                                </el-button>
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
                            <el-table :data="roleizaDataList"
                                      height="400"
                                      row-key="id"
                                      border
                                      style="width: 100%;"
                                      :cell-style="columnStyle"
                                      :header-cell-style="headerStyle">

                                <el-table-column v-for="(item,index) in roleColumns"
                                                 :key="index"
                                                 :label="item.label"
                                                 :prop="item.props"
                                                 :width="item.width">
                                    <template slot-scope="scope">
                                        <span>{{ JudgmentData(scope.row[item.props]) ? scope.row[item.props] : '-' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center"
                                                 align="center"
                                                 width="440"
                                                 label="操作">
                                    <template slot-scope="scope">
                                        <div class="operation">
                                            <div>
                                                <el-button size="medium" icon="el-icon-edit" type="text"
                                                           @click="menuForRole(scope.row.roleId)">绑定菜单
                                                </el-button>
                                                <el-button size="medium" icon="el-icon-edit" type="text"
                                                           @click="userForRole(scope.row.roleId)">绑定人员
                                                </el-button>
                                                <el-button size="medium" icon="el-icon-edit" type="text"
                                                           @click="editRolePlatform(scope.row)">修改
                                                </el-button>
                                                <el-button size="medium" icon="el-icon-delete" type="text"
                                                           style="color: #f56c6c"
                                                           @click="deleteRole(scope.row.roleId)">删除
                                                </el-button>
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
            <el-table
                    :data="uerDataList"
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

                <el-table-column align="center" prop="fullname" label="姓名" min-width="200">
                </el-table-column>
                <el-table-column align="center" prop="username" label="用户账号名" min-width="200">
                </el-table-column>
                <el-table-column align="center" prop="email" label="邮箱" min-width="140">
                </el-table-column>
                <el-table-column align="center" prop="mobile" label="手机号" min-width="120">
                </el-table-column>
                <el-table-column align="center" label="状态" min-width="120">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" v-if="scope.row.status == 1">正常</el-tag>
                            <el-tag size="medium" type="info" v-if="scope.row.status == 0">禁用</el-tag>
                            <el-tag size="medium" type="info" v-if="scope.row.status == 2">新注册</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="dutyName" label="负责部门" min-width="160">
                </el-table-column>
                <el-table-column align="center" prop="departName" label="所属部门" min-width="160">
                </el-table-column>
                <el-table-column align="center" prop="roleName" label="所属角色" min-width="160">
                </el-table-column>
                <el-table-column align="center" prop="createTimer" label="创建时间" min-width="160">
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="140" fixed="right">
                    <template slot-scope="scope">
                        <!--            <el-button size="medium" icon="el-icon-edit" type="text">关联组织</el-button>
                                    <el-button size="medium" icon="el-icon-edit" type="text">关联角色</el-button>-->
                        <el-button size="medium" icon="el-icon-edit" type="text" @click="editUserPlatform(scope.row)">
                            编辑
                        </el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-delete" type="text" @click="delUser(scope.row.userId)"
                                   style="color: #f56c6c">删除
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
            <!--添加组织-->
            <orgEdit ref="orgEdit"></orgEdit>
            <roleEdit ref="roleEdit"></roleEdit>
            <userEdit ref="userEdit"></userEdit>
            <roleMenuEdit ref="roleMenuEdit"></roleMenuEdit>
        </div>
    </div>
</template>


<script>
    import orgEdit from './edit/orgEdit.vue'
    import roleEdit from './edit/roleEdit.vue'
    import userEdit from './edit/userEdit.vue'
    import roleMenuEdit from './edit/roleMenuEdit.vue'


    import {isNull, treeDataTranslate} from "../../utils/utils.js";
    import {postAction, getAction, deleteAction, putAction} from '../../api/manage'

    export default {
        name: "",
        components: {
            orgEdit,
            roleEdit,
            userEdit,
            roleMenuEdit
        },
        props: {},
        watch: {},
        data() {
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                uerDataList: null,
                organizaDataList: [],
                roleizaDataList: [],
                userSelection: [],
                userUpdateSelection: [],
                userSelectionRole: [],
              userUpdaSelectionRole: [],
                organizaColumns: [
                    {label: "组织名称", props: "departName", width: ""},
                    {label: "创建时间", props: "createTime", width: ""},
                    {label: "组织编码", props: "departCode", width: ""},
                ],

                roleColumns: [
                    {label: "角色名称", props: "roleName", width: ""},
                    {label: "创建时间", props: "createTime", width: ""},
                ],
            };
        },
        computed: {
            JudgmentData() {
                return (data) => {
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

            /*
            * 组织信息
            */
            //新增组织
            addParentPlatform() {
                this.$refs.orgEdit.openDialog(null, this.initData)
            },
            //编辑组织
            editParentPlatform(orgDepartData) {
                this.$refs.orgEdit.openDialog(orgDepartData, this.initData)
            },

            // 组织列表
            getDeparts() {
                getAction("/sysDepart/getDepart").then((data) => {
                    if (data && data.code === 200) {
                        this.organizaDataList = data.result
                        this.changeData()
                    }
                })
            },
            //删除组织
            deleteDepart(id) {
                let parms = {
                    userIds: id
                }
                this.$confirm(`确定删除该组织吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getAction("/sysDepart/delDepart", parms).then((data) => {
                        if (data && data.code === 200) {
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                            //刷新组织列表信息
                            this.getDeparts();

                        } else {
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
                })
            },

            //组织绑定人员信息
            userForDepart(departId) {

                if (this.userSelection.length < 1 && this.userUpdateSelection.length < 1) {
                    this.$message({
                        showClose: true,
                        message: "请在下方勾选要绑定或修改绑定的用户",
                        type: 'error'
                    });
                } else {
                    let parms = {
                        "departId": departId,
                        "userId": this.userSelection,
                        "userUpdateId": this.userUpdateSelection
                    }
                    postAction("/sysDepart/userForDepart", parms).then((data) => {
                        if (data && data.code === 200) {
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                            //获取新的数据
                            this.getUser();
                        } else {
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },


            /*
            * 角色信息
            */

            //角色信息
            getRoles() {
                getAction("/sys/role/getRoleList").then((data) => {
                    if (data && data.code === 200) {
                        this.roleizaDataList = data.result
                        this.changeRoleData()
                    }
                })
            },

            //新增角色
            addRolePlatform() {
                this.$refs.roleEdit.openDialog(null, this.initData)
            },
            //编辑角色
            editRolePlatform(orgDepartData) {

                this.$refs.roleEdit.openDialog(orgDepartData, this.initData)
            },

          //角色绑定菜单
          menuForRole(roleId) {
            this.$refs.roleMenuEdit.openDialog(roleId, this.initData)
          },


            //角色绑定人员信息
            userForRole(roleId) {
                if (this.userSelectionRole.length < 1 && this.userUpdaSelectionRole.length < 1) {
                    this.$message({
                        showClose: true,
                        message: "请在下方勾选要绑定或修改绑定的用户",
                        type: 'error'
                    });
                } else {
                    let parms = {
                        "roleId": roleId,
                        "userId": this.userSelectionRole,
                        "userUpdateId": this.userUpdaSelectionRole
                    }
                    postAction("/sys/role/userForRole", parms).then((data) => {
                        if (data && data.code === 200) {
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                            //获取新的数据
                            this.getUser();
                        } else {
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },
            //删除角色
            deleteRole(id) {
                let parms = {
                    userIds: id
                }
                this.$confirm(`确定删除该角色吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getAction("/sys/role/delRole", parms).then((data) => {
                        if (data && data.code === 200) {
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                            //刷新角色列表信息
                            this.getRoles();
                        } else {
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
                })
            },


            //用户列表
            getUser() {
                let params = {
                    'page': this.pageIndex,
                    'limit': this.pageSize
                }
                getAction("/sys/UserDepartRole/getUserMessage", params).then((data) => {
                    if (data && data.code === 200) {
                        this.uerDataList = data.result.list
                        //处理数据
                        this.changeRoleData()
                        this.totalPage = data.result.totalCount
                    }
                })
            },
            //新增用户
            addUserPlatform() {
                this.$refs.userEdit.openDialog(null, this.initData)
            },
            //编辑用户
            editUserPlatform(userDepartData) {

                this.$refs.userEdit.openDialog(userDepartData, this.initData)
            },
            //删除用户
            delUser(userId) {
                let params = {
                    'userId': userId
                }
                this.$confirm(`确定删除该用户吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getAction("/sys/user/delete", params).then((data) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    //更新删除后的用户信息
                                    this.getUser()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            },

            //选择用户
            handleSelectionChange(val) {

                //绑定角色维护两个，一个是未授权用户的，一个是修改已授权用户的
                this.userSelectionRole = [];
                this.userUpdaSelectionRole = [];
                //绑定组织维护两个，一个是未授权用户的，一个是修改已授权用户的
                this.userSelection = [];
                this.userUpdateSelection = [];
                val.forEach(item => {
                    //处理组织
                    if (item.departId != null && item.departId != '') {
                        this.userUpdateSelection.push(item.userId);
                    } else {
                        this.userSelection.push(item.userId);
                    }
                    //处理角色
                    if (item.roleid != null && item.roleid != '') {
                        this.userUpdaSelectionRole.push(item.userId);
                    } else {
                        this.userSelectionRole.push(item.userId);
                    }
                });
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getUser()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getUser()
            },
            changeData() {
                this.organizaDataList = treeDataTranslate(this.organizaDataList, 'id')
            },
            changeRoleData() {
                this.organizaDataList = treeDataTranslate(this.organizaDataList, 'roleId')
            },
            // 更改单元格样式
            columnStyle({row, column, rowIndex, columnIndex}) {
                if (column.property === "name") {
                    return {
                        height: "45px",
                        // 'padding': '0px',
                        'text-align': 'left',
                        "padding-left": '50px',
                    };
                } else {
                    return {
                        height: "45px",
                        'padding': '0px',
                        'text-align': 'center',
                    };
                }
            },
            // 更改表头单元格样式
            headerStyle({row, column, rowIndex, columnIndex}) {
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
            deleteHandle() {
            },
        },

    };


</script>

<style lang="scss" scoped>

    .orgRoleList {
        height: 100%;

        /*定义标题栏*/
        .page-header {
            background-color: #FFFFFF;
            margin-bottom: 1rem;
            padding: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-box {

            ::v-deep .el-table__row:not([class*='el-table__row--level-']) {

                td:first-child {
                    padding-left: 72px !important;
                }

            }
        }

        .text-cents {
            text-align: center;
        }

        @import url('../../styles/home.scss');
    }


</style>
