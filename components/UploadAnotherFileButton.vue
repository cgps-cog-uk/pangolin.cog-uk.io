<template>
  <label
    class="button--pangolin-blue"
    for="file-upload"
    role="button"
  >
    Upload another file
    <input
      id="file-upload"
      ref="file-input"
      type="file"
      multiple="multiple"
      v-on:change="handleFileChange"
    >
  </label>
</template>

<script>
import { mapMutations } from "vuex";
import sequencesFromFiles from "../assets/scripts/sequences-from-files";

export default {

  methods: {
    ...mapMutations({
      enqueueFiles: "addSequencesToQueue",
      updateSnackbar: "updateSnackbar",
      hideSnackbar: "hideSnackbar",
    }),
    handleFileChange(event) {
      this.hideSnackbar();
      const files = event.target.files;
      if (files.length) {
        this.updateSnackbar("Compressing sequences ....");
        sequencesFromFiles(files)
          .then((sequences) => this.enqueueFiles(sequences))
          .catch((err) => this.updateSnackbar(err.message || err));
      }
    },
    setInfoMessage(message) {
      this.message = message;
    },
  },
};
</script>

<style scoped>
input[type="file"] {
  width: 0;
  position: absolute;
  overflow: hidden;
  opacity: 0;
  height: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* label {
  background-color:#0060df;
  color:#fff;
  cursor: pointer;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 16px;
} */
</style>
