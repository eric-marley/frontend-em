<template>
  <b-dropdown
    size="sm"
    class="dropdown-header"
    right
    variant="link"
    toggle-class="text-decoration-none"
    no-caret
  >
    <template #button-content>
      <div id="userProfile">
        <b-avatar
          variant="light-orange"
          :text="userFirstAndLastChar"
        ></b-avatar>
        <div class="wrap-text">
          <strong>{{ user.name || user.username }}</strong>
          <!--small>Planner</small-->
        </div>
        <ArrowDownIcon />
      </div>
    </template>
    <b-dropdown-item @click="handleLogout" data-cy="action-logout">Sair</b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ArrowDownIcon from "@/assets/icons/arrow-down-icon.svg";

export default {
  name: "Userprofile",
  components: {
    ArrowDownIcon,
  },
  computed: {
    ...mapGetters({ user: "auth/getUser" }),
    userFirstAndLastChar() {
      const name = this.user.username;
      if (!name) {
        return ''
      }
      return name[0] + name.slice(-1);
    },
  },
  methods: {
    ...mapActions({
        logout: 'auth/logout',
      }),
    handleLogout(){
      this.logout()
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
#userProfile {
  display: flex;
  align-items: center;
  cursor: pointer;

  strong,
  small,
  svg {
    color: var(--white);
  }

  .wrap-text {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    margin-right: 23px;
    font-size: 16px;
  }

  span {
    font-weight: 600;
  }
}

.dropdown-header {
  padding: 0 !important;
  button {
    padding: 0 !important;
  }
  ul {
    padding: 0 !important;
  }
}
.dropdown-menu{
  li {
    padding: -0.5rem 0 !important;
  }
}
</style>