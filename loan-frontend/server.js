import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ success: false, message: 'id_token missing' });
  try {
    // Verify id_token with Google's tokeninfo endpoint
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    const info = await r.json();
    if (info.error_description || !info.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token', detail: info });
    }

    // Check aud matches your client id? For local dev we'll skip strict check but you should verify in prod
    // const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    // if (info.aud !== CLIENT_ID) return res.status(400).json({ success:false, message:'Invalid audience' });

    // Simulate user lookup/creation
    const user = { name: info.name, email: info.email, picture: info.picture };
    const role = 'student';
    return res.json({ success: true, user, role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mock auth server listening on ${port}`));
