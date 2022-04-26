# README

## Host configuration

The deployment directory on the host requires the following files and folders:

- config.json (based on the defaults.json)
- docker-compose.yml
- restart.sh
- sqlite-dbs/queue.sqlite
- sqlite-dbs/results.sqlite

## The sqlite databases

These need to be initialised prior to starting the service for the first time as they won't mount via docker correctly otherwise.
This can be done by starting the server locally, which will then generate the required files after a sequence is submitted.

## Updates

See [the update guide](https://docs.google.com/document/d/1aUua8BP-TsrMWmR_5TIn9DCgDaW3ZpVcuIquf0Pb-HM/edit?usp=sharing).
