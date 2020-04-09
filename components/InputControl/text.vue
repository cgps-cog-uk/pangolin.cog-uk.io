<template>
  <v-textarea
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
    rows="1"
    v-on:input="$emit('input', $event)"
  />
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
};
</script>
