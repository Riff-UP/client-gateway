How to apply the Alpine Dockerfile to the `content-ms` repo

1. If you have the `content-ms` source locally

- Replace the `Dockerfile` in the `content-ms` repo with the file `deploy/content-ms-Dockerfile.alpine` from this repo.
- From the `content-ms` repo root, build and run:

```bash
# build the image locally
docker build -t content-ms:local .

# run (or use docker compose)
docker run -d --name riff_content_ms --network riff-network -p 3004:3004 content-ms:local
```

Or with docker-compose (if your main compose uses a build context):

```bash
# from the compose dir
docker compose build --no-cache content-ms
docker compose up -d --no-deps --force-recreate content-ms
```

2. If you use CI/CD and a registry

- Copy `deploy/content-ms-Dockerfile.alpine` to the `content-ms` repo and commit.
- Push; trigger your pipeline to build and publish the image.
- Update `docker-compose.yml` to use the new image tag and redeploy.

3. Verify TLS behavior

After the container is running, exec inside and run a quick fetch to your R2 endpoint to ensure certs validate:

```bash
docker exec -it riff_content_ms /bin/sh
node -e "require('undici').request('https://your-r2-endpoint.example').then(()=>console.log('ok')).catch(e=>{console.error(e);process.exit(1)})"
```

4. Notes

- The example enables `ca-certificates` which resolves `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` for public CA-signed endpoints.
- If your R2 endpoint uses a private CA, prefer `NODE_EXTRA_CA_CERTS` and mount the PEM (we provided `deploy/content-ms-ca-support.yml`).
- Keep `ca-certificates` package updated in your base image.
