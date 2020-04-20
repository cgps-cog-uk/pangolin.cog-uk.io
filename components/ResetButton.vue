<template>
  <button
    v-if="hasEntries"
    class="button--pangolin-blue"
    v-on:click="resetEntries"
  >
    Reset entries
  </button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      data: "entries",
    }),
    hasEntries() {
      return this.data.length > 0;
    },
  },
  methods: {
    resetEntries() {
      this.$store.dispatch("resetState");
    },
  },
};
</script>

<style scoped>
</style>
