<template>
  <MainLayout>
    <div class="home">
      <h1>Olá, {{ user.name || user.username  }}, bem-vindo a Eletromidia</h1>
      <Container>
        <header>
          <h2>Meus clientes ativos</h2>
          <SearchInput @searchBy="handleSearchByAccount" :value="searchValue" />
        </header>

        <b-card-group>
          <b-card
            :title="client.name"
            :img-src="client.logoUrl"
            img-alt="Image"
            img-top
            tag="article"
            class="text-center"
            @click="nextPage(client)"
            v-for="(client, index) in accounts"
            :key="client._id"
            v-show="client.view"
          >
            <b-button
              variant="outline-secondary"
              size="sm"
              :data-cy="`btn-brand-${index}`"
              >Ver mais</b-button
            >
          </b-card>
        </b-card-group>
      </Container>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
  .customContainer {
    min-height: 78vh;
  }

  .card-group {
    gap: 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);

    .card {
      flex: auto;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.125);
      &:hover {
        cursor: pointer;
      }

      img {
        padding: 30px 30px 0 30px;
      }

      .card-body {
        padding: 15px 15px 30px 15px;
      }

      .card-title {
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 20px;
      }

      .card-img-top {
        object-fit: contain;
        height: 115px;
      }

      &:hover {
        box-shadow: 0 0 0 2px var(--orange);

        .btn {
          background-color: var(--orange);
          border-color: var(--orange);
          color: var(--white);

          &:hover {
            filter: brightness(125%);
          }
        }
      }
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;

    h2 {
      letter-spacing: 0.2px;
      color: #000000;
      margin-bottom: 6px;
    }
  }
</style>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import Container from "@/components/Container.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import SearchInput from '@/components/SearchInput.vue'

export default {
  name: "Home",
  components: {
    Container,
    MainLayout,
    SearchInput
  },
  data() {
    return {
      searchValue: ''
    }
  },
  mounted() {
    this.getAccounts();
  },
  computed: {
    ...mapGetters({
      accounts: 'account/accounts',
      user: 'auth/getUser',
    })
  },
  methods: {
    ...mapMutations({
      SET_CURRENT_ACCOUNT: 'account/SET_CURRENT_ACCOUNT',
      SET_ACCOUNTS: 'account/SET_ACCOUNTS',
    }),
    ...mapActions({
      getAccounts: 'account/fetchAll',
    }),
    nextPage(client) {
      this.SET_CURRENT_ACCOUNT(client);
      this.$router.push({ name: 'Plans' });
    },
    handleSearchByAccount: function (value) {
      const searchedText = value.toLowerCase().trim()
  
      this.SET_ACCOUNTS(this.accounts.map(account => {
        if(account.name.toLowerCase().indexOf(searchedText) === -1) {
          account.view = false
        } else {
          account.view = true
        }

        return account
      }))
      
    }
  }
};
</script>
