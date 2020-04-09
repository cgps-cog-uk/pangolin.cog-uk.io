/* eslint no-shadow: 0 */
/* eslint dot-notation: 0 */

import formManifest from "../assets/form-manifest";
import measureTextWidth from "../assets/scripts/measure-text-width";
import exportCsv from "../assets/scripts/export-csv";

const statudToFilterMap = {
  Pending: "queued",
  Uploading: "queued",
  Uploaded: "uploaded",
  Failed: "failed",
  Duplicated: "duplicated",
};

export const state = () => ({
  data: {
    headers: undefined,
    entries: undefined,
  },
  filter: null,
  formManifest: null,
  mode: "files",
  uploading: false,
});

export const mutations = {
  reset(state) {
    state.mode = "files";
    state.uploading = false;
  },
  setEntryStatus(state, { entryId, status, error, messages, url }) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      entry.Status = status;
      if (messages) {
        entry._messages = messages;
      }
      if (error) {
        entry._error = error;
      }
      if (url) {
        entry._url = url;
      }
    }
  },
  setFilter(state, filter) {
    if (state.filter === filter) {
      state.filter = null;
    }
    else {
      state.filter = filter;
    }
  },
  setData(state, data) {
    let headerIndex = 0;
    let startIndex = 1;

    // check if WSI template
    if (data[0].find((x) => (x === "REQUIRED"))) {
      headerIndex = 1;
      startIndex = 3;
    }
    const entries = [];
    const headers = data[headerIndex].map((x) => (x.toLowerCase ? x.toLowerCase() : x));
    for (let index = startIndex; index < data.length; index++) {
      const row = data[index];
      // check that row is not empty by converting all values to boolean
      if (row.every((x) => !x)) {
        continue;
      }
      const entry = {
        _id: index.toString(),
        _messages: {},
        Status: "Pending",
      };
      for (let column = 0; column < headers.length; column++) {
        entry[headers[column]] = row[column];
      }
      entries.push(entry);
    }
    state.data = {
      headers,
      entries,
    };
    state.mode = "data";
    state.filter = null;
  },
  setError(state, err) {
    state.mode = "error";
    state.errorMessage = err.response.data.error;
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setUploading(state, mode) {
    state.uploading = mode;
  },
};

export const getters = {
  allTypes() {
    return [
      {
        name: "barcode",
        default: "",
        hasEnum: true,
      },
      {
        name: "boolean",
        default: false,
        hasEnum: true,
      },
      {
        name: "datatable",
        default: null,
        hasEnum: false,
      },
      {
        name: "date",
        default: null,
        hasEnum: true,
      },
      {
        name: "datetime",
        default: null,
        hasEnum: false,
      },
      {
        name: "file",
        default: null,
        hasEnum: false,
      },
      {
        name: "graph",
        default: null,
        hasEnum: false,
      },
      {
        name: "integer",
        default: null,
        hasEnum: true,
      },
      {
        name: "list",
        default: [],
        hasEnum: false,
      },
      {
        name: "map",
        default: {},
        hasEnum: false,
      },
      {
        name: "number",
        default: 0,
        hasEnum: true,
      },
      {
        name: "regex",
        default: "",
        hasEnum: true,
      },
      {
        name: "text",
        default: "",
        hasEnum: true,
      },
      {
        name: "url",
        default: "",
        hasEnum: true,
      },
    ];
  },
  formInputs(state) {
    const inputs = [];
    for (const input of formManifest) {
      input.label = (
        input.required
          ?
          `${input.name} (required)`
          :
          input.name
      );
      inputs.push(input);
    }
    return inputs;
  },
  filteredList(state) {
    if (state.filter) {
      return state.data.entries.filter((x) => statudToFilterMap[x.Status] === state.filter);
    }
    else {
      return state.data.entries;
    }
  },
  dataGridHeaders(state, getters) {
    const headers = [
      {
        value: "Status",
        text: "Status",
        width: 88,
      },
    ];
    for (const header of state.data.headers) {
      const columnDefinition = formManifest.find((x) => x.name === header) || {};
      headers.push({
        value: header,
        text: header,
        width: 40 + (columnDefinition.width || measureTextWidth(header)),
      });
    }
    return headers;
  },
  groups(state) {
    const queued = [];
    const uploaded = [];
    const failed = [];
    const duplicated = [];

    for (const row of state.data.entries) {
      switch (row.Status) {
        case "Pending":
        case "Uploading":
          queued.push(row);
          break;
        case "Uploaded":
          uploaded.push(row);
          break;
        case "Failed":
          failed.push(row);
          break;
        case "Duplicated":
          duplicated.push(row);
          break;
      }
    }

    return {
      queued,
      uploaded,
      failed,
      duplicated,
    };
  },
  typesByName(state, getters) {
    const dict = {};
    for (const item of getters.allTypes) {
      dict[item.name] = item;
    }
    return dict;
  },
};

export const actions = {
  downloadRows({ state }, { status = "Failed" }) {
    const entries = state.data.entries.filter((x) => x.Status === status);
    const rows = [];
    // eslint-disable-next-line no-unused-vars
    for (const { _error, _id, _messages, Status, ...rest } of entries) {
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
  uploadEntry({ commit, state }, entryId) {
    const entry = state.data.entries.find((x) => x._id === entryId);
    if (entry) {
      commit("setUploading", true);
      commit("setEntryStatus", { entryId, status: "Uploading" });
      return (
        this.$axios.$post("/api/data/submit/", entry)
          .then((response) => {
            const status = response.success ? "Uploaded" : "Failed";
            commit(
              "setEntryStatus",
              {
                entryId,
                status,
                url: response.url,
                error: response.error,
                messages: response.messages,
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
