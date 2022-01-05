#!/bin/bash -e

rm -rf pushsafety-tmp
tsc --declaration --emitDeclarationOnly --outDir pushsafety-tmp/prod-types
ts-node -T -e "import * as ps from './api-lib/pushsafety/check-pushsafety.ts'; ps.list_endpoints()" > pushsafety-tmp/prod-types/endpoints.json