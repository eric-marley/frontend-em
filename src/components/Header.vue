<template>
  <header id="appHeader">
    <Logo />
    <UserProfile v-if="user.username" />
  </header>
</template>

<script>
  import UserProfile from '@/components/UserProfile.vue';
  import Logo from '@/assets/logo.svg';
import { mapGetters } from 'vuex';

  export default {
    name: 'Header',
    components: {
      UserProfile,
      Logo
    },
    computed: {
    ...mapGetters({ user: "auth/getUser" }),
    }
  };
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: space-between;
    width: calc(100% + 10px);
    margin-left: -10px;
    z-index: 2;
    min-height: 50px;
  }

</style>