<template>
  <div class="data-grid">
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
          {{ group.toUpperCase() }}: {{ items.length }} {{ items.length === 1 ? "row" : "rows" }}
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
      <template v-slot:item.data-table-expand="{ item, select, isSelected, expand, isExpanded, isMobile, headers }">
        <v-icon v-if="item.status === 'Pending'">mdi-timer-sand-empty</v-icon>
        <v-icon v-else-if="item.status === 'Analysing'">mdi-progress-upload</v-icon>
        <v-icon v-else-if="item.status === 'Analysed'">mdi-check</v-icon>
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
      <template v-slot:expanded-item="{ headers, item }">
        <td
          class="text-start"
          v-bind:colspan="headers.length"
        >
          <strong
            v-if="item.error"
          >
            {{ item.error }}
          </strong>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    ...mapState({
      data: "data",
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
          text: "Bootstrap",
        },
      ];
    },
  },
  methods: {
    onDownloadRowsClick() {
      this.$store.dispatch(
        "downloadRows",
        { status: "Success" }
      );
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
  bottom: 50px;
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
}

.v-data-table >>> td {
  border: 1px solid transparent;
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
</style>
