const base = process.env.REACT_APP_API_BASE_URL || ''; // '' also works if you use CRA proxy

async function asJson(res) {
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await res.json() : await res.text();
  return { ok: res.ok, status: res.status, body };
}

export async function getTopics() {
  const res = await fetch(`${base}/api/courses/topics`);
  const { ok, status, body } = await asJson(res);
  if (!ok) throw new Error(body?.error || `Failed to load topics (${status})`);
  return Array.isArray(body) ? body : [];
}

export async function getSubtopics(topicKey) {
  const res = await fetch(`${base}/api/courses/subtopics/${encodeURIComponent(topicKey)}`);
  const { ok, status, body } = await asJson(res);
  if (!ok) throw new Error(body?.error || `Failed to load ${topicKey} (${status})`);
  return body; // JSON from server/courses-data/<topicKey>.json
}
