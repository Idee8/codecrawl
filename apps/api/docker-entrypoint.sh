#!/bin/bash -e

if [ "$UID" -eq 0 ]; then
  set +e # disable failing on errror
  ulimit -n 65535
  echo "NEW ULIMIT: $(ulimit -n)"
  set -e # enable failing on error
else
  echo ENTRYPOINT DID NOT RUN AS ROOT
fi

case "${PROCESS_TYPE}" in
  "app")
    echo "RUNNING app"
    node --max-old-space-size=8192 dist/src/index.js
    ;;
  "worker")
    echo "RUNNING worker"
    node --max-old-space-size=8192 dist/src/services/queue-worker.js
    ;;
  "index-worker")
    echo "RUNNING index worker" 
    node --max-old-space-size=8192 dist/src/services/indexing/index-worker.js
    ;;
  *)
    echo "RUNNING default app"
    node --max-old-space-size=8192 dist/src/index.js
    ;;
esac