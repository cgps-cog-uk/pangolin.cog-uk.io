/* eslint-disable */

export default function (fileHandle, callback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      resolve(data);
    };

    reader.onerror = (err) => reject(err);

    reader.readAsText(fileHandle);
  });
}
