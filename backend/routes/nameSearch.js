import fetch from 'node-fetch';

export async function searchName(name) {
  // Basic example using People Data Labs "Person Enrichment" endpoint.
  // NOTE: Replace with your preferred enrichment provider and obey their TOS.
  const key = process.env.PDL_KEY;
  if (!key) return { error: 'No PDL_KEY configured' };

  const url = `https://api.peopledatalabs.com/v5/person/enrich?name=${encodeURIComponent(name)}`;
  const r = await fetch(url, { headers: { 'X-Api-Key': key } });
  if (!r.ok) return { error: 'PDL error', status: r.status };
  const json = await r.json();
  return json;
}