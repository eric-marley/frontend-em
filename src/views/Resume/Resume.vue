<template>
  <Fragment>
    <Loading v-if="!loaded" />
    <MainLayout v-else>
      <div>
        <h1>Novo planejamento - {{ mediaPlan.account.name }}</h1>
        <Steps current="resume" />
        <Container class="mb-6">
          <header>
            <div>
              <h2>{{ page.header.title }}</h2>
              <p>{{ page.header.subtitle }}</p>
            </div>
          </header>
          <section class="resume-section">
            <h3>{{ mediaPlan.name }}</h3>
            <b-row>
              <b-col class="resume-col">
                <ResumeItem>
                  <Header title="Período de veiculação">
                    <CalendarIcon />
                    <template v-slot:action-buttons>
                      <div style="position: absolute; right: 2em">
                        <b-button
                          variant="link"
                          class="edit-button"
                          @click="editStep('ActivesPeriod', {})"
                          v-if="user.username"
                        >
                          <b-icon icon="pencil" aria-hidden="true"></b-icon>
                          Editar
                        </b-button>
                      </div>
                    </template>
                  </Header>
                  <ul class="resume-data list">
                    <li>
                      <strong>Início:</strong>
                      {{ this.startDate || "Sem data de início" }}
                    </li>
                    <li><strong>Duração:</strong> {{ mediaPlan.period.type }}</li>
                  </ul>
                </ResumeItem>
              </b-col>
              <b-col class="resume-col">
                <ResumeItem>
                  <Header title="Target">
                    <PersonIcon />
                    <template v-slot:action-buttons>
                      <div style="position: absolute; right: 1em">
                        <b-button
                          variant="link"
                          class="edit-button"
                          @click="editStep('Target', {})"
                          v-if="user.username"
                        >
                          <b-icon icon="pencil" aria-hidden="true"></b-icon>
                          Editar
                        </b-button>
                      </div>
                    </template>
                  </Header>
                    <h5>{{ mediaPlan.currentTarget.name }}</h5>
                    <span class="currentTarget-description" v-for="(description, index) in mediaPlan.currentTarget.descriptions.data" :key="index">
                      <strong>{{ description.split(':')[0] }}:</strong>
                      {{ description.split(':')[1] }}
                    </span>
                    <span class="currentTarget-item-title">{{ mediaPlan.currentTarget.interests.title }}</span>
                    <span class="currentTarget-item-data">{{ mediaPlan.currentTarget.interests.data }}</span>
                    <span class="currentTarget-item-title">{{ mediaPlan.currentTarget.behaviors.title }}</span>
                    <span class="currentTarget-item-data">{{ mediaPlan.currentTarget.behaviors.data }}</span>
                    <span class="currentTarget-item-title">{{ mediaPlan.currentTarget.educationalLevel.title }}</span>
                    <span class="currentTarget-item-data">{{ mediaPlan.currentTarget.educationalLevel.data }}</span>
                </ResumeItem>
              </b-col>
            </b-row>
            <b-row>
              <ResumeItem>
                <Header title="Investimento">
                  <MoneyIcon />
                  <template v-slot:action-buttons>
                    <div style="position: absolute; right: 4.5em">
                      <b-button
                        variant="link"
                        class="edit-button"
                        @click="editStep('Budget', {})"
                        v-if="user.username"
                      >
                        <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        Editar
                      </b-button>
                    </div>
                  </template>
                </Header>
                <b-table
                  id="investments-table"
                  small
                  sort-icon-left
                  :items="mediaPlan.investments"
                  :fields="fields.investiments"
                  :current-page="table.investiments.currentPage"
                  :per-page="table.investiments.perPage"
                >
                  <template #cell(weeklyReach)="data">
                    {{ convertValue(data.item.weeklyReach.replace('.', '').replace(',', '.'), 'decimal') }}
                  </template>
                </b-table>
                <ul class="investments-table-result">
                  <li>Total</li>
                  <li>{{ convertValue(this.mediaPlan.investmentsAmount.investiment, 'currency') }}</li>
                  <li>{{ convertValue(this.mediaPlan.investmentsAmount.weeklyReach, 'decimal') }}</li>
                  <li>{{ convertValue(this.mediaPlan.investmentsAmount.frequency, 'float')}}</li>
                  <li>{{ convertValue(this.mediaPlan.investmentsAmount.weeklyImpact, 'decimal') }}</li>
                  <li>{{ convertValue(this.mediaPlan.investmentsAmount.grp, 'decimal') }}</li>
                </ul>
              </ResumeItem>
              <b-pagination
                v-if="totalInvestimentsRows > 5"
                v-model="table.investiments.currentPage"
                :total-rows="totalInvestimentsRows"
                :per-page="table.investiments.perPage"
                aria-controls="investiments-table"
                style="justify-content: flex-end"
                class="m-0"
              ></b-pagination>
            </b-row>
            <b-row>
              <ShareModal
                v-show="shareModalView"
                :message="shareModal.message"
                :link="shareModal.link"
                :button="shareModal.button"
              />
            </b-row>
            <b-row>
              <section
                class="map-section"
                :class="{ 'full-page': fullDisplay }"
              >
                <Map :sourceMidias="filteredMap">
                  <div class="map-controls">
                    <svg v-show="fullDisplay" @click="handleSizeDisplay" class="map-icon ellipse" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="13" cy="13" r="13" fill="#BDBDBD"/>
                      <path d="M7.6665 14.3334H11.6665V18.3334" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.3335 11.6666H14.3335V7.66663" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14.3335 11.6667L19.0002 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 19L11.6667 14.3334" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-show="!fullDisplay" @click="handleSizeDisplay" class="map-icon ellipse" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="13" cy="13" r="13" fill="#BDBDBD" />
                      <path d="M10.3333 7H8.33333C7.97971 7 7.64057 7.14048 7.39052 7.39052C7.14048 7.64057 7 7.97971 7 8.33333V10.3333M19 10.3333V8.33333C19 7.97971 18.8595 7.64057 18.6095 7.39052C18.3594 7.14048 18.0203 7 17.6667 7H15.6667M15.6667 19H17.6667C18.0203 19 18.3594 18.8595 18.6095 18.6095C18.8595 18.3594 19 18.0203 19 17.6667V15.6667M7 15.6667V17.6667C7 18.0203 7.14048 18.3594 7.39052 18.6095C7.64057 18.8595 7.97971 19 8.33333 19H10.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="map-filters">
                    <div class="map-icon ellipse">
                      <svg @click="handleFiltersDisplay" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="13" r="13" fill="#FF4F00"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6719 8C16.2242 8 16.6719 8.44772 16.6719 9C16.6719 9.55228 16.2242 10 15.6719 10C15.1196 10 14.6719 9.55228 14.6719 9C14.6719 8.44772 15.1196 8 15.6719 8ZM15.6719 7C16.7764 7 17.6719 7.89543 17.6719 9C17.6719 10.1046 16.7764 11 15.6719 11C14.5673 11 13.6719 10.1046 13.6719 9C13.6719 7.89543 14.5673 7 15.6719 7Z" fill="#FAFAFA"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6014 8.47187C17.6473 8.64011 17.6718 8.81719 17.6718 9C17.6718 9.28444 17.6125 9.55501 17.5054 9.8H18.8718C19.0593 9.8 19.2156 9.7375 19.3406 9.6125C19.476 9.47708 19.5437 9.31562 19.5437 9.12812C19.5437 8.95104 19.476 8.8 19.3406 8.675C19.2156 8.53958 19.0593 8.47187 18.8718 8.47187H17.6014ZM13.7423 8.47187C13.6964 8.64011 13.6718 8.81719 13.6718 9C13.6718 9.28444 13.7312 9.55501 13.8382 9.8H6.87183C6.68433 9.8 6.52287 9.7375 6.38745 9.6125C6.26245 9.47708 6.19995 9.31562 6.19995 9.12812C6.19995 8.95104 6.26245 8.8 6.38745 8.675C6.52287 8.53958 6.68433 8.47187 6.87183 8.47187H13.7423ZM18.8718 13.8H12.0284C12.1011 13.5927 12.1406 13.3698 12.1406 13.1376C12.1406 12.9042 12.1007 12.6801 12.0272 12.4719H18.8718C19.0593 12.4719 19.2156 12.5396 19.3406 12.675C19.476 12.8 19.5437 12.951 19.5437 13.1281C19.5437 13.3156 19.476 13.4771 19.3406 13.6125C19.2156 13.7375 19.0593 13.8 18.8718 13.8ZM8.14064 13.1376C8.14064 13.3698 8.1802 13.5927 8.25293 13.8H6.87183C6.68433 13.8 6.52287 13.7375 6.38745 13.6125C6.26245 13.4771 6.19995 13.3156 6.19995 13.1281C6.19995 12.951 6.26245 12.8 6.38745 12.675C6.52287 12.5396 6.68433 12.4719 6.87183 12.4719H8.25413C8.18063 12.6801 8.14064 12.9042 8.14064 13.1376ZM13.774 17.8H6.87183C6.68433 17.8 6.52287 17.7375 6.38745 17.6125C6.26245 17.4771 6.19995 17.3156 6.19995 17.1281C6.19995 16.951 6.26245 16.8 6.38745 16.675C6.52287 16.5396 6.68433 16.4719 6.87183 16.4719H13.7449C13.6807 16.6679 13.646 16.8772 13.646 17.0946C13.646 17.3429 13.6913 17.5806 13.774 17.8ZM17.5181 17.8H18.8718C19.0593 17.8 19.2156 17.7375 19.3406 17.6125C19.476 17.4771 19.5437 17.3156 19.5437 17.1281C19.5437 16.951 19.476 16.8 19.3406 16.675C19.2156 16.5396 19.0593 16.4719 18.8718 16.4719H17.5472C17.6113 16.6679 17.646 16.8772 17.646 17.0946C17.646 17.3429 17.6008 17.5806 17.5181 17.8Z" fill="#FAFAFA"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1406 12.1376C10.6929 12.1376 11.1406 12.5853 11.1406 13.1376C11.1406 13.6899 10.6929 14.1376 10.1406 14.1376C9.58834 14.1376 9.14063 13.6899 9.14063 13.1376C9.14063 12.5853 9.58834 12.1376 10.1406 12.1376ZM10.1406 11.1376C11.2452 11.1376 12.1406 12.0331 12.1406 13.1376C12.1406 14.2422 11.2452 15.1376 10.1406 15.1376C9.03606 15.1376 8.14062 14.2422 8.14062 13.1376C8.14062 12.0331 9.03606 11.1376 10.1406 11.1376Z" fill="#FAFAFA"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.646 16.0946C16.1983 16.0946 16.646 16.5423 16.646 17.0946C16.646 17.6469 16.1983 18.0946 15.646 18.0946C15.0937 18.0946 14.646 17.6469 14.646 17.0946C14.646 16.5423 15.0937 16.0946 15.646 16.0946ZM15.646 15.0946C16.7506 15.0946 17.646 15.9901 17.646 17.0946C17.646 18.1992 16.7506 19.0946 15.646 19.0946C14.5414 19.0946 13.646 18.1992 13.646 17.0946C13.646 15.9901 14.5414 15.0946 15.646 15.0946Z" fill="#FAFAFA"/>
                      </svg>
                    </div>
                    <div v-if="filtersDisplay" class="mapFilters-box">
                      <div>
                        <span>Filtrar os tipos de mídias</span>
                        <svg
                          @click="handleFiltersClosing"
                          class="map-close-icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.1846 12.1922C23.1846 11.4422 23.1143 10.7078 22.9736 9.98907C22.8174 9.27032 22.5986 8.58283 22.3174 7.92658C22.0518 7.27033 21.7158 6.64532 21.3096 6.05157C20.9189 5.45782 20.4736 4.91095 19.9736 4.41095C19.4736 3.92657 18.9268 3.48126 18.333 3.07501C17.7549 2.68439 17.1377 2.34845 16.4814 2.0672C15.8252 1.78595 15.1377 1.57501 14.4189 1.43439C13.7002 1.27814 12.958 1.20001 12.1924 1.20001C11.4268 1.20001 10.6846 1.27814 9.96582 1.43439C9.24707 1.57501 8.55957 1.78595 7.90332 2.0672C7.24707 2.34845 6.62988 2.68439 6.05176 3.07501C5.45801 3.48126 4.91113 3.92657 4.41113 4.41095C3.91113 4.91095 3.46582 5.45782 3.0752 6.05157C2.66895 6.64532 2.3252 7.27033 2.04395 7.92658C1.77832 8.58283 1.56738 9.27032 1.41113 9.98907C1.27051 10.7078 1.2002 11.4422 1.2002 12.1922C1.2002 12.9578 1.27051 13.7 1.41113 14.4188C1.56738 15.1375 1.77832 15.825 2.04395 16.4813C2.3252 17.1375 2.66895 17.7625 3.0752 18.3563C3.46582 18.9344 3.91113 19.4734 4.41113 19.9734C4.91113 20.4734 5.45801 20.9188 6.05176 21.3094C6.62988 21.7156 7.24707 22.0594 7.90332 22.3406C8.55957 22.6219 9.24707 22.8328 9.96582 22.9734C10.6846 23.1297 11.4268 23.2078 12.1924 23.2078C12.958 23.2078 13.7002 23.1297 14.4189 22.9734C15.1377 22.8328 15.8252 22.6219 16.4814 22.3406C17.1377 22.0594 17.7549 21.7156 18.333 21.3094C18.9268 20.9188 19.4736 20.4734 19.9736 19.9734C20.4736 19.4734 20.9189 18.9344 21.3096 18.3563C21.7158 17.7625 22.0518 17.1375 22.3174 16.4813C22.5986 15.825 22.8174 15.1375 22.9736 14.4188C23.1143 13.7 23.1846 12.9578 23.1846 12.1922ZM21.1924 12.1922C21.1924 13.4422 20.958 14.6141 20.4893 15.7078C20.0205 16.8016 19.3799 17.7547 18.5674 18.5672C17.7393 19.3797 16.7783 20.0203 15.6846 20.4891C14.6064 20.9578 13.4424 21.1922 12.1924 21.1922C10.9424 21.1922 9.77051 20.9578 8.67676 20.4891C7.59863 20.0203 6.64551 19.3797 5.81738 18.5672C5.00488 17.7547 4.36426 16.8016 3.89551 15.7078C3.42676 14.6141 3.19238 13.4422 3.19238 12.1922C3.19238 10.9578 3.42676 9.79376 3.89551 8.70001C4.36426 7.60626 5.00488 6.65314 5.81738 5.84064C6.64551 5.02814 7.59863 4.38751 8.67676 3.91876C9.77051 3.43439 10.9424 3.1922 12.1924 3.1922C13.4424 3.1922 14.6064 3.43439 15.6846 3.91876C16.7783 4.38751 17.7393 5.02814 18.5674 5.84064C19.3799 6.65314 20.0205 7.60626 20.4893 8.70001C20.958 9.79376 21.1924 10.9578 21.1924 12.1922ZM8.48926 9.89532L10.7861 12.1922L8.48926 14.4891C8.28613 14.6922 8.18457 14.9344 8.18457 15.2156C8.18457 15.4813 8.28613 15.7078 8.48926 15.8953C8.67676 16.0985 8.91113 16.2 9.19238 16.2C9.47363 16.2 9.70801 16.0985 9.89551 15.8953L12.1924 13.6219L14.4893 15.8953C14.6768 16.0985 14.9111 16.2 15.1924 16.2C15.4736 16.2 15.708 16.0985 15.8955 15.8953C16.0986 15.7078 16.2002 15.4813 16.2002 15.2156C16.2002 14.9344 16.0986 14.6922 15.8955 14.4891L13.5986 12.1922L15.8955 9.89532C16.0986 9.70782 16.2002 9.48126 16.2002 9.21564C16.2002 8.93439 16.0986 8.6922 15.8955 8.48908C15.708 8.30158 15.4736 8.20783 15.1924 8.20783C14.9111 8.20783 14.6768 8.30158 14.4893 8.48908L12.1924 10.7859L9.89551 8.48908C9.70801 8.30158 9.47363 8.20783 9.19238 8.20783C8.91113 8.20783 8.67676 8.30158 8.48926 8.48908C8.28613 8.6922 8.18457 8.93439 8.18457 9.21564C8.18457 9.48126 8.28613 9.70782 8.48926 9.89532Z"
                            fill="#C6C6C6"
                          />
                        </svg>
                      </div>
                      <ul class="mapFilters-tags">
                        <Fragment v-for="media in midias" :key="media.nome">
                          <Tag
                            :class="{
                              selected: !hasEmptySelectedMidia || media.selecionado,
                              disabled: !media.disponivel,
                            }"
                            :name="media.nome"
                            :handleTagSelection="handleTagSelection"
                            :handleRemoveTagSelection="handleRemoveTagSelection"
                          />
                        </Fragment>
                      </ul>
                    </div>
                  </div>
                  <div class="mapLabels">
                    Alcance das mídias
                    <div class="mapLabels-range">
                      <span>Menor</span>
                      <div
                        class="mapLabels-color"
                        :class="color"
                        v-for="color in mapColors"
                        :key="color"
                      />
                      <span>Maior</span>
                    </div>
                  </div>
                </Map>
              </section>
            </b-row>
            <b-row>
              <ResumeItem>
                <Header title="Endereços e mídias">
                  <PointIcon />
                  <template v-slot:action-buttons>
                    <div class="table-actions">
                      <b-button
                        variant="link"
                        class="mr-4 download-button"
                        @click="generatePdf"
                      >
                        <b-icon icon="download" aria-hidden="true"></b-icon>
                        Baixar PDF
                      </b-button>
                      <b-button
                        variant="link"
                        class="edit-button"
                        v-if="user.username"
                        @click="
                          editStep('IdentificationLocals', {
                            accountId: mediaPlan.accountId,
                          })
                        "
                      >
                        <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        Editar
                      </b-button>
                    </div>
                  </template>
                </Header>
                <b-table
                  id="resume-table"
                  small
                  sort-icon-left
                  :items="locations"
                  :fields="fields.locations"
                  :current-page="table.locations.currentPage"
                  :per-page="table.locations.perPage"
                />
                <vue-html2pdf
                  :show-layout="false"
                  :float-layout="true"
                  :enable-download="true"
                  :preview-modal="false"
                  :paginate-elements-by-height="20000"
                  filename="enderecos-e-ativos"
                  :pdf-quality="2"
                  :manual-pagination="false"
                  pdf-format="a4"
                  pdf-orientation="landscape"
                  pdf-content-width="100%"
                  ref="html2Pdf"
                >
                  <section slot="pdf-content">
                    <b-table
                      small
                      :items="locations"
                      :fields="fields.locations"
                    />
                  </section>
                </vue-html2pdf>
              </ResumeItem>
              <b-pagination
                v-model="table.locations.currentPage"
                :total-rows="totalResumeRows"
                :per-page="table.locations.perPage"
                aria-controls="resume-table"
                style="justify-content: flex-end;"
                class="m-0"
              ></b-pagination>
            </b-row>
          </section>
        </Container>
        <div id="footer" class="d-flex">
          <b-button
            variant="outline-secondary"
            class="mr-3 ml-auto"
            @click="previousPage"
            >Voltar</b-button
          >
        </div>
      </div>
    </MainLayout>
  </Fragment>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueHtml2pdf from "vue-html2pdf";
