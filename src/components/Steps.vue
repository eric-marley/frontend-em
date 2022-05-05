<template>
  <section>
    <b-list-group horizontal v-if="user.username">
      <b-list-group-item
        class="bg-transparent border-0"
        v-for="stepHeader in steps"
        :key="stepHeader.name"
      >
        <span class="step-description">
          <b-button
            variant="outline-light"
            class="rounded-circle step-button cursor-normal"
            :class="{ 
              active: stepHeader.active,
              'can-navigate': canNavigate(stepHeader)  
            }"
            @click="navigateTo(stepHeader)"
          >
            {{ stepHeader.index }}
          </b-button>
          {{ stepHeader.description }}
        </span>
      </b-list-group-item>
    </b-list-group>
    <div v-if="currentStep.name === 'resume'" class="step-buttons ml-auto">
      <b-button id="new-simulation" variant="primary" class="step-button" @click="newSimulation" v-if="user.username">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.54395 7.34375V6C1.54395 5.72917 1.59603 5.47396 1.7002 5.23438C1.80436 4.98438 1.94499 4.77083 2.12207 4.59375C2.30957 4.40625 2.52311 4.26042 2.7627 4.15625C3.00228 4.05208 3.2627 4 3.54395 4H11.2627L9.73145 5.53125C9.60645 5.66667 9.54395 5.82812 9.54395 6.01562C9.54395 6.19271 9.60645 6.34375 9.73145 6.46875C9.86686 6.60417 10.0231 6.67188 10.2002 6.67188C10.3877 6.67188 10.5439 6.60417 10.6689 6.46875L13.3408 3.8125C13.3721 3.78125 13.3981 3.75 13.4189 3.71875C13.4502 3.67708 13.471 3.63542 13.4814 3.59375C13.5023 3.55208 13.5179 3.51042 13.5283 3.46875C13.5387 3.42708 13.5439 3.38542 13.5439 3.34375C13.5439 3.30208 13.5387 3.26042 13.5283 3.21875C13.5179 3.16667 13.5023 3.11979 13.4814 3.07812C13.471 3.04688 13.4502 3.01562 13.4189 2.98438C13.3981 2.94271 13.3721 2.90625 13.3408 2.875L10.6689 0.203125C10.5439 0.0677083 10.3877 0 10.2002 0C10.0231 0 9.86686 0.0677083 9.73145 0.203125C9.60645 0.328125 9.54395 0.484375 9.54395 0.671875C9.54395 0.859375 9.60645 1.01562 9.73145 1.14062L11.2627 2.67188H3.54395C3.08561 2.67188 2.65332 2.76042 2.24707 2.9375C1.84082 3.11458 1.48665 3.34896 1.18457 3.64062C0.882487 3.94271 0.642904 4.29688 0.46582 4.70312C0.288737 5.10938 0.200195 5.54167 0.200195 6V7.34375C0.200195 7.52083 0.262695 7.67708 0.387695 7.8125C0.523112 7.9375 0.68457 8 0.87207 8C1.05957 8 1.21582 7.9375 1.34082 7.8125C1.47624 7.67708 1.54395 7.52083 1.54395 7.34375ZM12.2002 8.67188V10C12.2002 10.2812 12.1481 10.5417 12.0439 10.7812C11.9398 11.0208 11.7992 11.2344 11.6221 11.4219C11.4346 11.599 11.221 11.7396 10.9814 11.8438C10.7419 11.9479 10.4814 12 10.2002 12H2.48145L4.0127 10.4688C4.1377 10.3438 4.2002 10.1927 4.2002 10.0156C4.2002 9.82812 4.1377 9.66667 4.0127 9.53125C3.87728 9.40625 3.71582 9.34375 3.52832 9.34375C3.35124 9.34375 3.2002 9.40625 3.0752 9.53125L0.40332 12.2031C0.37207 12.2344 0.34082 12.2708 0.30957 12.3125C0.288737 12.3438 0.273112 12.3802 0.262695 12.4219C0.210612 12.5365 0.194987 12.6615 0.21582 12.7969C0.236654 12.9323 0.299154 13.0469 0.40332 13.1406L3.0752 15.8125C3.2002 15.9375 3.35124 16 3.52832 16C3.71582 16 3.87728 15.9375 4.0127 15.8125C4.1377 15.6771 4.2002 15.5156 4.2002 15.3281C4.2002 15.151 4.1377 15 4.0127 14.875L2.48145 13.3438H10.2002C10.6585 13.3438 11.0908 13.2552 11.4971 13.0781C11.9033 12.901 12.2575 12.6615 12.5596 12.3594C12.8617 12.0573 13.1012 11.7031 13.2783 11.2969C13.4554 10.8906 13.5439 10.4583 13.5439 10V8.67188C13.5439 8.48438 13.4762 8.32812 13.3408 8.20312C13.2158 8.06771 13.0596 8 12.8721 8C12.6846 8 12.5231 8.06771 12.3877 8.20312C12.2627 8.32812 12.2002 8.48438 12.2002 8.67188Z"
            fill="#FF4F00"
          />
        </svg>
        Fazer nova simulação
      </b-button>
      <b-button id="share" variant="primary" class="step-button" @click="openModal">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.0002 1.99996C10.2638 1.99996 9.66683 2.59691 9.66683 3.33329C9.66683 4.06967 10.2638 4.66663 11.0002 4.66663C11.7365 4.66663 12.3335 4.06967 12.3335 3.33329C12.3335 2.59691 11.7365 1.99996 11.0002 1.99996ZM8.3335 3.33329C8.3335 1.86053 9.5274 0.666626 11.0002 0.666626C12.4729 0.666626 13.6668 1.86053 13.6668 3.33329C13.6668 4.80605 12.4729 5.99996 11.0002 5.99996C9.5274 5.99996 8.3335 4.80605 8.3335 3.33329Z"
            fill="#FF4F00"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.00016 6.66663C2.26378 6.66663 1.66683 7.26358 1.66683 7.99996C1.66683 8.73634 2.26378 9.33329 3.00016 9.33329C3.73654 9.33329 4.3335 8.73634 4.3335 7.99996C4.3335 7.26358 3.73654 6.66663 3.00016 6.66663ZM0.333496 7.99996C0.333496 6.5272 1.5274 5.33329 3.00016 5.33329C4.47292 5.33329 5.66683 6.5272 5.66683 7.99996C5.66683 9.47272 4.47292 10.6666 3.00016 10.6666C1.5274 10.6666 0.333496 9.47272 0.333496 7.99996Z"
            fill="#FF4F00"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.0002 11.3333C10.2638 11.3333 9.66683 11.9302 9.66683 12.6666C9.66683 13.403 10.2638 14 11.0002 14C11.7365 14 12.3335 13.403 12.3335 12.6666C12.3335 11.9302 11.7365 11.3333 11.0002 11.3333ZM8.3335 12.6666C8.3335 11.1939 9.5274 9.99996 11.0002 9.99996C12.4729 9.99996 13.6668 11.1939 13.6668 12.6666C13.6668 14.1394 12.4729 15.3333 11.0002 15.3333C9.5274 15.3333 8.3335 14.1394 8.3335 12.6666Z"
            fill="#FF4F00"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.42184 8.90698C4.60721 8.58886 5.01538 8.48125 5.3335 8.66663L9.3335 11C9.65162 11.1853 9.75923 11.5935 9.57385 11.9116C9.38848 12.2297 8.98031 12.3373 8.66219 12.152L4.66219 9.81864C4.34407 9.63326 4.23646 9.2251 4.42184 8.90698Z"
            fill="#FF4F00"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.57327 4.08815C9.75885 4.40615 9.6515 4.81438 9.3335 4.99996L5.33887 7.48488C5.02087 7.67045 4.61264 7.5631 4.42706 7.2451C4.24148 6.9271 4.34883 6.51887 4.66683 6.33329L8.66146 3.84838C8.97946 3.6628 9.38769 3.77015 9.57327 4.08815Z"
            fill="#FF4F00"
          />
        </svg>
        Compartilhar
      </b-button>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Steps",
  props: {
    current: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentStep: null,
      steps: [
        {
          index: 1,
          name: "local",
          description: "Identificação e locais",
          active: true,
        },
        {
          index: 2,
          name: "target",
          description: "Target",
          active: true,
        },
        {
          index: 3,
          name: "media",
          description: "Mídias e período",
          active: true,
        },
        {
          index: 4,
          name: "budget",
          description: "Budget",
          active: true,
        },
        {
          index: 5,
          name: "resume",
          description: "Resumo",
          active: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      stepHeaders: "steps/stepHeaders",
      maxStep: "steps/maxStep",
      shareModalView: "resume/shareModalView",
      account: "account/account",
      user: "auth/getUser",
      mediaPlan: "media_plans/mediaPlan"
    }),
  },
  methods: {
    ...mapMutations({
      SET_CURRENT_STEP: "steps/SET_STEP_HEADERS",
      SET_MAX_STEP: "steps/SET_MAX_STEP",
      SET_SHARE_MODAL_DISPLAY: "resume/SET_SHARE_MODAL_DISPLAY",
      RESET_MEDIA_PLAN: 'media_plans/RESET',
      RESET_MEDIAS: 'medias/RESET',
      RESET_TARGET: 'targets/RESET',
      RESET_BUDGET: 'budget/RESET',
      RESET_RESUME: 'resume/RESET',
      RESET_STEPS: 'steps/RESET',
    }),
    canNavigate(stepHeader) {
      return (this.maxStep >= stepHeader.index) && (this.currentStep.index != stepHeader.index);
    },
    openModal() {
      this.SET_SHARE_MODAL_DISPLAY(true);
    },
    newSimulation() {
      this.RESET_MEDIA_PLAN();
      this.RESET_TARGET();
      this.RESET_MEDIAS();
      this.RESET_BUDGET();
      this.RESET_RESUME();
      this.RESET_STEPS();

      this.$router.push({
        name: "IdentificationLocals",
        params: { accountId: this.account._id },
      });
    },
    compareStep(stepName, currentPath){
      const stepStatus = {
        local: 'IdentificationLocals',
        target: 'Target',
        media: 'ActivesPeriod',
        budget: 'Budget',
        resume: 'Resume',
      }
      return stepStatus[stepName] === currentPath
    },
    navigateTo(stepHeader) {
      const stepStatus = {
        local: 'IdentificationLocals',
        target: 'Target',
        media: 'ActivesPeriod',
        budget: 'Budget',
        resume: 'Resume',
      }

      let params = {}
      switch (stepStatus[stepHeader.name]) {
        case 'IdentificationLocals':
          params = {accountId: this.account._id};
          break;
        
        case 'Resume':
          params = {mediaPlanId: this.mediaPlan._id};
          break;
      }

      if ((this.maxStep >= stepHeader.index) && (this.currentStep.index != stepHeader.index)) 
      {
        this.$router.push({
          name: stepStatus[stepHeader.name],
          params: params,
        });
      }
    },
  },
  created() {
    // Logic current step - linked with router name
    let newStep = this.steps.map(step => ({
      ...step,
      active: this.compareStep(step.name, this.$router.currentRoute.name)
    }))
    const indexStep = newStep.findIndex(item => item.active)
    newStep = newStep.map((step, i) => ({
      ...step,
      active: i <= indexStep
    }))
    this.steps = newStep

    this.SET_CURRENT_STEP(
      this.stepHeaders.map((stepHeader, index) => {
        if (this.compareStep(stepHeader.name, this.$router.currentRoute.name)) {
          stepHeader.active = true;
          this.currentStep = stepHeader;
        }

        if (this.currentStep && ++index > this.currentStep.index) {
          stepHeader.active = false;
        }

        return stepHeader;
      })
    );

    if (this.currentStep.index > this.maxStep) {
      this.SET_MAX_STEP(this.currentStep.index);
    }
  },
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.step-buttons {
  display: flex;
  align-items: center;

  .step-button {
    background: #ffffff;
    color: var(--orange);
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    border-radius: 4px;
    padding: 12px 18px;
    display: flex;
    align-items: center;

    &:last-child {
      margin-left: 16px;
    }

    svg {
      margin-right: 6px;
    }
  }
}

.cursor-normal {
  cursor: inherit !important;
}

.list-group {
  margin: 30px 0 0 0;
}

.list-group-item {
  padding: 0;
  margin: 0 20px 0 0;
}

.step-description {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: var(--white);
  display: flex;
  align-items: center;
}

.btn.rounded-circle.btn-outline-light.step-button {
  font-family: var(--font-default);
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  color: var(--white);
  width: 28px;
  height: 28px;
  margin-right: 7.5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.active{
    color: var(--green);
    background: #f8f9fa;
  }

  &.can-navigate {
    cursor: pointer !important;
    &:hover {
      color: var(--green) !important;
      background: #f9f9f9cc !important;
    }
  }

  &:hover {
    &:not(.active){
      background: #007800;
    }
  }

  &:focus {
    box-shadow: none !important;
  }
}

#share, #new-simulation {
  &:hover {
    background: var(--green);
    color: var(--white);
    border-color: var(--white);

     svg {
       path {
         fill: var(--white) !important;
       }
    }
  }
}
</style>