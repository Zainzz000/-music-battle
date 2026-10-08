// Cloudflare Worker experimental NetEase metadata search proxy.
// Not an official NetEase API. Deployment does not guarantee availability.
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'public, max-age=180'};
function reply(body,status=200){return new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}})}
export default {async fetch(request){
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  const u=new URL(request.url);
  if(u.pathname!=='/api/search')return reply({error:'Not found'},404);
  const artist=(u.searchParams.get('artist')||'').trim();
  if(!artist||artist.length>80)return reply({error:'请输入有效歌手名（1-80字符）'},400);
  const songs=[],seen=new Set();
  try{
    for(let offset=0;offset<500&&songs.length<100;offset+=100){
      const body=new URLSearchParams({s:artist,type:'1',limit:'100',offset:String(offset)});
      const r=await fetch('https://music.163.com/api/search/get',{
        method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'Mozilla/5.0'},body:body.toString(),signal:AbortSignal.timeout(9000)
      });
      if(!r.ok)throw Error('网易云上游 HTTP '+r.status);
      const d=await r.json();const batch=d?.result?.songs;
      if(!Array.isArray(batch))throw Error('网易云上游返回格式异常');
      for(const s of batch){
        const names=(s.artists||s.ar||[]).map(a=>a.name||'');
        if(!names.some(n=>n.toLowerCase().includes(artist.toLowerCase())))continue;
        const id=String(s.id||'');if(!id||seen.has(id))continue;seen.add(id);
        songs.push({id,name:String(s.name||''),artists:names,duration:s.duration||s.dt||0,link:'https://music.163.com/#/song?id='+encodeURIComponent(id)});
      }
      if(batch.length<100)break;
    }
    return reply({songs:songs.slice(0,100)});
  }catch(e){return reply({error:'网易云搜索失败：'+(e?.message||'上游不可用')},502)}
}};
