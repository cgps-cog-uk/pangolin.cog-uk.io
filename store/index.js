/* eslint-disable no-plusplus */
/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

import { v4 as uuidv4 } from "uuid";

import exportCsv from "../assets/scripts/export-csv";

export const state = () => ({
  data: {
    entries: [],
  },
  filter: null,
  formManifest: null,
  mode: "files",
  analysing: false,
});

export const mutations = {
  addSequencesToQueue(state, sequences) {
    for (const item of sequences) {
      state.data.entries.push({
        id: uuidv4(),
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
  setEntryStatus(state, { entryId, status, error, jobId }) {
    const entry = state.data.entries.find((x) => x.id === entryId);
    if (entry) {
      entry.status = status;
      if (status === "Analysing") {
        entry.sequence = null;
        entry.jobId = jobId;
      }
      if (status === "Failed") {
        entry.error = error;
      }
    }
  },
  updateResults(state, results) {
    for (const result of results) {
      if (result.done) {
        const entry = state.data.entries.find((x) => x.jobId === result.id);
        if (entry) {
          entry.status = result.success ? "Success" : "Failed";
          if (result.success) {
            entry.lineage = result.lineage;
            entry.bootstrap = result.bootstrap;
          }
          else {
            entry.error = result.error;
          }
        }
      }
    }
  },
};

export const getters = {
  entries(state) {
    return state.data.entries;
  },
};

export const actions = {
  downloadRows({ state, getters }, { status = "Failed" }) {
    const entries = getters.entries.filter((x) => x.status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const { name, lineage, bootstrap } of entries) {
      const row = {
        "File name": name,
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
  queryResults({ commit, state, getters }) {
    const entries = getters.entries.filter((x) => x.status === "Analysing");
    if (entries.length) {
      return (
        this.$axios({
          method: "POST",
          url: "/api/process/result/",
          data: entries.map((x) => x.jobId),
        })
          .then((response) => response.data)
          .then((response) => {
            commit(
              "updateResults",
              response
            );
          })
          .catch((err) => {
            console.error(err);
          })
      );
    }
  },
  uploadOne({ commit, state, getters }, entryId) {
    const entry = getters.entries.find((x) => x.id === entryId);
    if (entry) {
      commit("setEntryStatus", { entryId, status: "Uploading" });
      return (
        this.$axios({
          method: "POST",
          url: "/api/process/submit/",
          headers: { "Content-Type": "text/plain" },
          data: entry.sequence,
        })
          .then((response) => response.data)
          .then((response) => {
            const status = response.success ? "Analysing" : "Failed";
            commit(
              "setEntryStatus",
              {
                entryId,
                status,
                jobId: response.id,
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
