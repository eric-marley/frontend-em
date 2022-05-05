<template>
  <div>
    <money 
      class="inputInvest" 
      :value="value" 
      v-bind="money"
      v-model="price"></money>
  </div>
</template>

<script>
import Vue from 'vue'
import money from 'v-money'

// register directive v-money and component <money>
Vue.use(money, {precision: 4})

  export default {
    name: 'MoneyInput',
    props: {
      value: String,
      handleOnChange: {
        type: Function,
        required: true
      },
      budgetId: {
        type: Number,
        required: true
      },
      handleLoadingCard: {
        type: Function,
        required: false
      }
    },
    data() {
      return {
        price: 0,
        loading: false,
        money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          precision: 2,
          masked: false
        }
      };
    },
    methods: {
      isLoading (params) {
         this.$emit('clicked', params)
      }
    },
    watch: {
      price: {
        handler(value) {
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(async () => {
            // start loading
            this.handleLoadingCard(this.budgetId)
            await this.handleOnChange(value, this.budgetId)
            this.handleLoadingCard('')
          }, 500);
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
.inputInvest {
  border: 0;
  text-align: end;
  outline: none;
  color: #1B1B1B;
  font-size: 0.875rem;
  font-weight: 600;
  width: 95px;

  @media (max-width: 1500px) {
    font-size: 0.75rem !important;
    width: 80px;
  }
  @media (max-width: 1380px) {
    font-size: 0.625rem !important;
    width: 70px;
  }
  @media (max-width: 1180px) {
    font-size: 0.5rem !important;
  }
}
</style>
