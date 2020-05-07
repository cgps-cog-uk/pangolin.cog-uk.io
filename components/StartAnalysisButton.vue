<template>
  <button
    v-if="hasPendingEntries"
    class="button--pangolin-red"
    v-on:click="startAnalysis"
  >
    Start analysis
  </button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      data: "entries",
    }),
    hasPendingEntries() {
      return this.data.some((x) => x.status === "Pending");
    },
  },
  methods: {
    startAnalysis() {
      const item = this.data.find((x) => x.status === "Pending");
      if (item) {
        this.$store.dispatch("uploadOne", item.id)
          .catch((error) => console.error(error))
          .then(() => {
            setTimeout(() => this.startAnalysis(), 500);
          });
      }
    },
  },
};
</script>

<style scoped>
</style>
