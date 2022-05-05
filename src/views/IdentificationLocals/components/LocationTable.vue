<template>
  <div>
  <b-table
    no-border-collapse
    head-variant="light"
    hover
    :items="data"
    :fields="columnFields"
      :per-page="perPage"
      :current-page="currentPage"
  >
    <template #cell(logradouro)="row">
      <b-icon
      v-if="row.item.erro"
        icon="BIconInfo-circle"
        class="mr-2"
        style="color: red"
        aria-hidden="true"
      />
      {{ row.item.logradouro }}
    </template>
    <template #cell(icon)="row">
      <b-button
        @click="handleEditLocation(row)"
        variant="primary"
        class="address__editButton mb-4"
      >
        <b-icon icon="BIconPencil-square" aria-hidden="true" />
      </b-button> </template
  ></b-table>
    <b-pagination
      :total-rows="data.length"
      v-model="currentPage"
      :per-page="perPage"
    ></b-pagination>
  </div>
</template>

<script>
export default {
  name: "LocationTable",
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    columnFields: {
      type: Array,
      required: true,
      default: () => [],
    },
    handleEditLocation: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      currentPage: 0,
      perPage: 5,
    };
  },
};
</script>