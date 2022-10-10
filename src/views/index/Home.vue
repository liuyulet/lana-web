<template v-slot:default>
    <div class="content-bodysss" @click="jumpToLogin">
        <div id="clock">
            <p class="date">今日是：{{ date_show }} - {{ week }}</p>
            <p class="time">{{ time_show }}</p>
            <p class="text" @click="jumpToLogin">让我们开启工作时刻吧！
            </p>
        </div>
    </div>

</template>
<script>

    export default {
        components: {},
        data: function () {
            return {
                week: null,
                date_show: null,
                time_show: null
            }
        },
        beforeCreate() {

        },
        created() {
            this.getdataTime()
            this.getnewTime()
            // 读秒
            setInterval(() => {
                this.getnewTime()
            }, 1000)
        },
        methods: {
            jumpToLogin() {
                //指定跳转的地址
                this.$router.push('/login')
            },
            jumpToDesyg() {
                //指定跳转的地址
                this.$router.replace('/desge')
            },

            // 获取当前系统日期
            getdataTime() {
                let wk = new Date().getDay()
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;
                let dd = new Date().getDate();
                let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                this.week = weeks[wk]
                this.date_show = yy + "年" + mm + "月" + dd + "日"
            },
            // 获取当前系统的时间
            getnewTime() {
                let hh = new Date().getHours();
                let mf =
                    new Date().getMinutes() < 10
                        ? "0" + new Date().getMinutes()
                        : new Date().getMinutes();
                let ss =
                    new Date().getSeconds() < 10
                        ? "0" + new Date().getSeconds()
                        : new Date().getSeconds();
                this.time_show = hh + ":" + mf + ":" + ss;
            }

        }
    }

</script>
<style>

    @import url('../../styles/home.scss');

</style>
