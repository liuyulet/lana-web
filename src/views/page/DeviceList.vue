<template>
    <div id="app" style="width: 98%;margin: auto;">
        <!--统计列表-->
        <el-row style="width: 100%;padding-top: 2rem;">
            <el-col :span="12">
                <div class="control-table" id="ThreadsLoad" style="margin-right:10px;">
                    <div class="chars" id="projects">

                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="control-table" id="WorkThreadsLoad" style="margin-left:10px;">
                    <div class="chars" id="tasks">

                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row style="width: 100%;margin-top: 20px">
            <el-col :span="12">
                <div class="control-table" id="ThreadsLoad2" style="margin-right:10px;">
                    <div class="chars" id="defect">

                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="control-table" id="WorkThreadsLoad2" style="margin-left:10px;">
                    <div class="chars" id="groupstatis">

                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                pieName: [], //图例名称
                pieData: [], //数据
                tages: false
            }
        },


        mounted() {
            //location. reload();
            this.drawPie();

        },
        methods: {

            drawPie() {
                var thisproject = this.$echarts.init(document.getElementById('projects'));
                var thistasks = this.$echarts.init(document.getElementById('tasks'));
                var thisdefects = this.$echarts.init(document.getElementById('defect'));
                var thisgroupstatis = this.$echarts.init(document.getElementById('groupstatis'));

                //项目统计
                let projects = {
                    title: {
                        text: 'Stacked Line'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: 1048, name: 'Search Engine'},
                                {value: 735, name: 'Direct'},
                                {value: 580, name: 'Email'},
                                {value: 484, name: 'Union Ads'},
                                {value: 300, name: 'Video Ads'}
                            ]
                        }
                    ]
                };
                //任务统计
                let tasks = {
                    title: {
                        text: 'Stacked Line'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'Email',
                            type: 'line',
                            stack: 'Total',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: 'Union Ads',
                            type: 'line',
                            stack: 'Total',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: 'Video Ads',
                            type: 'line',
                            stack: 'Total',
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: 'Direct',
                            type: 'line',
                            stack: 'Total',
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: 'Search Engine',
                            type: 'line',
                            stack: 'Total',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                //缺陷统计
                let defect = {
                    title: {
                        text: 'Referer of a Website',
                        subtext: 'Fake Data',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: 1048, name: 'Search Engine'},
                                {value: 735, name: 'Direct'},
                                {value: 580, name: 'Email'},
                                {value: 484, name: 'Union Ads'},
                                {value: 300, name: 'Video Ads'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                //小组统计
                let groupstatis = {
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '2015', '2016', '2017'],
                            ['Matcha Latte', 43.3, 85.8, 93.7],
                            ['Milk Tea', 83.1, 73.4, 55.1],
                            ['Cheese Cocoa', 86.4, 65.2, 82.5],
                            ['Walnut Brownie', 72.4, 53.9, 39.1]
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [{type: 'bar'}, {type: 'bar'}, {type: 'bar'}]
                };
                //生成项目统计饼图
                thisproject.setOption(projects);
                //生成任务统计折线图
                thistasks.setOption(tasks);
                //生成缺陷统计
                thisdefects.setOption(defect);
                //生成缺陷统计
                thisgroupstatis.setOption(groupstatis);
            }
        }
    }


</script>

<style>
    @import url('../../styles/home.scss');
</style>
