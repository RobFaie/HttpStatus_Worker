# HttpStatus_Worker

A tiny [httpstat.us](https://httpstat.us)-style service built on [Cloudflare Workers](https://workers.cloudflare.com). You ask it for an HTTP status code — it returns exactly that status code. Useful for testing retry logic, error handling, redirects, timeouts and monitoring, without spinning up a fake server.

**Live at:** [codes.httpauth.dev](https://codes.httpauth.dev)

## Usage

Request any status code from **200 to 599** as the URL path:

```bash
curl -i https://codes.httpauth.dev/404
```

```
HTTP/2 404
```

In PowerShell:

```powershell
irm https://codes.httpauth.dev/202
```

Just open `https://codes.httpauth.dev/<code>` in a browser too.

## Options

| Option | Example | Description |
| --- | --- | --- |
| Status code | `/404` | The path is parsed as the status code to return. |
| Delay | `?sleep=2000` | Sleeps for the given number of milliseconds before responding. Handy for simulating slow endpoints. |
| JSON body | `Accept: application/json` | Returns a JSON body: `{"code": "404", "description": "Not Found"}` |

Behaviour notes:

- **2xx–5xx only.** Anything outside 200–599 returns a `400` explaining the valid range.
- **Redirects** (3xx) include a `Location` header, so clients behave as they would in production.
- **204 / 205** return no body, matching the spec.
- **Query strings** other than `sleep` are ignored, so you can append cache-busters or test params freely.

## Serving a homepage

The root path (`/`) serves the homepage in `worker.js` — an interactive tester with `curl` / PowerShell / JSON examples and a full status-code reference. All other paths are treated as status codes.

## Deploying your own

1. Clone the repo.
2. Install Wrangler: `npm install -g wrangler` (and log in with `wrangler login`).
3. Adjust `wrangler.toml` if you want a custom domain or route.
4. Deploy: `wrangler deploy`.

## Credits

Inspired by [httpstat.us](https://httpstat.us). Built with Cloudflare Workers.
