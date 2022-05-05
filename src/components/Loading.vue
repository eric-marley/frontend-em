<template>
  <div class="loading">
    <div class="spinner-circle">
      <div class="spinner"></div>
      <Eletromidia class="icon" />
    </div>
  </div>
</template>

<script>
import Eletromidia from "@/assets/eletromidia.svg";

export default {
  name: "Loading",
  components: {
    Eletromidia,
  },
};
</script>

<style lang="scss">
.loading {
  background-color: #ff4f00;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner-circle {
  width: 150px;
  height: 150px;
  position: relative;
  margin: 20px;
}
.spinner {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border: 2px solid #ff781d;
  border-right: 2px solid white;
  animation: rotate--spinner 2s linear infinite;
  box-sizing: border-box;
}
.icon {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%,-50%);
  height: 135px;
}

@keyframes rotate--spinner {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>