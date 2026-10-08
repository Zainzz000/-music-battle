// Experimental, unaffiliated NetEase metadata search. No user login or cookies.
const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=120'};
module.exports = async function handler(req,res){
  Object.entries(cors).forEach(([k,v])=>res.setHeader(k,v));
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const artist=String(req.query.artist||'').trim();
  if(!artist||artist.length>80)return res.status(400).json({error:'请输入有效歌手名（1-80字符）'});
  const songs=[],seen=new Set();
  try{
    for(let offset=0;offset<500&&songs.length<100;offset+=100){
      const body=new URLSearchParams({s:artist,type:'1',limit:'100',offset:String(offset)});
      const r=await fetch('https://music.163.com/api/search/get',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'Mozilla/5.0'},body:body.toString(),signal:AbortSignal.timeout(8000)});
      if(!r.ok)throw Error('网易云上游 HTTP '+r.status);
      const d=await r.json(),batch=d?.result?.songs;
      if(!Array.isArray(batch))throw Error('网易云上游返回格式异常');
      for(const s of batch){
        const names=(s.artists||s.ar||[]).map(a=>String(a.name||''));
        if(!names.some(n=>n.toLowerCase().includes(artist.toLowerCase())))continue;
        const id=String(s.id||'');if(!id||seen.has(id))continue;
        seen.add(id);songs.push({id,name:String(s.name||''),artists:names,duration:s.duration||s.dt||0,link:'https://music.163.com/#/song?id='+encodeURIComponent(id)});
      }
      if(batch.length<100)break;
    }
    return res.status(200).json({songs:songs.slice(0,100)});
  }catch(e){return res.status(502).json({error:'网易云搜索失败：'+(e?.message||'上游不可用')});}
};
