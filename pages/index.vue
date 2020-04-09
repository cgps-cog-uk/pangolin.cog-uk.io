<template>
  <section>
    <nav>
      <template
        v-if="!uploading"
      >
        <button
          v-if="mode === 'data'"
          class="button--green"
          v-on:click="startUpload"
        >
          Start Upload
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
      uploading: "uploading",
    }),
  },
  methods: {
    setFilter(filter) {
      this.$store.commit("setFilter", filter);
    },
    startUpload() {
      const entry = this.data.entries.find((x) => x.Status === "Pending");
      if (entry) {
        this.$store.dispatch("uploadEntry", entry._id)
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
