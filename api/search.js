// NetEase metadata lookup only. No account, cookies, or DRM bypass.
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=120'};
const sources=[
 {url:'https://music.163.com/api/search/get',method:'POST'},
 {url:'https://music.163.com/api/cloudsearch/pc',method:'POST'},
 {url:'https://music.163.com/api/search/get',method:'GET'}
];
async function requestSource(src,artist,offset){
 const params=new URLSearchParams({s:artist,type:'1',limit:'100',offset:String(offset)});
 const url=src.method==='GET'?src.url+'?'+params:src.url;
 const r=await fetch(url,{method:src.method,headers:{'Accept':'application/json','User-Agent':'Mozilla/5.0 (compatible; MusicBattle/1.0)','Referer':'https://music.163.com/','Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},...(src.method==='POST'?{body:params.toString()}:{}),signal:AbortSignal.timeout(6500)});
 if(!r.ok)throw Error('上游 HTTP '+r.status);
 const type=r.headers.get('content-type')||'';
 if(!type.includes('json'))throw Error('上游返回非 JSON');
 const data=await r.json();
 if(!Array.isArray(data?.result?.songs))throw Error('上游没有返回歌曲列表');
 return data.result.songs;
}
module.exports=async function handler(req,res){
 Object.entries(headers).forEach(([k,v])=>res.setHeader(k,v));
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='GET')return res.status(405).json({error:'仅支持 GET'});
 const artist=String(req.query.artist||'').trim();
 if(!artist||artist.length>80)return res.status(400).json({error:'请输入有效歌手名称'});
 const songs=[],seen=new Set();let lastError='';
 for(const source of sources){
  try{
   for(let offset=0;offset<500&&songs.length<100;offset+=100){
    const batch=await requestSource(source,artist,offset);
    for(const s of batch){
     const names=(s.artists||s.ar||[]).map(a=>String(a.name||''));
     if(!names.some(n=>n.toLowerCase().includes(artist.toLowerCase())))continue;
     const id=String(s.id||'');if(!id||seen.has(id))continue;
     seen.add(id);songs.push({id,name:String(s.name||''),artists:names,duration:s.duration||s.dt||0,link:'https://music.163.com/#/song?id='+encodeURIComponent(id)});
    }
    if(batch.length<100)break;
   }
   if(songs.length)return res.status(200).json({songs:songs.slice(0,100)});
  }catch(e){lastError=e.message||'接口不可用'}
 }
 return res.status(502).json({error:'网易云搜索暂不可用（'+lastError+'）。可展开「导入歌单」继续使用。'});
};
