export default async function handler(req, res) {
  const { path = [] } = req.query;

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

    const text = await response.text();

    res.status(response.status);

    // Forward response as JSON if possible
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}