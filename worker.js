addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

// 0: {
//     Description: "No Content",
//     ExcludeBody: true,
//     IncludeHeaders: {},
// },
const codes = {
    200: {
        Description: "OK",
    },
    201: {
        Description: "Created",
    },
    202: {
        Description: "Accepted",
    },
    203: {
        Description: "Non-Authoritative Information",
    },
    204: {
        Description: "No Content",
        ExcludeBody: true,
    },
    205: {
        Description: "Reset Content",
        ExcludeBody: true,
    },
    206: {
        Description: "Partial Content",
        IncludeHeaders: {
            "Content-Range": "bytes 0-499/1234",
        },
    },
    300: {
        Description: "Multiple Choices",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    301: {
        Description: "Moved Permanently",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
            "Retry-After": "5",
        },
    },
    302: {
        Description: "Found",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    303: {
        Description: "See Other",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    304: {
        Description: "Not Modified",
        ExcludeBody: true,
    },
    305: {
        Description: "Use Proxy",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    306: {
        Description: "(Unused)",
    },
    307: {
        Description: "Temporary Redirect",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    308: {
        Description: "Permanent Redirect",
        IncludeHeaders: {
            Location: "https://httpstatus.rob-mc.dev/200",
        },
    },
    400: {
        Description: "Bad Request",
    },
    401: {
        Description: "Unauthorized",
        IncludeHeaders: {
            "WWW-Authenticate": "Bearer",
        },
    },
    402: {
        Description: "Payment Required",
    },
    403: {
        Description: "Forbidden",
    },
    404: {
        Description: "Not Found",
    },
    405: {
        Description: "Method Not Allowed",
    },
    406: {
        Description: "Not Acceptable",
    },
    407: {
        Description: "Proxy Authentication Required",
        IncludeHeaders: {
            "Proxy-Authenticate": "Bearer",
        },
    },
    408: {
        Description: "Request Timeout",
    },
    409: {
        Description: "Conflict",
    },
    410: {
        Description: "Gone",
    },
    411: {
        Description: "Length Required",
    },
    412: {
        Description: "Precondition Failed",
    },
    413: {
        Description: "Content Too Large",
    },
    414: {
        Description: "URI Too Long",
    },
    415: {
        Description: "Unsupported Media Type",
    },
    416: {
        Description: "Range Not Satisfiable",
        IncludeHeaders: {
            "Content-Range": "bytes */1234",
        },
    },
    417: {
        Description: "Expectation Failed",
    },
    418: {
        Description: "I'm a teapot",
    },
    421: {
        Description: "Misdirected Request",
    },
    422: {
        Description: "Unprocessable Content",
    },
    423: {
        Description: "Locked",
    },
    424: {
        Description: "Failed Dependency",
    },
    425: {
        Description: "Too Early",
    },
    426: {
        Description: "Upgrade Required",
        IncludeHeaders: {
            Upgrade: "HTTP/3.0",
        },
    },
    428: {
        Description: "Precondition Required",
    },
    429: {
        Description: "Too Many Requests",
        IncludeHeaders: {
            "Retry-After": "5",
        },
    },
    431: {
        Description: "Request Header Fields Too Large",
    },
    451: {
        Description: "Unavailable For Legal Reasons",
    },
    500: {
        Description: "Internal Server Error",
    },
    501: {
        Description: "Not Implemented",
    },
    502: {
        Description: "Bad Gateway",
    },
    503: {
        Description: "Service Unavailable",
        IncludeHeaders: {
            "Retry-After": "5",
        },
    },
    504: {
        Description: "Gateway Timeout",
    },
    505: {
        Description: "HTTP Version Not Supported",
    },
    506: {
        Description: "Variant Also Negotiates",
    },
    507: {
        Description: "Insufficient Storage",
    },
    508: {
        Description: "Loop Detected",
    },
    510: {
        Description: "Not Extended",
    },
    511: {
        Description: "Network Authentication Required",
    },
};

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    const { pathname } = new URL(request.url);
    const httpStatusCode = Number(pathname.substring(1));

    if (!httpStatusCode) {
        return new Response("That's not a valid HTTP status code.", {
            status: 400,
        });
    }

    if (httpStatusCode < 200 || httpStatusCode > 599) {
        return new Response(
            "HTTP status code must be in the 2xx, 3xx, 4xx, or 5xx ranges.",
            { status: 400 }
        );
    }

    const object = codes[httpStatusCode];

    if (object) {
        var body = null;
        var headers = new Headers();

        if (!object.ExcludeBody) {
            switch (request.headers.get("Accept")) {
                case "application/json":
                    body = `{ "code": "${httpStatusCode}", "description": "${object.Description}" }`;
                    break;
                default:
                    body = `${httpStatusCode} ${object.Description}`;
            }
        }

        if (object.IncludeHeaders) {
            Object.keys(object.IncludeHeaders).forEach((header) => {
                console.log(
                    `key: ${header} value: ${object.IncludeHeaders[header]}`
                );
                headers.set(header, object.IncludeHeaders[header]);
            });
        }

        return new Response(body, {
            status: httpStatusCode,
            statusText: object.Description,
            headers: headers,
        });
    } else {
        return new Response(`${httpStatusCode}`, { status: httpStatusCode });
    }
}
