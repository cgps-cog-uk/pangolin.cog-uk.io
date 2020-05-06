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
  computed: {
    ...mapGetters({
      data: "entries",
    }),
  },
  methods: {
  },
};
</script>
