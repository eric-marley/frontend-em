<template>
  <div class="media-wrapper__img">
      <b-img width="63"
        :src="require('@/assets/medias/trens.png')"
      />
  </div>
</template>

<script>
  export default {
    name: 'RailTransportIcon'
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
    padding-top: 15px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>