<template>
  <div class="data-grid">
    <nav>
      <start-analysis-button />
      <reset-button />
      <upload-another-file-button />
    </nav>
    <v-data-table
      v-model="selected"
      dense
      disable-pagination
      group-by="status"
      v-bind:headers="headers"
      hide-default-footer
      item-key="id"
      v-bind:items="data"
      show-expand
      single-expand
      v:bind-show-select="false"
    >
      <template v-slot:group.header="{ group, groupBy, items, headers, isOpen, toggle }">
        <td
          class="group-header text-start"
          v-bind:colspan="headers.length"
        >
          <v-btn
            class="ma-0"
            small
            icon
            v-on:click="toggle"
          >
            <v-icon>
              {{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
          </v-btn>
          {{ groupTitle(group, items) }}
          <template v-if="group === 'Success'">
            <v-btn
              icon
              title="Download as CSV"
              v-on:click="onDownloadRowsClick"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </td>
      </template>
      <template v-slot:item.data-table-expand="{ item, select, isSelected, expand, isExpanded}">
        <v-icon v-if="item.status === 'Pending'">
          mdi-timer-sand-empty
        </v-icon>
        <v-icon v-else-if="item.status === 'Analysing'">
          mdi-loading mdi-spin
        </v-icon>
        <v-icon
          v-else-if="item.status === 'Success'"
          class="v-data-table__expand-icon"
          v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
          title="Click to see global lineage info."
          v-on:click="expand(!isExpanded)"
        >
          {{ isExpanded ? "mdi-check-circle" : "mdi-check" }}
        </v-icon>
        <v-icon
          v-else-if="item.status === 'Failed'"
          class="v-data-table__expand-icon"
          v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
          title="Failed, click to see details."
          v-on:click="expand(!isExpanded)"
        >
          {{ isExpanded ? "mdi-alert-circle" : "mdi-alert-circle-outline" }}
        </v-icon>
      </template>
      <template v-slot:item.lineage="{ item }">
        <a
          v-if="item.lineage && item.lineage !== 'None'"
          v-bind:href="`${lineageLink}${item.lineage}`"
          target="_blank"
          rel="noopener"
          title="View lineage in Microreact"
        >
          {{ item.lineage }}
        </a>
        <template v-else>
          {{ item.lineage }}
        </template>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td v-if="!item.error" colspan="3" />
        <td v-if="!item.error">
          <strong>Most common countries: </strong>
          {{ item.mostCommonCountries }}
          <br>
          <strong>Number of taxa: </strong>
          {{ item.numberTaxa }}
          <br>
          <strong>Date range: </strong>
          {{ item.dateRange }}
          <br>
          <strong>Days since last sampling: </strong>
          {{ item.daysSinceLastSampling }}
        </td>
        <td
          v-if="!item.error"
          v-bind:colspan="headers.length - 4"
        />
        <td
          v-if="item.error"
          v-bind:colspan="headers.length"
        >
          <strong>
            {{ item.error }}
          </strong>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import StartAnalysisButton from "~/components/StartAnalysisButton.vue";
import UploadAnotherFileButton from "~/components/UploadAnotherFileButton.vue";
import ResetButton from "~/components/ResetButton.vue";

export default {
  components: {
    StartAnalysisButton,
    UploadAnotherFileButton,
    ResetButton,
  },
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    ...mapGetters({
      data: "entries",
    }),
    ...mapState({
      lineageLink: "lineageLink",
    }),
    headers() {
      return [
        {
          value: "file",
          text: "File name",
        },
        {
          value: "name",
          text: "Sequence name",
        },
        {
          value: "lineage",
          text: "Lineage",
        },
        {
          value: "bootstrap",
          text: "Bootstrap support value",
        },
        {
          value: "shalrt",
          text: "SH-aLRT support value",
        },
      ];
    },
  },
  mounted() {
    this.checkForResults();
  },
  methods: {
    onDownloadRowsClick() {
      this.$store.dispatch(
        "downloadRows",
        { status: "Success" }
      );
    },
    checkForResults() {
      const shouldQuery = this.data.some((x) => x.status === "Analysing");
      if (shouldQuery) {
        this.$store.dispatch("queryResults")
          .catch((error) => console.error(error));
      }
      setTimeout(() => this.checkForResults(), 30 * 1000);
    },
    groupTitle(group, items) {
      let heading;
      if (group === "Pending") {
        heading = "READY FOR ANALYSIS";
      } else if (group === "Success") {
        heading = "ANALYSED (Click tick for more info)";
      } else {
        heading = group.toUpperCase();
      }
      let rowSuffix;
      if (items.length === 1) {
        rowSuffix = " row";
      } else {
        rowSuffix = " rows";
      }
      return [heading, items.length, rowSuffix].join(" ");
    },
  },
};
</script>

<style scoped>
.data-grid {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 48px;
  background-color: #fff;
  box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
  padding: 8px;
  border: 0 solid #d7d7db;
  overflow: auto;
}
section {
  overflow: auto;
}
.v-data-table >>> th {
  position: relative;
}
.v-data-table >>> .v-data-table-header__icon {
  position: absolute;
  right: 0;
  top: calc(50% - 10px);
}

tr.v-row-group__header:not(:first-child) td {
  border-top: 24px solid #fff !important;
}
td.group-header {
  padding-left: 2px;
  text-align: left;
}

.v-data-table >>> td {
  border: 1px solid transparent;
  text-align: left;
}

tr.expanded,
.data-grid >>> tr.expanded-cells,
tr.expanded-info {
  background: rgba(98,0,238,.04) !important;
}

tr.expandable td {
  cursor: pointer;
}

tr.expanded td,
tr.expanded-cells td {
  border-bottom-color: transparent !important;
}

tr.expanded-info td {
  border-bottom: 16px solid #fff !important;
}

tr.cells td.has-error {
  border-color: #ff5252 !important;
  border-radius: 8px;
}
tr.expanded td.has-error {
  border-color: #ff5252;
  border-bottom-color: transparent !important;
  border-radius: 8px 8px 0 0;
}
tr.expanded-cells td.has-error {
  border-color: transparent #ff5252 #ff5252 #ff5252 !important;
  border-radius: 0 0 8px 8px;
}
tr.expanded-cells td.has-error strong {
  display: block;
  line-height: 14px;
  font-style: italic;
  padding-bottom: 4px;
}

nav {
  position: fixed;
  top: 40px;
  left: 8px;
  z-index: 1;
}
@media (max-width:768px) {
  nav button,
  nav label {
    padding: 0 1px;
    margin: 0;
    border: 0;
  }
}
@media (min-width:768px) {
  nav {
    position: fixed;
    top: 11px;
    left: 88px;
    right: unset;
  }
}
</style>
