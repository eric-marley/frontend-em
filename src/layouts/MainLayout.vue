<template>
  <Fragment>
    <div id="nav">
      <router-link to="/" class="active"><littleBar /><IconHome /></router-link>
    </div>
    <div id="background"></div>
    <div id="content">
      <Header />
      <slot />
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from "vue-frag";
import IconHome from "@/assets/iconHome.svg";
import LittleBar from "@/assets/littleBar.svg";
import Header from "@/components/Header";

export default {
  name: "Mainlayout",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
    IconHome,
    LittleBar,
    Header,
    Fragment,
  },
};
</script>

<style lang="scss" scoped>
#nav {
  border: 1px solid var(--light-gray2);
  width: 50px;
  min-height: 100vh;
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 15px 15px;
  z-index: 2;
  position: fixed;

  .active {
    svg {
      path,
      rect {
        fill: var(--orange);
      }
    }
  }

  a {
    height: 36px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
    position: relative;

    svg:first-child {
      position: absolute;
      left: 0;
    }

    &:hover {
      svg:nth-child(1) {
        path,
        rect {
          fill: var(--orange);
        }
      }
    }

    // &:last-child {
    //   margin-top: auto;
    // }
  }
}

#content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 30px 30px 80px;
  z-index: 0;
}

#background {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 260px;
  background-color: var(--green);
  z-index: 0;
}
</style>
