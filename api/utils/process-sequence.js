const docker = require("./docker");
const config = require("./config");

module.exports = function (fastaStream) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const container = docker(config.imageName, { remove: false });
    fastaStream.on("error", (err) => {
      container.destroy(() => reject(err));
    });
    fastaStream.on("data", (data) => {
      console.log('got data', data);
      container.stdin.write(data);
    });
    fastaStream.on("end", (data) => container.stdin.end());
    // fastaStream.pipe(container.stdin);

    const buffer = [];
    container.stdout.on("data", (data) => {
      buffer.push(data.toString());
    });

    container.on("exit", (exitCode) => {
      const [ durationS, durationNs ] = process.hrtime(startTime);
      const duration = Math.round(durationS * 1000 + durationNs / 1e6);
      console.info("exit", exitCode, duration);

      if (exitCode !== 0) {
        container.stderr.setEncoding("utf8");
        reject(new Error(container.stderr.read()));
      }
      else if (buffer.length === 0) {
        reject(new Error("No output received."));
      }
      else {
        try {
          const output = JSON.parse(buffer.join(""));
          resolve(output);
        }
        catch (e) {
          reject(e);
        }
      }
    });

    container.on("spawn", (containerId) => {
      console.info("spawn", containerId);
    });

    container.on("error", reject);
  });
};
