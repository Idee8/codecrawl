#!/usr/bin/env bash
docker compose -f compose.yaml -f compose.$1.yaml up ${@:2}