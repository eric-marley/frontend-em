<template>
  <header>
    <div>
      <div>
        <slot></slot>
        <h4>{{ title }}</h4>
      </div>
      <slot name="action-buttons"></slot>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Resume',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    
    div {
      display: flex;
      align-items: center;
      width: 100%;

      svg {
        margin-right: 7.5px;
      }

      h4 {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.1px;
        color: #FF4F00;
      }

      div:nth-child(2) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>