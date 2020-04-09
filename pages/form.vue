<template>
  <section>
    <div
      v-if="status"
    >
      <v-alert type="success">
        Biosample was {{ status }} successfully.
      </v-alert>
      <v-btn
        color="primary"
        v-on:click="resetForm"
      >
        Submit another Biosample
      </v-btn>
      <v-btn
        to="/"
        text
      >
        Go back
      </v-btn>
    </div>

    <v-form
      v-else
      v-model="isFormValid"
    >
      <h2>
        Submit Biosample
      </h2>
      <v-alert
        v-if="!!error"
        type="error"
      >
        {{ error.message || error }}
      </v-alert>

      <div
        class="v-item-group theme--light v-expansion-panels v-expansion-panels--accordion"
      >
        <expansion-panel
          title="Sample Metadata"
        >
          <input-control
            v-for="(arg) in biosampleSectionInputs"
            v-bind:key="arg.name"
            v-model="formValues[arg.name]"
            v-bind:description="arg.description"
            v-bind:error-messages="messages[arg.name]"
            v-bind:enum-values="arg.enum"
            v-bind:label="arg.label"
            v-bind:name="arg.name"
            v-bind:required="arg.required"
            v-bind:type="arg.type"
            v-on:input="resetInputMessage(arg.name)"
          />
        </expansion-panel>

        <expansion-panel
          v-if="hasSequenceMetadata"
          title="Library Metadata"
        >
          <input-control
            v-for="(arg) in librarySectionInputs"
            v-bind:key="arg.name"
            v-model="formValues[arg.name]"
            v-bind:description="arg.description"
            v-bind:enum-values="arg.enum"
            v-bind:label="arg.label"
            v-bind:name="arg.name"
            v-bind:required="arg.required"
            v-bind:type="arg.type"
            v-on:input="resetInputMessage(arg.name)"
          />
        </expansion-panel>

        <expansion-panel
          v-if="hasSequenceMetadata"
          title="Sequencing Metadata"
        >
          <input-control
            v-for="(arg) in sequencingSectionInputs"
            v-bind:key="arg.name"
            v-model="formValues[arg.name]"
            v-bind:description="arg.description"
            v-bind:enum-values="arg.enum"
            v-bind:label="arg.label"
            v-bind:name="arg.name"
            v-bind:required="arg.required"
            v-bind:type="arg.type"
            v-on:input="resetInputMessage(arg.name)"
          />
        </expansion-panel>
      </div>

      <v-btn
        v-bind:disabled="!isFormValid"
        color="primary"
        v-on:click="submitForm"
      >
        SUBMIT
      </v-btn>

      <v-btn
        text
        v-on:click="toggleSequenceMetadata"
      >
        <v-icon left>
          {{ hasSequenceMetadata ? "mdi-minus-circle-outline" : "mdi-plus-circle-outline" }}
        </v-icon>
        {{ hasSequenceMetadata ? "Remove" : "Add" }} library and sequencing metadata
      </v-btn>

      <!--
      <v-btn
        to="/"
        text
      >
        Go back
      </v-btn>
      -->
    </v-form>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

import ExpansionPanel from "~/components/ExpansionPanel.vue";
import InputControl from "~/components/InputControl/index.vue";

export default {
  middleware: "auth",
  components: {
    ExpansionPanel,
    InputControl,
  },
  data() {
    return {
      error: null,
      formValues: {},
      hasSequenceMetadata: false,
      isFormValid: false,
      messages: {},
      status: null,
    };
  },
  computed: {
    ...mapGetters({
      formInputs: "formInputs",
    }),
    biosampleSectionInputs() {
      return this.formInputs.filter((x) => x.section === "biosample");
    },
    librarySectionInputs() {
      return this.formInputs.filter((x) => x.section === "library");
    },
    sequencingSectionInputs() {
      return this.formInputs.filter((x) => x.section === "sequencing");
    },
  },
  methods: {
    submitForm() {
      const sampleData = {};
      for (const input of this.formInputs) {
        if (input.section === "biosample" || this.hasSequenceMetadata) {
          sampleData[input.name] = this.formValues[input.name];
        }
      }
      this.$axios.$post("/api/data/submit/", sampleData)
        .then((results) => {
          this.messages = results.messages;
          if (results.success) {
            this.status = results.status;
          }
          else {
            this.error = results.error;
          }
        })
        .catch((err) => {
          console.error(err);
          const error = (err.response) ? err.response.data : err;
          this.error = error.message || error;
        });
    },
    resetForm() {
      this.error = null;
      this.formValues = {};
      this.hasSequenceMetadata = false;
      this.isFormValid = false;
      this.messages = {};
      this.status = null;
    },
    resetInputMessage(name) {
      const messages = {};
      for (const key of Object.keys(this.messages)) {
        if (key !== name) {
          messages[key] = this.messages[key];
        }
      }
      this.messages = messages;
    },
    toggleSequenceMetadata() {
      this.hasSequenceMetadata = !this.hasSequenceMetadata;
    },
  },
};
</script>

<style scoped>
section {
  width: 100%;
}
.v-expansion-panels {
  margin: 16px 0;
}
.v-form >>> .v-input {
  margin-bottom: 16px;
}
@media (min-width:768px) {
  section {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
