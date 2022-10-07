<template>
  <div class="main-content">
    <div class="main-box">
    <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
      <el-form :model="registerForm" :rules="registerRule">
        <h2 class="title">注册账号</h2>
        <span class="text">下面的信息记得都填写上哦！</span>
        <input class="form__input" v-model="registerForm.name" type="text" placeholder="姓名" />
        <input class="form__input" v-model="registerForm.email" type="text" placeholder="邮箱地址" />
        <input class="form__input" v-model="registerForm.phone" type="text" placeholder="手机号" />
        <input class="form__input" v-model="registerForm.password" type="password" placeholder="登录密码" />
        <div class="primary-btn" @click="registerSubmit()">立即注册</div>
      </el-form>
    </div>
    <div
      :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]"
    >
      <el-form :model="loginForm" :rules="loginRule">
        <h2 class="title">用户登录</h2>

        <span class="text">or use Phone for registration</span>
        <input class="form__input" v-model="loginForm.phone" type="text" placeholder="账号" />
        <input class="form__input" v-model="loginForm.password" type="password" placeholder="密码" />
        <el-row :gutter="20">
        </el-row>
        <div class="primary-btn" @click="loginSubmit()">立即登录</div>
      </el-form>
    </div>
    <div :class="['switch', { login: isLogin }]">
      <div class="switch__circle"></div>
      <div class="switch__circle switch__circle_top"></div>
      <div class="switch__container">
        <h2>{{ isLogin ? '嗨，朋友 !' : '欢迎回来 !' }}</h2>
        <p>
          {{
            isLogin
              ? 'Enter your personal details and start journey with us'
              : 'To keep connected with us please login with your personal info'
          }}
        </p>
        <div class="primary-btn" @click="isLogin = !isLogin">
          {{ isLogin ? '点击注册' : '点击登录' }}
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { postAction } from '../../api/manage'
export default {
  name: 'LoginBox',
  data() {
    return {
      isLogin: false,
      loginForm: {
        phone: '',
        password: '',
      },
      registerForm: {
        name: '',
        phone: '',
        password: '',
      },
      loginRule: {
        phone: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
      },
      registerRule: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    loginSubmit() {
      let params = {
        username: this.loginForm.phone,
        password: this.loginForm.password
      }
      postAction("/sys/login",params).then((data) => {
        //console.log('Login',data)
        if (data && data.code === 200) {
          localStorage.setItem('userAccount',data.result.userAccount);
          localStorage.setItem('userFullname',data.result.userFullname);
          localStorage.setItem('userId',data.result.userId);
          localStorage.setItem('X-Access-Token',data.result.token);
          this.$router.replace('/deviceList')
        }else {
          this.$message.error('账号或密码不正确');
        }
      })
    },
    registerSubmit() {
      let params = {
        fullname: this.registerForm.name,
        email: this.registerForm.email,
        mobile: this.registerForm.phone,
        password: this.registerForm.password,
      }
      postAction("/sys/reg/register",params).then((data) => {

        if (data && data.code === 200) {
          this.$message({
            message: data.message,
            type: 'success'
          });
          //
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.main-content{
  background: #0f3854;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-box {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #0a2e38, -10px -10px 10px #000000;
  border-radius: 12px;
  overflow: hidden;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;
    form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      color: #a0a5a8;
      .title {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      .text {
        margin-top: 30px;
        margin-bottom: 12px;
      }
      .form__input {
        width: 350px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        // font-family: 'Montserrat', sans-serif;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
        &::placeholder {
          color: #a0a5a8;
        }
      }
    }
  }
  .container-register {
    z-index: 100;
    left: calc(100% - 600px);
  }
  .container-login {
    left: calc(100% - 600px);
    z-index: 0;
  }
  .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
  }
  .is-z200 {
    z-index: 200;
    transition: 1.25s;
  }
  .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;
    .switch__circle {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background-color: #ecf0f3;
      box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
      bottom: -60%;
      left: -60%;
      transition: 1.25s;
    }
    .switch__circle_top {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
    .switch__container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      width: 400px;
      padding: 50px 55px;
      transition: 1.25s;
      h2 {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      p {
        font-size: 14px;
        letter-spacing: 0.25px;
        text-align: center;
        line-height: 1.6;
      }
    }
  }
  .login {
    left: calc(100% - 400px);
    .switch__circle {
      left: 0;
    }
  }
  .primary-btn {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    &:hover {
      box-shadow: 4px 4px 6px 0 rgb(255 255 255 / 50%),
      -4px -4px 6px 0 rgb(116 125 136 / 50%),
      inset -4px -4px 6px 0 rgb(255 255 255 / 20%),
      inset 4px 4px 6px 0 rgb(0 0 0 / 40%);
    }
  }
}

/*@import url('../../styles/login.scss');*/
</style>