import { Fragment } from 'vue-frag'

import Container from "@/components/Container.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import ResumeItem from "./components/ResumeItem.vue";
import Header from "./components/Header.vue";
import Map from './components/Map.vue'
import ShareModal from "./components/ShareModal.vue";
import Steps from "@/components/Steps.vue";
import Loading from './components/Loading.vue'
import Tag from './components/Tag.vue'
import CalendarIcon from "@/assets/icons/calendar-icon.svg";
import PersonIcon from "@/assets/icons/person-icon.svg";
import MoneyIcon from "@/assets/icons/money-icon.svg";
import PointIcon from "@/assets/icons/point-icon.svg";
import handleMapFilter from "./helpers/handleMapFilter";
import convertValues from '../../helpers/money'

export default {
  name: "Resume",
  components: {
    MainLayout,
    Container,
    Steps,
    ResumeItem,
    Header,
    Map,
    CalendarIcon,
    PersonIcon,
    MoneyIcon,
    PointIcon,
    ShareModal,
    VueHtml2pdf,
    Loading,
    Fragment,
    Tag,
  },
  data() {
    return {
      mapColors: [
        'light-blue',
        'blue',
        'light-yellow',
        'yellow',
        'orange',
        'red',
      ],
      loaded: false,
      filtersDisplay: false,
      fullDisplay: false,
      currentStep: "resume",
      hasEmptySelectedMidia: false,
      midias: [],
      filteredMap: {},
      page: {
        header: {
          title: "Resumo do plano de mídia",
          subtitle: "",
        },
      },
      shareModal: {
        message: "<strong>Compartilhe</strong> agora mesmo o link",
        link: window.location.href,
        button: "Copiar link",
      },
      table: {
        investiments: {
          perPage: 5,
          currentPage: 1,
          totalRows: 0,
        },
        locations: {
          perPage: 10,
          currentPage: 1,
          totalRows: 0,
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      stepHeaders: "steps/stepHeaders",
      mediaPlan: "resume/mediaPlan",
      shareModalView: "resume/shareModalView",
      map: "resume/map",
      locations: "resume/locations",
      fields: "resume/fields",
      medias: "medias/medias",
      user: "auth/getUser",
    }),
    totalInvestimentsRows () {
      return this.mediaPlan.investments.length;
    },
    totalResumeRows() {
      return this.locations.length;
    },
    startDate() {
      const startDate = this.mediaPlan.period?.startDate
        ? new Date(this.mediaPlan.period?.startDate).toLocaleDateString(
            "pt-BR",
            {
              timeZone: "UTC",
            }
          )
        : null;
      return startDate;
    },
    currentTargetDescriptions() {
      const descriptions = this.mediaPlan.currentTarget.descriptions
      let mappedDescriptions = []

      descriptions.forEach(description => {
        const [key, value] = description.split(':')
        mappedDescriptions.push(`<div class="currentTarget-item-description"><strong>${key}:</strong> ${value}</div>`)
      })

      return mappedDescriptions.join().replace(',', '')
    }
  },
  methods: {
    ...mapMutations({
      SET_CURRENT_STEP: 'steps/SET_STEP_HEADERS',
      SET_CURRENT_TARGET: 'resume/SET_CURRENT_TARGET',
    }),
    ...mapActions({
      getLocations: 'resume/getLocations',
      getMap: 'resume/getMap',
      getMediaPlan: 'resume/getMediaPlan',
    }),
    handleFiltersDisplay() {
      this.filtersDisplay = true
    },
    handleFiltersClosing() {
      this.filtersDisplay = false
    },
    handleSizeDisplay() {
      document.getElementById('nav').style.zIndex = this.fullDisplay ? 2 : 0
      document.getElementById('appHeader').style.zIndex = this.fullDisplay ? 2 : 0
      document.getElementById('appHeader').style.zIndex = this.fullDisplay ? 2 : 0
      document.getElementsByTagName("body")[0].style.overflow = this.fullDisplay ? 'auto' : 'hidden'
      this.fullDisplay = !this.fullDisplay
    },
    previousPage() {
      this.$router.push({ name: 'Budget' })
    },
    editStep(stepName, params) {
      this.$router.push({
        name: stepName,
        params: params,
      });
    },
    generatePdf() {
      this.$refs.html2Pdf.generatePdf();
    },
    async handleMapRegionFilter(midia = "", option = true) {
      const selectedMidias = [];
      this.hasEmptySelectedMidia = option && !midia ? this.midias.filter(midia => midia.selecionado).length : true
      const newMedias = this.midias.map((midiaDetails) => {
        const map = {
          disponivel: midiaDetails.disponivel,
          nome: midiaDetails.nome,
          selecionado:
            midiaDetails.nome == midia ? option : midiaDetails.selecionado,
        };

        if (!this.hasEmptySelectedMidia) {
          switch (map.nome) {
            case "Estabelecimentos Comerciais":
              selectedMidias.push("Estabelecimentos");
              break;
            case "Mídia de rua":
              selectedMidias.push("Ruas");
              break;
            default:
              selectedMidias.push(map.nome);
              break;
          }
          return map;
        }

        if (map.selecionado) {
          switch (map.nome) {
            case "Estabelecimentos Comerciais":
              selectedMidias.push("Estabelecimentos");
              break;
            case "Mídia de rua":
              selectedMidias.push("Ruas");
              break;
            default:
              selectedMidias.push(map.nome);
              break;
          }
        }

        return map;
      });
      this.midias = newMedias;
      const newMap = handleMapFilter(this.map, selectedMidias);
      this.filteredMap = Object.assign({}, newMap);
    },
    async handleTagSelection(midia) {
      this.handleMapRegionFilter(midia, true);
    },
    handleRemoveTagSelection(midia) {
      this.handleMapRegionFilter(midia, false);
    },
    convertValue(value, type) {
      switch (type) {
        case 'currency':
          return convertValues.convertToCurrency(value)
        case 'decimal':
          return convertValues.convertToDecimal(value, 8)
        case 'float':
          return convertValues.convertToDecimal(value.toFixed(2), 8)
        default:
          break;
      }
    },
  },
  async mounted() {
    this.SET_CURRENT_STEP(
      this.stepHeaders.map((stepHeader) => {
        if (stepHeader.name === this.currentStep) stepHeader.done = true;
        return stepHeader;
      })
    );

    await Promise.all([
      this.getLocations({ mediaPlanId: this.$route.params.mediaPlanId }),
      this.getMap({ mediaPlanId: this.$route.params.mediaPlanId }),
      this.getMediaPlan({ mediaPlanId: this.$route.params.mediaPlanId }),
    ]);

    this.midias = this.medias;
    this.handleMapRegionFilter();
    this.loaded = true;

    window.scrollTo(0, 0);
  },
};
</script>
<style lang="scss" scoped>

.map-section.full-page {
  z-index: 5;
}

.map-close-icon {
  top: 16px !important;
}

  .table {
    margin-bottom: 0;
  }

  .investments-table-result {
    background: rgba(10, 203, 41, 0.12);
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 48px;

    li {
      font-family: "Inter";
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.87);
      list-style: none;
      width: 20%;
      padding-left: 26px;
      display: flex;
      align-items: center;
    }
  }

