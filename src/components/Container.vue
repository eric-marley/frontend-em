<template>
  <div class="customContainer">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Container',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
  .customContainer {
    border-radius: 8px;
    background: var(--white);
    padding: 20px;
    margin-top: 25px;
    border: 1px solid var(--silver);

    &.view {
      @media(min-width: 1366px) {
        width: 85%;
      }
    }
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 30px;
  }
</style>