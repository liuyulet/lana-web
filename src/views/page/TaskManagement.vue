<template>
    <div id="app" class="TaskManagement">
        <div class="page-header">
            <div class="page-title">任务管理列表</div>
            <div class="page-header-btn">
                <el-button icon="el-icon-refresh-right" circle size="mini"></el-button>
            </div>
        </div>
        <!--设备列表-->
        <el-table :data="deviceList" style="width: 100%;font-size: 13px;" :height="winHeight"
                  header-row-class-name="table-header">
            <el-table-column align="center" prop="name" label="名称" min-width="200">
            </el-table-column>

            <el-table-column align="center" prop="deviceId" label="任务编号" min-width="200">
            </el-table-column>

            <el-table-column align="center" label="交底文件" min-width="200">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.hostAddress }}</el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="manufacturer" label="任务负责人" min-width="140">

            </el-table-column>

            <el-table-column align="center" prop="channelCount" label="截止日期" min-width="120">
            </el-table-column>

            <el-table-column align="center" label="任务状态" min-width="120">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" v-if="scope.row.online == 1">在线</el-tag>
                        <el-tag size="medium" type="info" v-if="scope.row.online == 0">离线</el-tag>
                    </div>
                </template>
            </el-table-column>


            <el-table-column align="center" prop="keepaliveTime" label="变更次数" min-width="160">
            </el-table-column>
            <el-table-column align="center" prop="registerTime" label="所属项目" min-width="160">
            </el-table-column>
            <!--      <el-table-column prop="updateTime" label="更新时间"  width="140">-->
            <!--      </el-table-column>-->
            <!--      <el-table-column prop="createTime" label="创建时间"  width="140">-->
            <!--      </el-table-column>-->

            <el-table-column align="center" label="操作" min-width="450" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="medium" v-bind:disabled="scope.row.online==0" icon="el-icon-refresh"
                               @click="refDevice(scope.row)"
                               @mouseover="getTooltipContent(scope.row.deviceId)">刷新
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="medium" icon="el-icon-video-camera"
                               @click="showChannelList(scope.row)">通道
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-location" type="text"
                               @click="showDevicePosition(scope.row)">定位
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteDevice(scope.row)"
                               style="color: #f56c6c">删除
                    </el-button>
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
        <deviceEdit ref="deviceEdit"></deviceEdit>
        <syncChannelProgress ref="syncChannelProgress"></syncChannelProgress>
    </div>
</template>

<script>

</script>

<style scoped lang="scss">

    .TaskManagement {
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
