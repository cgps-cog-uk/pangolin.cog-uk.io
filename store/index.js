/* eslint-disable no-plusplus */
/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

import exportCsv from "../assets/scripts/export-csv";

let lastId = 0;

export const state = () => ({
  data: [],
  filter: null,
  formManifest: null,
  mode: "files",
  uploading: false,
});

export const mutations = {
  addFilesToQueue(state, files) {
    for (const file of files) {
      state.data.push({
        id: (++lastId).toString(),
        error: null,
        status: "Pending",
        name: file.name,
        file,
        _messages: {},
      });
    }
    state.mode = "data";
    state.uploading = false;
  },
  reset(state) {
    state.mode = "files";
    state.uploading = false;
  },
  setEntryStatus(state, { entryId, status, error, taxon, taxId, lineage }) {
    const entry = state.data.find((x) => x.id === entryId);
    if (entry) {
      entry.status = status;
      entry.taxon = taxon;
      entry.taxId = taxId;
      entry.lineage = lineage;
      entry.error = error;
    }
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setUploading(state, mode) {
    state.uploading = mode;
  },
};

export const getters = {
};

export const actions = {
  downloadRows({ state }, { status = "Failed" }) {
    const entries = state.data.entries.filter((x) => x.Status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const { _error, id, _messages, Status, ...rest } of entries) {
      const row = {
        Error: _error,
        ...rest,
      };
      for (const [ field, message ] of Object.entries(_messages)) {
        // eslint-disable-next-line prefer-template
        row[field] = (rest[field] || "") + "⚠️" + message;
      }
      rows.push(row);
    }
    exportCsv(
      rows,
      "failed-rows.csv"
    );
  },
  uploadOne({ commit, state }, entryId) {
    const entry = state.data.find((x) => x.id === entryId);
    if (entry) {
      commit("setUploading", true);
      commit("setEntryStatus", { entryId, status: "Uploading" });
      return (
        this.$axios({
          method: "POST",
          url: "/api/process/lineage/",
          headers: { "Content-Type": "text/plain" },
          data: entry.file,
        })
          .then((response) => response.data)
          .then((response) => {
            const status = response.success ? "Success" : "Failed";
            commit(
              "setEntryStatus",
              {
                entryId,
                status,
                taxon: response.taxon,
                taxId: response.taxId,
                lineage: response.lineage,
              }
            );
          })
          .catch((err) => {
            console.error(err);
            const error = (err.response) ? err.response.data : err;
            commit(
              "setEntryStatus",
              {
                entryId,
                status: "Failed",
                error: error.message || error,
              }
            );
          })
      );
    }
    return Promise.resolve();
  },
};
