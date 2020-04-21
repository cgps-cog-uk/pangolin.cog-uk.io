const docker = require("docker-run");

module.exports = function (image, dockerOpts, timeout) {
  const container = docker(image, dockerOpts);
  if (timeout) {
    const t = setTimeout(() => {
      console.info("Timeout", container.id, "after", timeout);
      container.destroy();
    }, timeout);
    container.on("exit", () => clearTimeout(t));
  }
  return container;
};
