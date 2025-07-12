addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

const codes = {
  0: {
    Description: "No Content",
    ExcludeBody: true,
    IncludeHeaders: {},
  },
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
      "Content-Range": "0-30",
    },
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
      body = `${httpStatusCode} ${object.Description}`;
    }

    if (object.IncludeHeaders) {
      Object.keys(object.IncludeHeaders).forEach((header) => {
        console.log(`key: ${header} value: ${object.IncludeHeaders[header]}`);
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
