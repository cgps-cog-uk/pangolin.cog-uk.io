<template>
  <div class="data-grid">
    <v-data-table
      v-model="selected"
      dense
      disable-pagination
      group-by="Status"
      v-bind:headers="headers"
      hide-default-footer
      item-key="_id"
      v-bind:items="list"
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
          <template v-if="group === 'Failed'">
            <v-btn
              icon
              title="Download failed rows as CSV"
              v-on:click="onDownloadFailedRowsClick"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </td>
      </template>
      <template v-slot:item="{ item, headers, isExpanded, expand, isMobile }">
        <tr
          v-if="isMobile"
          class="v-data-table__mobile-table-row"
        >
          <td
            v-for="header in headers"
            v-bind:key="header.name"
            class="v-data-table__mobile-row"
            v-bind:class="{ 'has-error': item._messages[header.value] }"
          >
            <template v-if="header.value === 'data-table-expand'">
              <div class="v-data-table__mobile-row__header">
                Status:
              </div>
              <div class="v-data-table__mobile-row__cell">
                {{ item._error }}
                <v-icon v-if="item.Status === 'Pending'">mdi-timer-sand-empty</v-icon>
                <v-icon v-else-if="item.Status === 'Uploading'">mdi-progress-upload</v-icon>
                <v-icon v-else-if="item.Status === 'Uploaded'">mdi-check</v-icon>
                <v-icon
                  v-else-if="item.Status === 'Failed'"
                  class="v-data-table__expand-icon"
                  v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
                  title="Failed, click to see details."
                >
                  {{ isExpanded ? "mdi-alert-circle" : "mdi-alert-circle-outline" }}
                </v-icon>
              </div>
            </template>
            <template v-else>
              <div class="v-data-table__mobile-row__header">
                {{ header.text }}:
              </div>
              <div class="v-data-table__mobile-row__cell">
                {{ item[header.value] }}
              </div>
            </template>
          </td>
        </tr>
        <tr
          v-else
          class="cells"
          v-bind:class="{ expanded: isExpanded, expandable: (item.Status === 'Failed') }"
          v-on:click="(item.Status === 'Failed') ? expand(!isExpanded) : undefined"
        >
          <td
            v-for="header in headers"
            v-bind:key="header.name"
            class="text-start"
            v-bind:class="{ 'has-error': item._messages[header.value] }"
          >
            <template v-if="header.value === 'data-table-expand'">
              <v-icon v-if="item.Status === 'Pending'">mdi-timer-sand-empty</v-icon>
              <v-icon v-else-if="item.Status === 'Uploading'">mdi-progress-upload</v-icon>
              <v-icon v-else-if="item.Status === 'Uploaded'">mdi-check</v-icon>
              <v-icon
                v-else-if="item.Status === 'Failed'"
                class="v-data-table__expand-icon"
                v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
                title="Failed, click to see details."
              >
                {{ isExpanded ? "mdi-alert-circle" : "mdi-alert-circle-outline" }}
              </v-icon>
            </template>
            <template v-else-if="header.value === 'central_sample_id' && item._url">
              <a
                v-bind:href="item._url"
                target="_blank"
              >
                {{ item[header.value] }}
              </a>
            </template>
            <template v-else>
              <v-icon
                v-if="item._messages[header.value]"
                title="Click to see details"
                color="error"
              >
                mdi-alert
              </v-icon>
              {{ item[header.value] }}
            </template>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr class="expanded-cells">
          <td
            v-for="header in headers"
            v-bind:key="header.name"
            class="text-start"
            v-bind:class="{ 'has-error': item._messages[header.value] }"
          >
            <strong
              v-if="item._messages[header.value]"
            >
              {{ item._messages[header.value] }}
            </strong>
          </td>
        </tr>
        <tr class="expanded-info">
          <td v-bind:colspan="headers.length">
            {{ item._error }}
          </td>
        </tr>
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
    ...mapGetters({
      list: "filteredList",
      headers: "dataGridHeaders",
    }),
  },
  methods: {
    onDownloadFailedRowsClick() {
      this.$store.dispatch(
        "downloadRows",
        { status: "Failed" }
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
  bottom: 0;
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
