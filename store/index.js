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
  showSnackbar: false,
  snackbarMessage: "",
  microreactDataVersion: null,
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
    state.snackbarMessage = "";
    state.showSnackbar = false;
    state.mode = "data";
    state.analysing = false;
  },
  reset(state) {
    state.mode = "files";
    state.analysing = false;
    state.data.entries = [];
  },
  setEntryStatus(state, { entryId, status, error, jobId }) {
    const entry = state.data.entries.find((x) => x.id === entryId);
    if (entry) {
      entry.status = status;
      if (status === "Analysing") {
        entry.jobId = jobId;
      }
      if (status === "Failed") {
        entry.error = error;
      }
      if (status === "Success") {
        entry.sequence = null;
      }
    }
  },
  setLineageLinks(state, links) {
    state.ukLineageLink = links.ukLineageLink;
    state.globalLineageLink = links.globalLineageLink;
  },
  setVersions(state, versions) {
    state.pangolinVersion = versions.pangolinVersion;
    state.lineagesVersion = versions.lineagesVersion;
  },
  setMicroreactDataVersion(state, microreactDataVersion) {
    state.microreactDataVersion = microreactDataVersion;
  },
  updateResults(state, results) {
    for (const entry of state.data.entries) {
      const result = results[entry.jobId];
      if (result && result.done) {
        if (result.success) {
          if (result.qcStatus === "passed_qc") {
            entry.status = "Success";
          } else {
            entry.status = "Failed";
          }
        } else {
          entry.status = "Failed";
        }
        if (result.success) {
          entry.lineage = result.lineage;
          entry.conflict = result.conflict;
          entry.ambiguityScore = result.ambiguityScore;
          entry.scorpioCall = result.scorpioCall;
          entry.scorpioSupport = result.scorpioSupport;
          entry.scorpioConflict = result.scorpioConflict;
          entry.version = result.version;
          entry.pangolinVersion = result.pangolinVersion;
          entry.pangoLEARNVersion = result.pangoLEARNVersion;
          entry.qc_status = result.status;
          entry.note = result.note;
        }
        else {
          entry.error = result.error;
        }
      }
    }
  },
  updateSnackbar(state, message) {
    state.showSnackbar = true;
    state.snackbarMessage = message;
  },
  hideSnackbar(state) {
    state.showSnackbar = false;
  },
  showSnackbar(state) {
    state.showSnackbar = true;
  },
};

export const getters = {
  entries(state) {
    return state.data.entries;
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req.config) {
      const links = {
        ukLineageLink: req.config.ukLineageLink,
        globalLineageLink: req.config.globalLineageLink,
      };
      commit(
        "setLineageLinks",
        links
      );
      // eslint-disable-next-line no-unused-vars
      const pangolinVersion = req.config.pangolinVersion;
      const lineagesVersion = req.config.pangoLEARNVersion;
      const versions = { pangolinVersion, lineagesVersion };
      commit(
        "setVersions",
        versions
      );
      if (req.config.microreactDataVersion) {
        commit("setMicroreactDataVersion", req.config.microreactDataVersion);
      }
    }
  },
  downloadRows({ state, getters }, { status }) {
    const entries = getters.entries.filter((x) => x.status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const {
      name,
      lineage,
      conflict,
      ambiguityScore,
      scorpioCall,
      scorpioSupport,
      scorpioConflict,
      note,
    } of entries) {
      const row = {
        "Sequence name": name,
        Lineage: lineage,
        Conflict: conflict,
        "Ambiguity score": ambiguityScore,
        "Scorpio call": scorpioCall,
        "Scorpio support": scorpioSupport,
        "Scorpio conflict": scorpioConflict,
        Note: note,
        "pangolin version": state.pangolinVersion,
        "pangoLEARN version": state.lineagesVersion,

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
  resetState({ commit }) {
    commit("reset");
  },
};
