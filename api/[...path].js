export default async function handler(req, res) {
  const { path = [] } = req.query;

  const targetUrl = `https://admin-moderator-backend-staging.up.railway.app/api/${path.join("/")}`;

  console.log("Incoming path:", path);
  console.log("Target URL:", targetUrl);

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

    console.log("Status:", response.status);
    console.log("Response:", text);

    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}