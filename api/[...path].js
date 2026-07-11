export default async function handler(req, res) {
  const { path } = req.query;

  const targetUrl = `https://admin-moderator-backend-staging.up.railway.app/api/${path.join("/")}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}