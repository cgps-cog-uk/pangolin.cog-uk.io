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
  analysing: false,
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
    state.analysing = false;
  },
  reset(state) {
    state.mode = "files";
    state.analysing = false;
  },
  setEntryStatus(state, { entryId, status, error, lineage, bootstrap}) {
    const entry = state.data.find((x) => x.id === entryId);
    if (entry) {
      entry.status = status;
      entry.lineage = lineage;
      entry.bootstrap = bootstrap;
      entry.error = error;
      if (status === "Success") {
        entry.sequence = null;
      }
    }
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setAnalysing(state, mode) {
    state.analysing = mode;
  },
};

export const getters = {
};

export const actions = {
  downloadRows({ state }, { status = "Success" }) {
    const entries = state.data.filter((x) => x.status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const { name, taxon, lineage, bootstrap } of entries) {
      const row = {
        "Sequence name": name,
        Lineage: lineage,
        Bootstrap: bootstrap,
      };
      rows.push(row);
    }
    exportCsv(
      rows,
      "results.csv"
    );
  },
  analyse({ commit, state }, entryId) {
    const entry = state.data.find((x) => x.id === entryId);
    if (entry) {
      commit("setAnalysing", true);
      commit("setEntryStatus", { entryId, status: "Analysing" });
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
                bootstrap: response.bootstrap,
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
