<template>
  <div
    class='w-100 h-100'
  >
    <b-overlay
      :show='!carregamentos.sourceMidias'
      z-index='200'
      class='w-100 h-100'
      variant='dark'
      :opacity='0.5'
      blur='2px'
    >
      <slot></slot>
      
      <template v-slot:overlay>
        <div class='text-center text-white'>
          <p>Carregando inventário...</p>
        </div>
      </template>

      <div
        id='mapbox-container'
        class='w-100 h-100'
      >
      </div>
    </b-overlay>
  </div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import circle from '@turf/circle';
import { FPSControl } from 'mapbox-gl-fps/lib/MapboxFPS.min'

const MAPA_CONFIG = {
  style: 'mapbox://styles/noalvo/ckecvaq5a031919lcapxc4r5d/draft',
  container: 'mapbox-container',
  center: [-55, -10],
  zoom: 4,
  attributionControl: false,
};

const SOURCE_MIDIAS = 'midias-source';
const SOURCE_POIS = 'pois-source';
const SOURCE_POIS_RAIOS = 'pois-raios-source';
const LAYER_MIDIAS = 'midias-layer';
const LAYER_POIS = 'pois-layer';
const LAYER_POIS_RAIOS = 'pois-raios-layer';

const LAYER_MIDIAS_CONFIG = {
  id: LAYER_MIDIAS,
  type: 'circle',
  source: SOURCE_MIDIAS,
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2.5, 15, 10],
    'circle-color': [
      'match',
      ['get', 'faixa'],
      1,
      '#82FFFF',
      2,
      '#52ACFF',
      3,
      '#FFE58A',
      4,
      '#FFD747',
      5,
      '#FFAB2E',
      6,
      '#FF4F4F',
      '#82FFFF',
    ],
    'circle-stroke-opacity': [
      'case',
      ['boolean', ['feature-state', 'active'], false],
      1,
      ['boolean', ['get', 'selecionado'], false],
      1,
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0,
    ],
    'circle-stroke-width': 3,
    'circle-stroke-color': '#fff',
  },
};

const LAYER_POIS_CONFIG = {
  id: LAYER_POIS,
  type: 'symbol',
  source: SOURCE_POIS,
  paint: { 'icon-color': ' #E03535' },
  layout: {
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'icon-size': [
      'interpolate', ['linear'], ['zoom'],
      10, 0.3,
      22, 1,
    ],
  },
};

const LAYER_POIS_RAIOS_CONFIG = {
  id: LAYER_POIS_RAIOS,
  type: 'fill',
  source: SOURCE_POIS_RAIOS,
  paint: {
    'fill-color': 'rgba(256, 0, 0, 0.05)',
    'fill-outline-color': '#ff0000',
  },
};

/**
 * Eventos que são disparados pelo componente
 */
const Eventos = {
  LOAD: 'load',
  STYLE_LOAD: 'styleLoad',
  MIDIAS_LOAD: 'sourceMidiasLoad',
  POIS_LOAD: 'sourcePoisLoad',
  MIDIA_CLICK: 'midiaClick',
  POI_CLICK: 'poiClick',
  SELECIONAR_MIDIA: 'selecionarMidia',
  SELECIONAR_MIDIAS: 'selecionarMidias',
  SELECIONAR_TODAS_MIDIAS: 'selecionarTodasMidias',
  MAPA_INICIALIZADO: 'mapaInicializado',
};

let mapa;
let mapaCanvas;
let desenho;
let mouseDown = () => null;

mapboxgl.accessToken = 'pk.eyJ1Ijoibm9hbHZvIiwiYSI6ImNrZWN1bzR1MzBtZjUycm85NTllcWRudG0ifQ.i96TkzQArXNyBy7wgAUCgg';

