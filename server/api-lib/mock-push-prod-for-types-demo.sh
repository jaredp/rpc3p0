#!/bin/bash -e

rm -rf pushsafety-tmp/prod-types
tsc --declaration --emitDeclarationOnly --outDir pushsafety-tmp/prod-types
ts-node -T -e "import * as ps from './api-lib/check-pushsafety.ts'; ps.list_endpoints()" > pushsafety-tmp/prod-types/endpoints.json