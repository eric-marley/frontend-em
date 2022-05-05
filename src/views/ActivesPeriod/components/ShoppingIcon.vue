<template>
  <div class="media-wrapper__img">
      <b-img width="51" 
        :src="require('@/assets/medias/shopping.png')"
      />
  </div>
</template>

<script>
  export default {
    name: 'ShoppingsIcon'
  }
</script>

<style lang="scss" scoped>

.media-wrapper__img {
  height: 73px;
  width: 73px;
  margin: 3.57px;
  background: #F2F2F2;
  border-radius: 12px;

  display: flex;
  justify-content: center;

  img {
    padding-top: 10px;
    padding-bottom: 10px
  }
}
</style>