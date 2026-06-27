export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) return res.status(500).json({ error: 'Server config error' });

  try {
    const getRes = await fetch(`https://api.github.com/repos/alchemist4real/MR-CAPSULES/contents/config.json?t=${Date.now()}`, {
      headers: { 'Authorization': `Bearer ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!getRes.ok) throw new Error("Config file not found");
    
    const fileData = await getRes.json();
    const configObj = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));
    
    return res.status(200).json(configObj);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
