export default async function handler(req, res) {
  const { path = [] } = req.query;

  const targetUrl = `https://admin-moderator-backend-staging.up.railway.app/api/${path.join("/")}`;

  return res.json({
    targetUrl,
    path,
  });
}