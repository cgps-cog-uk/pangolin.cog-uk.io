module.exports = function (req, res, next) {
  console.info("Got request to query result");

  Promise.resolve(req.body)
    .then((ids) => {
      // TODO: replace with database query
      const results = [];
      for (const id of ids) {
        const done = !id.startsWith("0");
        if (done) {
          const success = !id.startsWith("1");
          results.push({
            id,
            done: true, // ture if job has finished, fasle if it is still running
            success, // true if job ran success, or false if it failed
            error: success ? null : "Job failed for not reason", // error message if success is false, otherwise null
            lineage: Math.round(Math.random() * 1000),
            bootstrap: Math.round(Math.random() * 1000),
          });
        }
        else {
          results.push({
            id,
            done: false,
            success: undefined,
            error: undefined,
            lineage: undefined,
            bootstrap: undefined,
          });
        }
      }
      return results;
    })
    .then((results) => {
      res.send(results);
    })
    .catch(next);
};
