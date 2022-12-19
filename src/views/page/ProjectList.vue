<template>
    <div id="app" class="projectList">
        <div class="page-header">
            <div class="page-title">项目管理列表</div>
            <div class="page-header-btn">

                <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary"
                           @click="addParentPlatform">新增项目
                </el-button>

                <!--        <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>-->
            </div>
        </div>
        <!--设备列表-->
        <el-table :data="projectList" style="width: 100%;font-size: 13px;"
                  header-row-class-name="table-header">
            <el-table-column align="center" prop="projectName" label="名称" min-width="200">
            </el-table-column>

            <el-table-column align="center" prop="projectNum" label="项目编号" min-width="200">
            </el-table-column>

            <el-table-column align="center" prop="projectDutyUser" label="项目负责人" min-width="200">
            </el-table-column>

<!--            <el-table-column align="center" prop="projectConstitution" label="项目章程" min-width="200">
            </el-table-column>-->

            <el-table-column align="center" label="项目状态" min-width="200">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" v-if="scope.row.projectStatus == 1">进行中</el-tag>
                        <el-tag size="medium" type="info" v-if="scope.row.projectStatus == 0">未开始</el-tag>
                        <el-tag size="medium" v-if="scope.row.projectStatus == 2">已完成</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="projectMakr" label="项目备注" min-width="200">
            </el-table-column>

          <el-table-column align="center" prop="projectMakr" label="需求数量" min-width="200">
          </el-table-column>

            <el-table-column align="center" label="操作" min-width="350" fixed="right">
                <template slot-scope="scope">
                    <el-button size="medium" icon="el-icon-edit" type="text" @click="editProjecPlatform(scope.row)">修改
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteProject(scope.row)"
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
        <projectEdit ref="projectEdit"></projectEdit>
    </div>
</template>

<script>
    import {getAction} from "../../api/manage";
    import projectEdit from './edit/projectEdit.vue'

    export default {
        name: "projectList",
        components: {
            projectEdit
        },
        data() {
            return {
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                projectList: null
            }
        },
        computed: {},
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
                };
                getAction("/sysProject/getProject", params).then((data) => {
                    if (data && data.code === 200) {
                        this.projectList = data.result.list;
                        //处理数据
                        this.changeRoleData();
                        this.totalPage = data.result.totalCount
                    }
                })
            },
            changeRoleData() {

            },
            //新增项目
            addParentPlatform() {
                this.$refs.projectEdit.openDialog(null, this.initData)
            },
            editProjecPlatform(projectData) {
                this.$refs.projectEdit.openDialog(projectData, this.initData)
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val;
                this.pageIndex = 1;
                this.getUser()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val;
                this.getUser()
            },
        },
    }
</script>

<style scoped lang="scss">
    .projectList {
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

    }

</style>
