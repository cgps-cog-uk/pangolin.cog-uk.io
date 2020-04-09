/* eslint-disable */

import XLSX from "xlsx";

function fixdata(data) {
  var o = "", l = 0, w = 10240;
  for(; l<data.byteLength/w; ++l)
    o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
  o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
  return o;
}

function processWorkbook(workbook, sheetidx) {
  const sheet = workbook.SheetNames[sheetidx || 0];
  const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false, header: 1 });
  if (roa.length > 0) {
    return roa;
  }
  else {
    return undefined;
  }
}

export default function (fileHandle, callback) {
  const rABS = typeof FileReader !== "undefined" && FileReader.prototype && FileReader.prototype.readAsBinaryString;

  const reader = new FileReader();
  // const name = fileHandle.name;
  reader.onload = function (event) {
    let data = event.target.result;
    let wb;
    let arr;
    const readtype = {
      type: rABS ? "binary" : "base64",
      raw: true,
    };
    if (!rABS) {
      arr = fixdata(data);
      data = btoa(arr);
    }
    if (event.target.result.length > 1e6) {
      callback("File is too large");
    }
    else {
      try {
        wb = XLSX.read(data, readtype);
        const json = processWorkbook(wb);
        callback(null, json);
      }
      catch (err) {
        callback(err);
      }
    }
  };
  if (rABS) {
    reader.readAsBinaryString(fileHandle);
  }
  else {
    reader.readAsArrayBuffer(fileHandle);
  }
}
