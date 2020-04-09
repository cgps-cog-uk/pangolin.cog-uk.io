<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <div
        v-on:click="handleClick"
      >
        <v-text-field
          v-bind:error-messages="errorMessages"
          dense
          v-bind:hide-details="inline ? true : false"
          v-bind:hint="inline ? undefined : description"
          v-bind:label="label"
          v-bind:name="name"
          v-bind:required="required"
          v-bind:rules="rules"
          v-bind:value="value"
          outlined
          persistent-hint
          readonly
          v-on="on"
        />
      </div>
    </template>
    <v-date-picker
      v-bind:value="value"
      scrollable
      v-on:input="handleInput"
    >
      <v-spacer />
      <v-btn
        color="primary"
        text
        v-on:click="modal = false"
      >
        Close
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>

export default {
  props: {
    description: String,
    errorMessages: null,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: String,
  },
  data() {
    return {
      modal: false,
    };
  },
  methods: {
    handleClick($event) {
      this.modal = true;
    },
    handleInput($event) {
      this.$emit("input", $event);
      this.modal = false;
    },
  },
};
</script>
