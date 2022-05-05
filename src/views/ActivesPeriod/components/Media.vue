<template>
  <ul class="list-inline mb-0">
    <li 
      v-for="(media, index) in this.medias"
      :key="media.nome"
      @click="toggleMedia(media)"
      class="list-inline-item"
      :class="{
        selected: isSelected(media.nome),
        notActive: !media.disponivel
      }"
      :data-cy="`check-media-${index}`"
    >
      <b-row align-v="center">
        <b-col cols=4>
          <AirPortIcon  v-if="media.nome === 'Aeroportos'"/>
          <ComercialElevatorIcon  v-if="media.nome === 'Edifícios Comerciais'"/>
          <ComercialElevatorIcon  v-if="media.nome === 'Estabelecimentos Comerciais'"/>
          <HomeElevatorIcon  v-if="media.nome === 'Edifícios Residenciais'"/>
          <MediaOutOfHomeIcon  v-if="media.nome === 'Mídia de rua'"/>
          <RailTransportIcon  v-if="media.nome === 'Transportes'"/>
          <ShoppingIcon v-if="media.nome === 'Shoppings'"/>
        </b-col>
        <b-col>
          <div class="media__name"><span>{{ media.nome }}</span></div>
        </b-col>
      </b-row>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

import AirPortIcon from "../components/AirPortIcon.vue";
import ComercialElevatorIcon from "../components/ComercialElevatorIcon.vue";
import HomeElevatorIcon from "../components/HomeElevatorIcon.vue";
import MediaOutOfHomeIcon from "../components/MediaOutOfHomeIcon.vue";
import RailTransportIcon from "../components/RailTransportIcon.vue";
import ShoppingIcon from "../components/ShoppingIcon.vue";

export default {
  name: "Media",
  components: {
    AirPortIcon,
    ComercialElevatorIcon,
    HomeElevatorIcon,
    MediaOutOfHomeIcon,
    RailTransportIcon,
    ShoppingIcon,
  },
  props: {
    medias: Array,
  },
  data() {
    return {
      selectedMedias: [],
    }
  },
  computed: {
    ...mapGetters({
      mediaPlan: "media_plans/mediaPlan",
      selectedMediasStore: "medias/selectedMedias"
    })
  },
  beforeMount() {
    if (this.mediaPlan.midias) {
      this.selectedMedias = this.mediaPlan.midias;
    } else {
      this.selectedMedias = this.medias;
    }
  },
  methods: {
    toggleMedia(media) {
      if (!media.disponivel) return;

      this.selectedMedias = this.medias.map((item) => {
        if ( media.nome === item.nome) item.selecionado = item.selecionado ? false : true;
        return item;
      })

      this.$store.dispatch("medias/setSelectedMedias", {
        medias: this.selectedMedias
      });
    },
    isSelected(media) {
      return this.selectedMedias.some((item) => {
       return item.nome === media && item.selecionado
      });
    }
  }
};
</script>

<style lang="scss" scoped>

ul {
  margin-top: 18px;
  font-family: var(--font-family);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  list-style: none;
  gap: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  li {
    background: var(--white);
    height: 80px;
    margin-block-end: 10px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
    border-radius: 14px;

    &:hover {
      border-color: var(--orange);
      cursor: pointer;
    }
    &.selected {
      background: var(--orange);
      border-color: var(--orange);
      color: white;
    }

    &.notActive {
      cursor: not-allowed;
      border-color: #f2f2f2;
      opacity: 0.5;
    }
  }
}

.media__name {
  max-width: 100px;
  text-align: left;
}
</style>
