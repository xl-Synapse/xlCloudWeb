# xlCloudWeb

A web client for accessing xlCloud. It is developed using vue3 and typescript

## Project Setup
> Install all dependencies.
```sh
npm install
```

> Compile and Hot-Reload for Development.

```sh
npm run dev
```

> Type-Check, Compile and Minify for Production.

```sh
npm run build
```

## Start
If you use **source code** for testing, you can just run this command in the root path.

```sh
npm run dev
```

If you use the **release version**, you can use nginx, caddy and other servers for deployment.

> For caddyV2, please refer to the following **Caddyfile**.
```text
http://:80 {
        root *  /home/pi/program/xlCloud/
        route {
                try_files {path} /index.html
                file_server
        }
}
```