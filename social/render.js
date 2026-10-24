const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///tmp/claude-0/-home-user-Website-/fd6f87a9-1fb4-520e-83ea-b6862d91086e/scratchpad/reel/reel.html');await p.evaluate(()=>window.ready);
const dur=await p.evaluate(()=>window.DURATION);const fps=30,n=Math.round(dur*fps);console.log('dur',dur,'frames',n);
const only=process.argv[2]?process.argv[2].split(',').map(Number):null;
for(let i=0;i<n;i++){const t=i/fps; if(only&&!only.some(s=>Math.abs(s-t)<1/60))continue;
 await p.evaluate(t=>window.render(t),t);
 await p.screenshot({path:'/tmp/claude-0/-home-user-Website-/fd6f87a9-1fb4-520e-83ea-b6862d91086e/scratchpad/reel/frames/f'+String(i).padStart(4,'0')+'.jpg',type:'jpeg',quality:93,clip:{x:0,y:0,width:1080,height:1920}});}
await b.close()})();
