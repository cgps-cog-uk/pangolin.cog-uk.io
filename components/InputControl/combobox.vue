<template>
  <v-autocomplete
    v-bind:error-messages="errorMessages"
    dense
    v-bind:hide-details="inline ? true : false"
    v-bind:hint="inline ? undefined : description"
    v-bind:items="enumValues"
    v-bind:label="label"
    v-bind:name="name"
    outlined
    persistent-hint
    v-bind:required="required"
    v-bind:rules="rules"
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    description: String,
    enumValues: Array,
    errorMessages: null,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: String,
  },
};
</script>
