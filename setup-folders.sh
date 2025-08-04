#!/bin/bash
# setup-folders.sh - Create complete PivotPoint Platform structure

echo "🏗️ Creating PivotPoint Platform folder structure..."

# Root directories
mkdir -p {client,server,shared,docs,scripts,tests,docker,.github}

# Client structure
echo "Creating client structure..."
mkdir -p client/{public,src}
mkdir -p client/public/{images,fonts,icons}
mkdir -p client/src/{components,pages,modules,lib,hooks,types,assets,styles}
mkdir -p client/src/components/{ui,layout,forms,charts,shared}
mkdir -p client/src/pages/{dashboard,psychology,trading,insights,auth,admin}
mkdir -p client/src/pages/psychology/evaluations
mkdir -p client/src/modules/{psychology,trading,insights}
mkdir -p client/src/modules/psychology/{components,hooks,api,types,utils}
mkdir -p client/src/modules/trading/{components,hooks,api,types,utils}
mkdir -p client/src/modules/insights/{components,hooks,api,types}
mkdir -p client/src/lib/{auth,api,utils,constants,validation}
mkdir -p client/src/assets/{images,icons,fonts,videos}
mkdir -p client/src/assets/images/{logos,backgrounds}
mkdir -p client/src/styles/themes

# Server structure
echo "Creating server structure..."
mkdir -p server/src/{modules,database,config}
mkdir -p server/src/modules/{psychology,trading,insights,auth,shared}
mkdir -p server/src/modules/psychology/{controllers,models,routes,services,middleware}
mkdir -p server/src/modules/trading/{controllers,models,routes,services,middleware}
mkdir -p server/src/modules/insights/{controllers,models,routes,services}
mkdir -p server/src/modules/auth/{controllers,models,routes,middleware,services}
mkdir -p server/src/modules/shared/{middleware,utils,services}
mkdir -p server/src/database/{migrations,seeds,config}
mkdir -p server/src/config/{environment,security,integrations}

# Shared, docs, scripts, tests
mkdir -p shared/{types,constants,utils,schemas}
mkdir -p docs/{api,deployment,development,user-guides}
mkdir -p scripts/{build,deploy,database,maintenance}
mkdir -p tests/{unit,integration,e2e,fixtures}
mkdir -p tests/unit/{client,server}
mkdir -p tests/integration/{api,modules}
mkdir -p tests/e2e/{psychology,trading,shared}
mkdir -p .github/{workflows,ISSUE_TEMPLATE}

echo "✅ Folder structure created successfully!"
FOLDER_COUNT=$(find . -type d | wc -l)
echo "📈 Folders created: $FOLDER_COUNT"

