<template>
  <v-datetime-picker
    date-format="yyyy-MM-dd"
    v-bind:label="label"
    scrollable
    v-bind:text-field-props="textFieldProps"
    time-format="hh:mm"
    v-bind:value="value"
    v-on:input="handleInput"
  >
    <template v-slot:dateIcon>
      <v-icon>mdi-calendar</v-icon>
    </template>
    <template v-slot:timeIcon>
      <v-icon>mdi-clock</v-icon>
    </template>
  </v-datetime-picker>
</template>

<script>
import VDatetimePicker from "vuetify-datetime-picker/src/components/DatetimePicker.vue";

export default {
  components: {
    VDatetimePicker,
  },
  props: {
    description: String,
    errorMessages: null,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: null,
  },
  computed: {
    textFieldProps() {
      return {
        errorMessages: this.errorMessages,
        dense: true,
        hideDetails: this.inline,
        hint: this.inline ? undefined : this.description,
        name: this.name,
        required: this.required,
        rules: this.rules,
        value: this.value,
        label: this.label,
        outlined: true,
        persistentHint: true,
      };
    },
  },
  methods: {
    handleInput($event) {
      this.$emit("input", $event);
    },
  },
};
</script>
