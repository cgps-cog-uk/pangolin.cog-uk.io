const es = require('event-stream');
const { Writable } = require("stream");

module.exports = function (stream) {
  const sequences = [];

  // stream.on("data", (line) => console.log("line", line));

  // const split = new Writable({
  //   write(line, _, cb) {
  //     console.log(line);
  //     // if (line.startsWith(">")) {
  //     //   if (seq !== null) {
  //     //     sequences.push(seq);
  //     //   }
  //     //   seq = { name: line.slice(1).trim(), sequence: "" };
  //     // } else {
  //     //   seq.sequence += line.trim();
  //     // }
  //     cb();
  //   },
  // });

  // The only thing is, even if it works once, will it always work
  // the potential issue is a race condition
  return new Promise((resolve, reject) => {
    stream
      .pipe(es.split())
      // .pipe(split)
      .on("data", (line) => {
        if (line) {
          if (line.startsWith(">")) {
            sequences.push({ name: line.slice(1).trim(), sequence: "" });
          }
          else {
            sequences[sequences.length - 1].sequence += line.trim();
          }
        }
      })
      .on("end", () => resolve(sequences))
      .on("error", reject);
  });
};