* {
  font-family: var(--font-default);
}

h5 {
  font-family: 'Inter';
  font-weight: 600;
  font-size: 14px;
  color: #1B1B1B;
  display: block;
}

.currentTarget-description {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #1B1B1B;
    display: block;

    strong {
      font-weight: 600;
    }
}

.currentTarget-item-title {
  font-family: 'Inter';
  font-weight: 600;
  font-size: 14px;
  color: #1B1B1B;
  margin-top: 16px;
  margin-bottom: 4px;
  display: block;
}

.currentTarget-item-data {
  font-family: 'Inter';
  font-weight: 400;
  font-size: 14px;
  color: #1B1B1B;
  display: block;
}

.map-section {
  width: 100%;
  height: 760px;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  background: #f2f2f2;

  &.full-page {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 0;
  }

  svg:hover {
    cursor: pointer;
  }

  .map-themes {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .map-controls {
    position: absolute;
    top: 12px;
    right: 50px;
    z-index: 2;
  }

  .map-filters {
    position: absolute;
    left: 12px;
    bottom: 24px;
    z-index: 2;

    .map-icon.ellipse {
      padding: 2px;
      background: var(--white);
      border-radius: 50%;
    }

    .mapFilters-box {
      position: absolute;
      bottom: 0;
      left: calc(26px + 12px);
      width: 340px;
      min-height: 300px;
      background: var(--white);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .mapFilters-tags {
        margin-top: 30px;
        margin-bottom: 30px;
      }

      span {
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #02060c;
      }

      svg {
        position: absolute;
        top: 4px;
        right: 16px;

        * {
          pointer-events: none;
        }
      }

      button {
        border: 0;
        background: var(--orange);
        border-radius: 8px;
        font-family: "Asap";
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        color: var(--white);
        width: 100%;
        height: 40px;
      }
    }
  }

  @media only screen and (max-width: 1350px) {
    .mapFilters-box {
      bottom: 65px !important;
    }
  }

  .mapLabels {
    position: absolute;
    bottom: 24px;
    height: 34px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    background-color: var(--white);
    border-radius: 90px;
    font-family: var(--font-default);
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
    z-index: 2;
    left: 50%;
    transform: translate(-50%, -50%);

    .mapLabels-range {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-left: 50px;

      span {
        font-family: var(--font-default);
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: #000000;

        &:first-child {
          margin-right: 7px;
        }

        &:last-child {
          margin-left: 7px;
        }
      }

      .mapLabels-color {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: block;
        box-sizing: border-box;

        &.light-blue {
          background: #82FFFF;
          border: 2px solid #75e6e6;
        }

        &.blue {
          background: #52ACFF;
          border: 2px solid #4a9be5 ;
        }

        &.light-yellow {
          background: #FFE58A;
          border: 2px solid #e6ce7c;
        }

        &.yellow {
          background: #FFD747;
          border: 2px solid #e6c140 ;
        }

        &.orange {
          background: #FFAB2E;
          border: 2px solid #e69a29;
        }

        &.red {
          background: #FF4F4F;
          border: 2px solid #e64747;
        }


        &:not(:last-child) {
          margin-right: 3px;
        }
      }
    }
  }
}

::v-deep button.btn-link {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height, or 133% */

  letter-spacing: 0.2px;
}

.download-button {
  /* Primary Default */
  color: #ff4f00;
}

.edit-button {
  color: #1890ff;
}
.resume-section {
  h3 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
  }

  .download-button {
    color: var(--orange);
  }

  .edit-button {
    color: var(--blue);
  }

  h3 {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    display: flex;
    align-items: center;
    letter-spacing: 0.2px;
    color: var(--orange);
    margin-bottom: 20px;
  }

  .row {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .col {
    padding-left: 0;
    padding-right: 0;

    &:first-child {
      padding-right: 10px;
    }

    &:last-child {
      padding-left: 10px;
    }
  }

  .resume-data.list {
    li {
      display: block;
    }
  }

  ::v-deep .table > thead {
    background: #f8f8f9;
    border: 1px solid #dcdde1;
    box-sizing: border-box;

    tr:first-child {
      height: 56px;
    }

    th {
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.2px;
      color: #1b1b1b;
      border-bottom: 0;
    }
  }

  ::v-deep .table tr {
    &:hover {
      background-color: #F6F6F8;
    }
  }

    ::v-deep
  .table.b-table.table-sm
  > thead
  > tr
  > [aria-sort].b-table-sort-icon-left,
  .table.b-table.table-sm > tfoot > tr > [aria-sort].b-table-sort-icon-left {
    background-position: left 25px center;
    padding-left: 45px;
  }

  ::v-deep .table-sm th,
  ::v-deep .table-sm td {
    padding-left: 26px;
    vertical-align: middle;
  }

  ::v-deep .table > tbody {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: rgba(0, 0, 0, 0.87);

    tr {
      background-color: #fff;
      border-bottom: 1px solid #dcdde1;

      td {
        height: 48px;
      }
    }
  }
}

  ::v-deep .table#investments-table > tbody tr td {
    width: 15%;
  }

  .pagination.m-0 {
    margin-top: 20px !important;
    margin-left: auto !important;
  }

  #footer {
    background: var(--white);
    position: fixed;
    bottom: 0;
    width: calc(100% - 50px);
    left: 50px;
    padding: 15px 15px;
    border: 1px solid var(--light-gray2);
  }
</style>
