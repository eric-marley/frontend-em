<template>
  <div class="inputList">
    <div class="inputList__group">
      <b-form-group
        id="logradouro"
        label="Logradouro"
        label-for="logradouro-input"
      >
        <b-form-input
          id="logradouro-input"
          v-model="inputs.logradouro"
          trim
          @blur="validateOnBlur('logradouro')"
          :state="fieldHasError('logradouro')"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="numero" label="Número" label-for="numero-input">
        <b-form-input
          id="numero-input"
          :state="fieldHasError('numero')"
          @blur="validateOnBlur('numero')"
          v-model="inputs.numero"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group id="bairro" label="Bairro" label-for="bairro-input">
        <b-form-input
          id="bairro-input"
          v-model="inputs.bairro"
          :state="fieldHasError('bairro')"
          @blur="validateOnBlur('bairro')"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group id="cidade" label="Cidade" label-for="cidade-input">
        <b-form-input
          id="cidade-input"
          v-model="inputs.cidade"
          :state="fieldHasError('cidade')"
          @blur="validateOnBlur('cidade')"
          trim
        ></b-form-input>
      </b-form-group>
    </div>
    <div class="inputList__group">
      <b-form-group id="estado" label="Estado" label-for="estado-input">
        <b-form-input
          id="estado-input"
          v-model="inputs.estado"
          :state="fieldHasError('estado')"
          @blur="validateOnBlur('estado')"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group id="cep" label="CEP" label-for="cep-input">
        <b-form-input
          id="cep-input"
          v-model="inputs.cep"
          :state="fieldHasError('cep')"
          @blur="validateOnBlur('cep')"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group id="latitude" label="Latitude" label-for="latitude-input">
        <b-form-input
          id="latitude-input"
          v-model="inputs.latitude"
          :state="fieldHasError('latitude')"
          @blur="validateOnBlur('latitude')"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="longitude"
        label="Longitude"
        label-for="longitude-input"
      >
        <b-form-input
          id="longitude-input"
          v-model="inputs.longitude"
          :state="fieldHasError('longitude')"
          @blur="validateOnBlur('longitude')"
          trim
        ></b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  validateFormSubmit,
  isLatitudeValid,
  isLongitudeValid,
  isCepValid,
  isEstadoValid,
  validateGeneralField,
} from "../helpers/validation";

export default {
  name: "EditForm",
  props: {
    editLocationFields: {
      type: Object,
      required: true,
    },
    bus: {
      type: Vue,
    },
  },
  beforeMount: function () {
    this.inputs = Object.assign({}, this.inputs, this.editLocationFields);
  },
  data() {
    return {
      inputs: {
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        latitude: "",
        longitude: "",
      },
      inputsFormStatus: {
        logradouro: null,
        numero: null,
        bairro: null,
        cidade: null,
        estado: null,
        cep: null,
        latitude: null,
        longitude: null,
      },
    };
  },
  mounted() {
    this.bus.$on("submit", this.validateUserForm);
  },
  methods: {
    fieldHasError: function (value) {
      return this.inputsFormStatus[value];
    },
    validateUserForm: function () {
      const formValidation = validateFormSubmit(this.inputs);
      this.inputsFormStatus = formValidation;
      if (formValidation.isValid) {
        return this.$emit("finalSubmit", this.inputs);
      }
    },
    validateOnBlur: function (field) {
      switch (field) {
        case "latitude":
          this.inputsFormStatus[field] = isLatitudeValid(this.inputs.latitude);
          break;
        case "longitude":
          this.inputsFormStatus[field] = isLongitudeValid(
            this.inputs.longitude
          );
          break;
        case "estado":
          this.inputsFormStatus[field] = isEstadoValid(this.inputs.estado);
          break;
        case "cep":
          this.inputsFormStatus[field] = isCepValid(this.inputs.cep);
          break;
        default:
          this.inputsFormStatus[field] = validateGeneralField(
            this.inputs[field]
          );
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.inputList {
  display: flex;

  &__group:nth-child(1) {
    margin-right: 25px;
  }

  &__group {
    flex: 50%;

    input {
      border-radius: 8px;
      height: 50px;
    }

    label {
      color: grey !important;
      font-size: small !important;
    }
  }
}
</style>