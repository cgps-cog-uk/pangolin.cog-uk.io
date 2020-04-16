<template>
  <section>
    <nav>
      <template
        v-if="!analysing"
      >
        <button
          v-if="mode === 'data'"
          class="button--green"
          v-on:click="startUpload"
        >
          Start Analysis
        </button>
      </template>
      <upload-another-file-button
        v-if="mode === 'data'"
        class="button--grey"
      >
        Upload another file
      </upload-another-file-button>
    </nav>
    <files-uploader v-if="mode === 'files'" />
    <data-grid v-if="mode === 'data'" />
  </section>
</template>

<script>
import { mapState } from "vuex";

import FilesUploader from "~/components/FilesUploader.vue";
import DataGrid from "~/components/DataGrid.vue";
import UploadAnotherFileButton from "~/components/UploadAnotherFileButton";

export default {
  middleware: "auth",
  components: {
    DataGrid,
    FilesUploader,
    UploadAnotherFileButton,
  },
  computed: {
    ...mapState({
      data: "data",
      mode: "mode",
      analysing: "analysing",
    }),
  },
  methods: {
    setFilter(filter) {
      this.$store.commit("setFilter", filter);
    },
    startUpload() {
      const item = this.data.find((x) => x.status === "Pending");
      if (item) {
        this.$store.dispatch("analyse", item.id)
          .catch((error) => console.error(error))
          .then(() => {
            setTimeout(() => this.startUpload(), 0);
          });
      }
    },
  },
};
</script>

<style scoped>
nav {
  position: fixed;
  top: 32px;
  left: 8px;
  z-index: 1;
}
@media (max-width:768px) {
  nav button {
    padding: 0 1px;
    margin: 0;
    border: 0;
  }
}
@media (min-width:768px) {
  nav {
    position: fixed;
    top: 11px;
    right: 96px;
    left: unset;
  }
}
</style>
