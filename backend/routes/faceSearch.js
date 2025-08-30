import fetch from 'node-fetch';

export async function searchFace(imageUrl) {
  // Example using Face++ search (you must create a faceset / collection first for production)
  // For MVP we will call the /detect endpoint to get face tokens and return them.
  const key = process.env.FACEPP_KEY;
  const secret = process.env.FACEPP_SECRET;
  if (!key || !secret) return { error: 'No FACEPP_KEY/SECRET configured' };

  // 1) detect
  const detectRes = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
    method: 'POST',
    body: new URLSearchParams({ api_key: key, api_secret: secret, image_url: imageUrl })
  });
  const detectJson = await detectRes.json();
  if (!detectRes.ok) return { error: 'Face detect error', detail: detectJson };

  // return detection for MVP
  return { detected: detectJson };
}