export default {
  components: {
  },

  props: {
    /**
     * GeoJSON do source ou uma string de timestamp alterada quando o source altera
     */
    sourceMidias: { type: [Object, String], default: () => null },
    /**
     * Função chamada para obter o source de mídias caso `sourceMidias` seja uma string
     */
    sourceMidiasFn: { type: [Object, Function], default: () => null },
    sourcePois: { type: [Object, String], default: () => null },
    sourcePoisFn: { type: [Object, Function], default: () => null },
    boundsMidias: { type: Object, default: () => null },
    /**
     * Offset esquerdo do mapa e dos componentes flutuantes.
     * padrão 65px = navbar esquerda
     */
    offsetEsquerda: { type: Number, default: 65 },
    /**
     * Offset esquerdo do mapa e dos componentes flutuantes.
     * padrão 50px = controles inferiores
     */
    offsetInferior: { type: Number, default: 50 },
    /**
     * Camada do Mapbox onde a funcionalidade de seleção retangular será inicializada.
     */
    layerSelecaoRetangular: { type: String, default: LAYER_MIDIAS },
    /**
     * Array de ícones em SVG a serem utilizados nas camadas, no formato
     * { name, width, height, svg (path) }
     */
    iconesSvg: { type: Array, default: () => [] },
    /**
     * Nome do ícone adicionado na propriedade `iconesSvg` a ser usado como ícone padrão de POI
     */
    iconePoiPadrao: { type: String, default: null },
    /**
     * Raio (em metros) dos círculos de POIs
     */
    raioPois: { type: Number, default: 1000 },

    // #region Propriedades de visibilidade e filtros de camadas
    /**
     * Flag de estilização de cores das mídias por faixas de legenda
     */
    colorirLegenda: { type: Boolean, default: false },
    /**
     * Flag de filtro de exibição das mídias selecionadas
     */
    filtrarSelecionados: { type: Boolean, default: false },
    /**
     * Flag de filtro de exibição das mídias que intersectam com os raios dos POIs
     */
    filtrarInterseccoes: { type: Boolean, default: false },
    /**
     * Flag de exibição da camada de POIs
     */
    exibirPois: { type: Boolean, default: true },
    /**
     * Flag de exibição da camada de círculos dos POIs
     */
    exibirRaiosPois: { type: Boolean, default: true },
    /**
     * Flag de exibição da camada de trãnsito
     */
    exibirTransito: { type: Boolean, default: false },
    // #endregion Propriedades de visibilidade e filtros de camadas
  },

  data: () => ({
    carregamentos: {
      /**
       * Indica se o evento 'loaded' do mapbox já foi disparado
       */
      mapboxLoad: false,
      /**
       * Indica se o evento 'style.load' do mapbox já foi disparado
       */
      mapboxStyleLoad: false,
      /**
       * Indica se o já houve um carregamento do source de mídias
       */
      sourceMidias: true,
      /**
       * Indica se o já houve um carregamento do source de POIs
       */
      sourcePois: false,
      /**
       * Indica se a funcionalidade de tela cheia já foi inicializada
       */
      telaCheia: false,
      /**
       * Indica se os ícones em SVG já foram disponibilizados para uso
       */
      icones: false,
      /**
       * Indica se a funcionalidade de seleção retangular já foi inicializada
       */
      selecaoRetangular: false,
      /**
       * Indica se todas as camadas foram inicializadas no Mapbox.
       */
      camadas: false,
      /**
       * Indica se o desenho por poligonos foi carregado
       */
      poligono: false,
    },

    /**
     * Indica se existe um carregamento do source de mídias pendente
     * (aguardando o evento 'style.load' do mapbox)
     */
    carregarSourceMidiasPendente: true,

    /**
     * Indica se o mapa está sendo movimentado
     */
    mapaEmMovimento: false,

    /**
     * Indica se o evento MAPA_INICIALIZADO já foi disparado unicamente (once)
     */
    mapaInicializadoDisparado: false,
    desenho: {},
    prevent: false,
    delay: 300,
    midiaAtiva: '',
    // TODO: documentar/readeqaur
    modoSelecao: {
      area: false,
      poligono: false,
    },
  }),

  computed: {
    /**
     * Indica se todas as funcionalidades do mapa já foram inicializadas
     */
    funcionalidadesInicializadas() {
      return this.carregamentos.telaCheia
        && this.carregamentos.icones
        && this.carregamentos.selecaoRetangular
        && this.carregamentos.camadas;
    },

    /**
     * Indica se o mapa já foi completamente inicializado. Condições:
     * - eventos principais de load do mapbox ('load' e 'style.load')
     * - source de mídias carregado
     * - funcionalizades inicializadas
     */
    mapaInicializado() {
      return this.carregamentos.mapboxLoad
        && this.carregamentos.mapboxStyleLoad
        && this.carregamentos.sourceMidias
        && this.funcionalidadesInicializadas;
    },
  },

  watch: {
    /**
     * Dispara o evento de mapa inicializado quando a prop `mapaInicializado` for `true`
     */
    mapaInicializado() {
      if (this.mapaInicializado) this.onMapaInicializado();
    },
    /**
     * Atualiza o offset esquerdo do mapa quando alterado
     */
    offsetEsquerda() {
      this.atualizarOffsets(500);
    },
    raioPois() {
      if (this.carregamentos.sourcePois) {
        this.atualizarCirculosPois(this.raioPois);
      }
    },
    /**
     * Tenta carregar o source de mídias se o style tiver sido carregado.
     * Senão, deixa pendente para o carregamento logo após o style.
     */
    sourceMidias() {
      if (this.carregamentos.sourceMidias) {
        this.carregarSourceMidiasPendente = true;
        this.carregarSourceMidias();
      }
    },
  },
  mounted() {
    mapa = new mapboxgl.Map(MAPA_CONFIG)
      .addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: '' }))
      // controle de navegação (zoom e bússola)
      .addControl(new mapboxgl.NavigationControl(), 'top-right')

    // remove o controle de atribuição do Mapbox 😜
    document.querySelector('.mapboxgl-ctrl-attrib').remove();

    // adiciona o controle de visualização de FPS caso esteja fora do ambiente de produção
    if (process.env.NODE_ENV !== 'production') mapa.addControl(new FPSControl(), 'bottom-left');
    // TODO: paralelizar métodos de preparação

    this.prepararTelaCheia();
    this.prepararSelecaoPoligono();

    mapa.on('load', this.onLoad);
    mapa.on('style.load', this.onStyleLoad);
    mapa.on('sourcedata', this.onSourceLoad);

    mapa.on('click', LAYER_MIDIAS, (evt) => {
      const event = { ...evt };
      this.timer = setTimeout(() => {
        if (!this.prevent) {
          this.selecaoMidia(event);
        }
        this.prevent = false;
      }, this.delay);
    });
  },

  methods: {
    // #region EVENTOS
    /**
     * Evento disparado no carregamento do mapbox
     */
    async onLoad() {
      this.carregamentos.mapboxLoad = true;
      this.$emit(Eventos.LOAD, mapa);
      mapaCanvas = mapa.getCanvasContainer();

      // TODO: paralelizar métodos de preparação
      this.prepararSelecaoRetangular();
      await this.prepararIcones();
    },

    /**
     * Evento disparado unicamente quando o mapa estiver completamente inicializado.
     */
    onMapaInicializado() {
      if (!this.mapaInicializadoDisparado) {
        this.$emit(Eventos.MAPA_INICIALIZADO);
        this.mapaInicializadoDisparado = true;
        if (this.iconePoiPadrao) {
          mapa.setLayoutProperty(LAYER_POIS, 'icon-image', this.iconePoiPadrao);
        }
      }
    },
    /**
     * Evento disparado no carregamento das layers iniciais (style) do mapbox.
     * Se houver um carregamento de source pendente, realiza o carregamento.
     */
    onStyleLoad() {
      this.carregamentos.mapboxStyleLoad = true;
      this.$emit(Eventos.STYLE_LOAD, mapa);
      this.atualizarOffsets();
      this.prepararCamadas();
      if (this.carregarSourceMidiasPendente) {
        this.carregarSourceMidias();
      }
    },

    /**
     * Evento disparado no carregamento de uma source
     */
    onSourceLoad(event) {
      switch (
        event.source.name // TODO: descobrir se é essa prop mesmo
      ) {
        case SOURCE_MIDIAS:
          this.carregamentos.sourceMidias = true;
          return this.$emit(Eventos.MIDIAS_LOAD, mapa);
        case SOURCE_POIS:
          this.carregamentos.sourcePois = true;
          return this.$emit(Eventos.POIS_LOAD, mapa);
        default:
          return null;
      }
    },

    /**
     * Evento disparado na seleção de vários markers ao mesmo tempo.
     */
    onSelecionarVarios(features) {
      this.emit(Eventos.SELECIONAR_MIDIAS, features);
    },

    /**
     * Evento disparado na seleção de vários markers ao mesmo tempo.
     */
    onSelecionarTodos(features) {
      this.emit(Eventos.SELECIONAR_TODAS_MIDIAS, features);
    },
    // #endregion EVENTOS

    /**
     * Adiciona um novo source GeoJSON com o id especificado no mapbox.
     * @param {string} id Identificação do source
     * @param {string|object} dados URL do source ou objeto GeoJSON
     * @param {string?='id'} Propriedade de uma `feature` a ser promovida como id de marker
     * @void
     */
    adicionarOuAtualizarSource(id, dados = null, promoteId = 'id') {
      let source = mapa.getSource(id);
      if (!source) {
        const seed = { type: 'FeatureCollection', features: [] };
        mapa.addSource(id, { type: 'geojson', promoteId, data: seed });
        source = mapa.getSource(id);
      }
      if (dados) {
        source.setData(dados);
      }
    },
    selecaoMidia(evt) {
      const { features } = evt;
      const { id } = features[0];
      if (this.midiaAtiva) {
        mapa.setFeatureState(
          { source: SOURCE_MIDIAS, id: this.midiaAtiva },
          { active: false }
        );
      }
      mapa.setFeatureState({ source: SOURCE_MIDIAS, id }, { active: true });
      this.midiaAtiva = id;
      this.$emit('selecaoMidia', id);
    },
    limparStateAtivo() {
      if (this.midiaAtiva) {
        mapa.setFeatureState(
          { source: SOURCE_MIDIAS, id: this.midiaAtiva },
          { active: false }
        );
        this.midiaAtiva = '';
      }
    },
    toggleLayer(layer) {
      const visibilidade = mapa.getLayoutProperty(layer, 'visibility');
      const valor =
        visibilidade === undefined || visibilidade === 'visible'
        ? 'none'
        : 'visible';
      mapa.setLayoutProperty(layer, 'visibility', valor);
      this.camadaDeTransito = !!(
        layer === 'trafego' && visibilidade === 'none'
      );
    },
    alterarProp(prop, valor) {
      // mutacionar a prop não é recomendado, mas se o pai não tiver
      // declarado, o sync não vai ocorrer
      // então essa mutação é feita para garantir que o estado da prop
      // mudou aqui, independente do pai ter declarado e usado o `.sync`
      this[prop] = valor;
      // faz o emit de update para sincronizar two way a prop
      this.$emit(`update:${prop}`, valor);
    },
    /**
     * Ativa/desativa a seleção por área.
     */
    alternarSelecaoPorArea() {
      const { area, ...outrosModos } = this.modoSelecao;
      if (area) {
        mapaCanvas.removeEventListener('mousedown', mouseDown, true);
        mapa.boxZoom.enable();
      } else {
        mapaCanvas.addEventListener('mousedown', mouseDown, true);
        mapa.boxZoom.disable();
        this.desativarOutrosModosSelecao(outrosModos);
      }
      this.modoSelecao.area = !this.modoSelecao.area;
    },
    desativarOutrosModosSelecao(outrosModos) {
      Object.keys(outrosModos).forEach((x) => {
        if (this.modoSelecao[x]) {
          if (x === 'area') {
            mapaCanvas.removeEventListener('mousedown', mouseDown, true);
            mapa.boxZoom.enable();
          }
          if (x === 'poligono') {
            desenho.deleteAll();
          }
        }
        Reflect.set(this.modoSelecao, x, false);
      });
    },

    /**
     * Ativa/desativa a tela cheia para o usuário
     */
    alternarTelaCheia() {
      if (!document.fullscreenElement) {
        return document
          // TODO: validar esse seletor após o refactor - modificar para classe/id
          .querySelector('#app > div > div.d-flex.flex-row.h-100.mh-100.mw-100.overflow-hidden')
          .requestFullscreen();
      }
      return document.exitFullscreen();
    },

    atualizarCirculosPois() {
      const circulos = this.sourcePoisFn().map(poi => circle(
        poi.localizacao.coordinates,
        this.raio / 1000,
        {
          units: 'kilometers',
          properties: {
            _id: poi._id,
            // TODO: descobrir a necessidade disso
            metadados: poi.metadados,
            // TODO: descobrir a necessidade de localização como property
            localizacao: poi.localizacao,
          },
        },
      ));
      this.adicionarOuAtualizarSource(SOURCE_POIS_RAIOS, circulos);
    },

    /**
     * Atualiza os offsets do mapa após o carregamento ou uma alteração de offset
     */
    atualizarOffsets(duracaoAnimacao = 1) {
      mapa.easeTo({
        padding: {
          left: this.offsetEsquerda,
          bottom: this.offsetInferior,
        },
        duration: duracaoAnimacao,
      });
    },

    /**
     * Carrega o source especificado pela propriedade `sourceMidias`,
     * utilizando o método `adicionarOuAtualizarSource`
    */
    async carregarSourceMidias() {
      if (typeof this.sourceMidias === 'function') {
        await this.adicionarOuAtualizarSource(
          SOURCE_MIDIAS,
          this.sourceMidias()
        );
        this.fitBounds({ bounds: this.bounds });
        this.carregamentos.sourceMidias = true;
        return null;
      }
      this.carregamentos.sourceMidias = true;
      if (this.sourceMidias.features.length) {
      await this.adicionarOuAtualizarSource(SOURCE_MIDIAS, this.sourceMidias);
      let bounds = new mapboxgl.LngLatBounds();
        this.sourceMidias.features.map((feature) => {
        bounds.extend(feature.geometry.coordinates);
        });
      this.fitBounds({ bounds, padding: 150 });
      } else {
        await this.adicionarOuAtualizarSource(SOURCE_MIDIAS, {
          features: [],
          type: this.sourceMidias.type,
        });
      }
    },

    /**
     * Preenche o mapa com o retângulo visível especificado (bounds)
     * @async
     * @param {Object} opções - Opções do método
     * @param {Object} bounds - (Obrigatório) Retãngulo a ser preenchido (a.k.a. bounds, bbox)
     * @param {(Object|number)?} padding - Padding a ser considerado
     * @param {('once'|'on')?} trigger - Trigger do evento no mapbox
     * @return {Promise} Promise resolvida quando a transição do fitBounds foi finalizada.
     */
    async fitBounds({ bounds, padding = null, trigger = 'once' }) {
      this.mapaEmMovimento = true;
      return new Promise((resolve) => {
        const opts = {};
        if (padding) opts.padding = padding;
        mapa.fitBounds(bounds, opts);
        mapa[trigger]('moveend', () => {
          this.mapaEmMovimento = false;
          resolve();
        });
      });
    },

    /**
     * Inicializa as camadas padrão do componente.
     * A ordem das camadas é determinante para a sobreposição dos elementos no mapa.
     */
    prepararCamadas() {
      this.adicionarOuAtualizarSource(SOURCE_MIDIAS);
      this.adicionarOuAtualizarSource(SOURCE_POIS);
      this.adicionarOuAtualizarSource(SOURCE_POIS_RAIOS);

      mapa.addLayer(LAYER_POIS_RAIOS_CONFIG);
      mapa.addLayer(LAYER_POIS_CONFIG);
      mapa.addLayer(LAYER_MIDIAS_CONFIG);

      // TODO: documentar o porquê disso
      this.toggleLayer('trafego');

      this.carregamentos.camadas = true;
    },

    /**
     * Disponibiliza os ícones em SVG para utilização nas layers.
     * @async
     * @returns {Promise} Promise resolvida quando todas as imagens estiverem carregadas.
     */
    async prepararIcones() {
      const promises = this.iconesSvg.map(({
        name,
        height,
        width,
        svg,
      }) => {
        const img = new Image(width, height);
        return new Promise((resolve) => {
          img.onload = () => {
            mapa.addImage(name, img, { sdf: true });
            resolve();
          };
          img.src = `data:image/svg+xml;utf8,${svg}`;
        });
      });
      await Promise.all(promises);
      this.carregamentos.icones = true;
    },

    /**
     * Inicializa a funcionalidade de seleção por área retangular.
     * @void
     */
    prepararSelecaoRetangular() {
    //   const vm = this;
      let start;
      let current;
      let box;
      let finish = () => null;

      const mousePos = (evt) => {
        const rect = mapaCanvas.getBoundingClientRect();
        return new mapboxgl.Point(
          evt.clientX - rect.left - mapaCanvas.clientLeft,
          evt.clientY - rect.top - mapaCanvas.clientTop,
        );
      };
      const onMouseUp = evt => finish([start, mousePos(evt)]);
      const onMouseMove = (evt) => {
        current = mousePos(evt);

        if (!box) {
          box = document.createElement('div');
          box.classList.add('boxdraw');
          mapaCanvas.appendChild(box);
        }

        const minX = Math.min(start.x, current.x);
        const maxX = Math.max(start.x, current.x);
        const minY = Math.min(start.y, current.y);
        const maxY = Math.max(start.y, current.y);

        const pos = `translate(${minX}px, ${minY}px)`;
        box.style.transform = pos;
        box.style.WebkitTransform = pos;
        box.style.width = `${maxX - minX}px`;
        box.style.height = `${maxY - minY}px`;
      };
      const onKeyDown = (evt) => {
        if (evt.keyCode === 27) finish();
      };

      mouseDown = (evt) => {
        if (!(evt.shiftKey && evt.button === 0)) return;
        mapa.dragPan.disable();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keydown', onKeyDown);
        start = mousePos(evt);
      };

      finish = async (bbox) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mouseup', onMouseUp);

        if (box) {
          box.parentNode.removeChild(box);
          box = null;
        }
        if (bbox) {
          this.inventarioCarregado = false;
          const position = bbox.map((box) => mapa.unproject([box.x, box.y]));
          this.selecionarPorArea(position);
          this.source = this.sourceFiltrado();
          this.adicionarOuAtualizarSource(SOURCE_MIDIAS, this.source);
          // this.onSelecionarVarios(features);
        }

        mapa.dragPan.enable();
      };

      this.carregamentos.selecaoRetangular = true;
    },

    /**
     * Inicializa a funcionalidade de tela cheia
     */
    prepararTelaCheia() {
      // adaptação para o autocomplete do Google Maps funcionar em tela cheia
      document.onfullscreenchange = (event) => {
        if (document.getElementsByClassName('pac-container').length > 0) {
          const pac = document.getElementsByClassName('pac-container')[0];
          const divFull = document.getElementsByTagName('body')[0];
          if (pac.parentElement === event.target) divFull.appendChild(pac);
          else event.target.appendChild(pac);
        }
      };
      this.carregamentos.telaCheia = true;
    },

    /**
     * Inicializa a funcionalidade de desenho por poligono
     */
    prepararSelecaoPoligono() {
      desenho = new MapboxDraw({ displayControlsDefault: false, controls: {} });
      mapa.addControl(desenho);
      mapa.on('draw.create', this.selecionarPoligono);
      this.carregamentos.poligono = true;
    },
    /**
     * Preenche o mapa com todas as mídias dentro do bounds atual e seleciona todas as visíveis
     */
    async selecionarTodasMidias() {
      // TODO: considerar offset das barras e dos controles
      // await this.fitBounds({ bounds: this.boundsMidias, padding: 200 });

      this.selecionarPontosFiltrados();
      this.source = this.sourceFiltrado();
      this.adicionarOuAtualizarSource(SOURCE_MIDIAS, this.source);
      // const features = mapa.queryRenderedFeatures({ layers: [LAYER_MIDIAS] });
      // this.onSelecionarTodos(features);
    },
    alternarSelecaoPorPoligono() {
      const { poligono, ...outrosModos } = this.modoSelecao;
      if (poligono) {
        desenho.deleteAll();
      } else {
        desenho.changeMode('draw_polygon');
        this.desativarOutrosModosSelecao(outrosModos);
      }

      this.modoSelecao.poligono = !this.modoSelecao.poligono;
    },
    /**
     *  seleciona todas as midias dentro do desenho do poligono
    */
    selecionarPoligono(evt) {
      const { poligono, ...outrosModos } = this.modoSelecao;

      if (poligono) {
        const { features } = evt;
        this.selecionarPorPoligono(features);

        this.source = this.sourceFiltrado();
        this.adicionarOuAtualizarSource(SOURCE_MIDIAS, this.source);
        desenho.deleteAll();
      } else {
        Object.keys(outrosModos).forEach(x => Reflect.set(this.modoSelecao, x, false));
      }
      this.modoSelecao.poligono = !this.modoSelecao.poligono;
    },
    async selecionarAutomaticamente({
      limite, midias, raio, inicio,
    }) {
      const metrica = !this.campanha.metrica ? '5f988181f1772c2c700b4c04' : this.campanha.metrica;
      await this.selecionarAutomatico({
        limite, midias, raio, inicio, metrica,
      });
      this.source = this.sourceFiltrado();
      this.adicionarOuAtualizarSource(SOURCE_MIDIAS, this.source);
    },
  },
};
</script>

<style>
  .slot-direito {
    position: absolute;
    right: 10px;
    top: 11%;
    z-index: 100;
    font-size: 19px;
    width: 30px;
    height: 78%;
  }
  .slot-superior-direito {
    position: absolute;
    top: 10px;
    right: 50px;
    z-index: 100;
    font-size: 19px;
    height: 9%;  /* TODO: rever essa necessidade de height e width */
    width: 35%;
  }
  .boxdraw {
    background: rgba(255, 152, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }
  .mapboxgl-canvas {
    width: 100% !important;
    height: auto !important;
  }
  a.mapboxgl-ctrl-logo {
    background-image: none !important;
  }
  .fps-control{
    display: none;
  }
</style>