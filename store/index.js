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
  addSequencesToQueue(state, sequences) {
    for (const item of sequences) {
      state.data.push({
        id: (++lastId).toString(),
        error: null,
        status: "Pending",
        file: item.file,
        name: item.name,
        sequence: item.sequence,
      });
    }
    state.mode = "data";
    state.uploading = false;
  },
  reset(state) {
    state.mode = "files";
    state.uploading = false;
  },
  setEntryStatus(state, { entryId, status, error, lineage }) {
    const entry = state.data.find((x) => x.id === entryId);
    if (entry) {
      entry.status = status;
      entry.lineage = lineage;
      entry.error = error;
      if (status === "Success") {
        entry.sequence = null;
      }
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
    const entries = state.data.entries.filter((x) => x.status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const { name, taxon, taxId, lineage } of entries) {
      const row = {
        "File name": name,
        Taxon: taxon,
        "Tax ID": taxId,
        Lineage: lineage,
      };
      rows.push(row);
    }
    exportCsv(
      rows,
      "results.csv"
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
          data: entry.sequence,
        })
          .then((response) => response.data)
          .then((response) => {
            const status = response.success ? "Success" : "Failed";
            commit(
              "setEntryStatus",
              {
                entryId,
                status,
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
