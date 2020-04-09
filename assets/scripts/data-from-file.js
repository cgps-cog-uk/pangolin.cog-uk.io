import readFile from "./read-file";

const validFiles = /(\.xlsx|\.xls|\.csv|\.ods)$/i;

export default function (file) {
  return new Promise((resolve, reject) => {

    if (validFiles.test(file.name)) {
      readFile(
        file,
        (err, data) => {
          if (err) {
            reject(err);
          }
          else {
            let headerIndex = 0;
            const fields = [];
            // check if WSI template
            if (data[0].find((x) => (x === "REQUIRED"))) {
              headerIndex = 1;
            }
            for (const field of data[headerIndex]) {
              if (fields.includes(field)) {
                return reject(new Error(`Duplicate field: ${field}`));
              }
              else {
                fields.push(field);
              }
            }

            resolve(data);
          }
        }
      );
    }
    else {
      reject(new Error("Invalid file type. Supported files are: .xlsx, .xls, .csv, or .ods"));
    }
  });
};
