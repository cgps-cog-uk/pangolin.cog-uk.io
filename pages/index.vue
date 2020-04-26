<template>
  <client-only>
    <data-grid v-if="data.length" />
    <files-uploader v-else />
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";

import FilesUploader from "~/components/FilesUploader.vue";
import DataGrid from "~/components/DataGrid.vue";

export default {
  middleware: "auth",
  components: {
    DataGrid,
    FilesUploader,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      data: "entries",
    }),
  },
  methods: {
    setFilter(filter) {
      this.$store.commit("setFilter", filter);
    },
    startAnalysis() {
      const item = this.data.find((x) => x.status === "Pending");
      if (item) {
        this.$store.dispatch("analyse", item.id)
          .catch((error) => console.error(error))
          .then(() => {
            setTimeout(() => this.startAnalysis(), 0);
          });
      }
    },
  },
};
</script>
