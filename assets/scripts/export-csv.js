/* eslint-disable prefer-template */

/* https://github.com/Belphemur/vue-json-csv/blob/develop/src/JsonCSV.vue */

import { saveAs } from "file-saver";
import { unparse } from "papaparse";

export default function (data, filename) {
  const csv = unparse(
    data
  );
  const blob = new Blob(
    [ "\uFEFF" + csv ],
    { type: "application/csvcharset=utf-8" }
  );
  saveAs(blob, filename);
}
