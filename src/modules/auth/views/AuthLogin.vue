<template>
  <b-container id="login-container" class="background-color" fluid>
    <b-row style="height: 100%" align-v="center">
      <b-col>
        <b-row align-h="center">
          <b-col cols="6">
            <div class="logo-wrap" style="text-align: center">
              <b-img :src="require('@/assets/logo-eletro.png')" fluid></b-img>
            </div>
            <div class="login-header">
              <h2>Login</h2>
              <div class="login-divider"></div>
            </div>
            <div id="login-form">
              <b-form @submit="login">
                <div class="form-group">
                  <label for="email">E-mail:</label>
                  <input id="email" type="email" class="form-control" placeholder="seu@email.com.br" v-model="email"/>
                </div>
                <div class="form-group">
                  <label for="password">Senha:</label>
                  <input id="password" type="password" class="form-control" placeholder="senha" v-model="password"/>
                </div>
                <button
                  type="role"
                  class="btn btn-light btn-lg btn-block btn-login"
                >
                  <span>Entrar</span>
                </button>
              </b-form>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="nopaddings">
        <div class="vh-100 login-bg-image">
          <b-img
            class="fit-image"
            :src="require('@/assets/' + mainImageSrc)"
            fluid
          ></b-img>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import service from '../../../services/auth.service'

  export default {
    name: "AuthLogin",
    data () {
      return {
        email: '',
        password: '',
        msg: null,
        mainImageSrc: 'login/210825_ELETROMIDIA_0888.png',
        images: [
          'login/210825_ELETROMIDIA_0888.png',
          'login/210827_ELETROMIDIA_2822_oct21b.png',
          'login/210929_ELETROMIDIA_RJ_0355_nov05_2.png',
          'login/210929_ELETROMIDIA_RJ_2355_nov_4.png',
          'login/210930_ELETROMIDIA_RJ_29out_2.png',
          'login/210930_ELETROMIDIA_RJ_29out.png',
          'login/210930_ELETROMIDIA_RJ_GALEAO_007_oct18.png'
        ]
      }
    },
    created() {
      setInterval(() => {
        const src = this.images[Math.floor(Math.random()*this.images.length)]
        if (src !== undefined) {
          this.mainImageSrc = src
        }
      }, 5000);
    },
    methods: {
      async login(event) {
        try {
          event.preventDefault();

          const credentials = {
            username: this.email,
            password: this.password
          };

          const response = await service.login(credentials);

          this.msg = null;

          const token = response.access_token;
          localStorage.setItem('token', token);

          const me = await service.me();
          const user = me;

          this.$store.dispatch('auth/login', { token, user });
          this.$router.push('/');

        } catch (error) {
          this.msg = error;
          console.log(error);
        }
    }
    }
  };
</script>

<style lang="scss" scoped>

  input::-webkit-input-placeholder {
    color: #fff !important;
  }

  input:-moz-placeholder { /* Firefox 18- */
    color: #fff !important;
  }

  input::-moz-placeholder {  /* Firefox 19+ */
    color: #fff !important;
  }

  input:-ms-input-placeholder {
    color: #fff !important;
  }

  input {
    background-color: var(--orange) !important;
    color: #fff !important;
    height: 64px;
    border: 2px solid #fff;
    border-radius: 6px;
    padding-left: 20px;
    padding-right: 20px;
  }

  input:focus {
    background-color: var(--orange) !important;
    color: #fff !important;
  }

  label {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 13px;
    color: #fff;
  }

  .form-control {
    label {
      color: #fff !important;
    }
  }
  .background-color {
    background-color: var(--orange);
  }
  .login-bg-image {
    width: 100%;
    .fit-image {
      object-fit: cover;
      height: 100vh;
    }
  }

  .logo-wrap {
    margin-bottom: 50px;
  }
  .nopaddings {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .login-header {
    width: 100%;
    text-align: center;
    h2 {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      color: #ffffff;
    }
    .login-divider {
      margin-top: 17px;
      margin-bottom: 12px;
      border-bottom: 4px solid #ffffff;
      border-radius: 20px;
    }
  }
  .form-input-login {
    color: #ffff;
  }
  .btn-login {
    background: #f2f2f2;
    border-radius: 6px;
    align-items: center;
    text-align: center;
    min-height: 64px;
    margin-top: 30px;
    color: var(--orange);

    span {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 20px !important;
      line-height: 2px;
    }
  }
</style>
