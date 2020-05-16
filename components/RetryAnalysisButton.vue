<template>
  <button
    v-if="hasFailedEntries"
    class="button--pangolin-pink"
    v-on:click="resetFailedEntries"
  >
    Retry Failed Sequences
  </button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      data: "entries",
    }),
    hasFailedEntries() {
      return this.data.some((x) => x.status === "Failed");
    },
  },
  methods: {
    resetFailedEntries() {
      const items = this.data.filter((x) => x.status === "Failed");
      if (items) {
        items.forEach((item) => {
          this.$store.commit("setEntryStatus", { entryId: item.id, status: "Pending" });
        });
      }
    },
  },
};
</script>

<style scoped>
</style>
