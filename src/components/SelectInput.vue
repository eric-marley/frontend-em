<template>
  <div>
    <div v-if="!withSearch">
      <b-form-select
        @change="handleSelectChange"
        v-model="selected"
        :options="options"
      ></b-form-select>
    </div>
    <div v-else class="autocomplete">
      <b-form-input
        v-model="selected"
        list="selectList"
        :placeholder="placeholder"
        type="text"
        autocomplete="off"
        data-cy="input-dropdown"
        @click="handleExpandOn"
        @blur="handleExpandOff"
      ></b-form-input>

      <div id="selectList" :class="`dropdown-list ${options.length ? `border-dropdown` : ``}`" :data-expand="`${expand}`">
        <div v-if="!loading && options.length">
          <b-dropdown-item :key="option.value" v-for="(option, index) in options" :data-cy="`input-dropdown-item-${index}`" @click="handleClick(option.text)" >{{ option.text }}</b-dropdown-item>
        </div>
        <div class="feedback border-dropdown" v-else-if="loading">
          Carregando ...
        </div>
        <div class="feedback border-dropdown" v-else-if="!options.length && selected.length">
          Nenhuma região encontrada
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Selectinput",
    props: {
      options: {
        type: Array,
        required: true,
      },
      handleChange: {
        type: Function,
        required: true,
      },
      withSearch: {
        type: Boolean,
        required: false,
        default: false,
      },
      placeholder: {
        type: String,
        required: false,
        default: "",
      },
      selectedOption: {
        type: String,
        required: false,
        default: "",
      },
      emitOnChange: {
        type: Function,
        required: false,
      },
      error: {
        type: Boolean,
        required: false,
        default: false
      },
      errorMessage: {
        type: String,
        required: false,
        default: ''
      },
    },
    data() {
      return {
        selected: this.selectedOption,
        timeout: undefined,
        expand: false,
        loading: false
      };
    },
    methods: {
      handleSelectChange: function (value) {
        const [option] = this.options.filter((opt) => opt.text === value);

        this.handleChange(option);
        if (this.withSearch) {
          this.selected = null;
          this.expand = false
          this.emitOnChange('');
          return;
        }
        this.selected = value;
        this.expand = false
      },
      handleClick: function (value) {
        this.handleSelectChange(value)
      },
      handleExpandOn: function () {
          this.expand = true
      },
      handleExpandOff: function () {
        setTimeout(() => {
          this.expand = false
        }, 300)
      }
    },
    watch: {
      selected: {
        handler(value) {
          this.loading = true
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.emitOnChange(value);
            this.loading = false
          }, 500);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dropdown-list{
    position: absolute;
    list-style: none;
    background: white;
    width: 100%;
    bottom: 38px;
    overflow-y: auto;
    border-radius: 0.25rem;
    transform-origin: bottom;
    max-height: 125px;
    &[data-expand="false"]{
      display: none;
    }
  }
  .border-dropdown {
    border: 1px solid #ccc;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .feedback {
    font-size: 14px;
    text-align: center;
    padding: 10px;
  }

  .autocomplete {
    position: relative;
  }
</style>