# Idena nodejs + protobuf transaction signing example

## Generate models

Last proto models can be found [here](https://github.com/idena-network/idena-go/blob/master/protobuf/models.proto).

Use `protoc --js_out=import_style=commonjs,binary:./ proto/models.proto` command to generate protobuf models.

## Run example

```
npm install
node index.js
```
