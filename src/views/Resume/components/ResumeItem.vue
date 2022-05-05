
<template>
  <div class="resume-box" :class="{ noFill: noFill }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ResumeItem',
  props: {
    fill: {
      type: String,
      default: 'true'
    }
  },
  computed: {
    noFill() {
      return this.fill === 'true' ? false : true
    }
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .resume-box {
    background: #F6F6F8;
    width: 100%;
    padding: 20px;
    border-radius: 8px;

    &:first-child {
      height: 100%;
    }

    &.noFill {
      background: #fff;
      padding: 0;
      border-radius: none;
    }

    h5 {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      letter-spacing: 0.1px;
      color: #1B1B1B;
      margin-bottom: 12px;
    }
  }

  .resume-data {
    p {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      align-items: center;
      letter-spacing: 0.1px;
      color: #1B1B1B;
    }

    &.list {
      list-style: none;

      li {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 26px;
        display: flex;
        align-items: center;
        letter-spacing: 0.1px;
        color: #000000;
        margin-bottom: 6px;

        strong {
          font-weight: 600;
          margin-right: 2.5px;
        }
      }
    }
  }
</style>