rm -rf dist
mkdir dist
touch dist/index.js

parcel watch index.ts --target node & \
nodemon dist/index.js