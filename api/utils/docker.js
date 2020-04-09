const docker = require("docker-run");

module.exports = function (image, dockerOpts, timeout) {
  const container = docker(image, dockerOpts);
  if (timeout) {
    const t = setTimeout(() => {
      console.error(`Container '${image}' (${container.id.slice(0, 8)}) timed out after ${timeout} milliseconds`);
      container.destroy();
    }, timeout);
    container.on("exit", () => clearTimeout(t));
  }
  return container;
};
