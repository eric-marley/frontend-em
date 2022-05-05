<template>
  <div class="media-wrapper__img">
      <b-img
        :src="require('@/assets/medias/elevadores-comerciais.png')"
      />
  </div>
</template>

<script>
  export default {
    name: 'ComercialElevatorIcon'
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