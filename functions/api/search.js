// Cloudflare Pages Function: public NetEase metadata search; no login or DRM bypass.
const upstreams = [
  ['https://music.163.com/api/search/get', 'POST'],
  ['https://music.163.com/api/cloudsearch/pc', 'POST'],
  ['https://music.163.com/api/search/get', 'GET']
];
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=90'}
});
async function queryUpstream(url, method, artist, offset) {
  const params = new URLSearchParams({s: artist, type: '1', limit: '100', offset: String(offset)});
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(method === 'GET' ? url + '?' + params : url, {
      method,
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: 'https://music.163.com/',
        'user-agent': 'Mozilla/5.0'
      },
      ...(method === 'POST' ? {body: params.toString()} : {}),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('上游 HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data?.result?.songs)) throw new Error('上游未返回歌曲');
    return data.result.songs;
  } finally { clearTimeout(timer); }
}
export async function onRequestGet({request}) {
  const artist = new URL(request.url).searchParams.get('artist')?.trim() || '';
  if (!artist || artist.length > 80) return json({error: '请输入有效歌手名称'}, 400);
  const songs = [], seen = new Set();
  let lastError = '暂无结果';
  for (const [url, method] of upstreams) {
    try {
      for (let offset = 0; offset < 400 && songs.length < 100; offset += 100) {
        const batch = await queryUpstream(url, method, artist, offset);
        for (const s of batch) {
          const names = (s.artists || s.ar || []).map(a => String(a.name || ''));
          if (!names.some(n => n.toLowerCase().includes(artist.toLowerCase()))) continue;
          const id = String(s.id || '');
          if (!id || seen.has(id)) continue;
          seen.add(id);
          songs.push({
            id, name: String(s.name || ''), artists: names,
            duration: s.duration || s.dt || 0,
            cover: String(s.album?.picUrl || s.al?.picUrl || ''),
            link: 'https://music.163.com/#/song?id=' + encodeURIComponent(id)
          });
        }
        if (batch.length < 100) break;
      }
      if (songs.length) return json({songs: songs.slice(0, 100)});
    } catch (e) { lastError = e?.message || '接口不可用'; }
  }
  return json({error: '网易云搜索暂不可用：' + lastError + '。可以使用「导入歌单」开始比赛。'}, 502);
}
