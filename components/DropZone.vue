<template>
  <div
    ref="drop-target"
    class="upload-files"
  >
    <div class="label-1">
      Drag and drop files
    </div>
    <input
      id="file-upload"
      ref="file-input"
      type="file"
      multiple="multiple"
      v-on:change="handleFileChange"
    >
    <label
      role="button"
      title="Select files to upload"
      for="file-upload"
    >
      Select files to upload
    </label>
    <div>or</div>
    <nuxt-link
      to="/form"
    >
      Add a single entry
    </nuxt-link>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import dataFromFile from "../assets/scripts/data-from-file";

export default {
  data() {
    return {
      message: "",
    };
  },
  mounted() {
    this.$refs["drop-target"].addEventListener("dragenter", this.handleDragover, false);
    this.$refs["drop-target"].addEventListener("dragover", this.handleDragover, false);
    this.$refs["drop-target"].addEventListener("drop", this.handleFileDrop, false);
  },
  beforeDestroy() {
    this.$refs["drop-target"].removeEventListener("dragenter", this.handleDragover);
    this.$refs["drop-target"].removeEventListener("dragover", this.handleDragover);
    this.$refs["drop-target"].removeEventListener("drop", this.handleFileDrop);
  },
  methods: {
    ...mapMutations({
      setData: "setData",
      setUploading: "setUploading",
    }),
    handleFileChange(event) {
      const files = event.target.files;
      this.processFiles(files);
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleFileDrop(event) {
      event.stopPropagation();
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length) {
        this.processFiles(files);
      }
    },
    selectFiles() {
      this.$refs["file-input"].click();
    },
    setInfoMessage(message) {
      this.message = message;
    },
    processFiles(files) {
      if (files.length) {
        dataFromFile(files[0])
          .then((data) => {
            this.setData(data);
            this.setUploading(false);
          })
          .catch((error) => {
            this.setInfoMessage(error.message);
          });
      }
    },
  },
};
</script>

<style scoped>
.upload-files {
  width: 100%;
  padding: 64px 24px;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  border-width: 2px;
  border-style: dashed;
  border-radius: .25rem;
  border-color: rgba(21,20,26,.2);
}

svg {
  color: #0060df;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

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

input[type="text"] {
  padding: 4px 8px;
  margin: 4px 0;
  line-height: 1.5;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #d7d7db;
}
input[type="text"]:focus {
  border-color:#0060df;
}

.label-1 {
  font-weight: 700;
  padding-bottom: 8px;
  padding-top: 24px;
  text-align: center;
  font-size: 18px;
  letter-spacing: .05em;
}

.label-2 {
  font-size: 16px;
  text-align: center;
  padding-bottom: 24px;
}

label {
  background-color:#0060df;
  color:#fff;
  cursor: pointer;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 16px;
}
</style>
