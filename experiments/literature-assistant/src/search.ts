import records from './literature.json';
export type Literature = typeof records[number];
const groups=[['LoRA','低秩'],['宫灯','灯彩','北京灯彩'],['评价','评估','验证','实验','FID','IS指标','满意度','问卷'],['知识库','信息库','档案','数据库','检索'],['流程','路径','步骤','方法'],['纹样','图案','元素'],['风险','伦理','文化挪用','原真性','保真','误读'],['三维','3D','Tripo','建模'],['SD','Stable Diffusion','扩散模型'],['Midjourney','MJ'],['文创','产品','包装'],['对比','比较','区别','实验']];
export function search(query:string,onlyRelevant=true){
 const norm=(s:string)=>s.toLowerCase().replace(/\s+/g,'');const q=norm(query);const terms=new Set<string>();
 const matchedGroups=groups.filter(g=>g.some(w=>q.includes(norm(w))));
 for(const g of matchedGroups)g.forEach(w=>terms.add(norm(w)));
 const anchors=matchedGroups.filter(g=>['LoRA','宫灯','知识库','风险','三维','SD','Midjourney'].includes(g[0]));
 const clean=q.replace(/请|帮我|找出|哪些|文献|文章|研究|有没有|关于|可以|什么|如何|怎么|值得|精读|二次|里面|这个|一下|相关|进行|是否|用于|使用|的|了|和|与|是|在|我|吗|呢/g,' ');
 for(const p of clean.split(/[^\p{L}\p{N}]+/u).filter(Boolean)){if(p.length>=2)terms.add(p);if(/[\u4e00-\u9fff]/.test(p))for(let i=0;i<p.length-1;i++)terms.add(p.slice(i,i+2));}
 return records.filter(d=>!onlyRelevant||d.relevant).filter(d=>anchors.every(g=>g.some(w=>norm(d.title+d.summary).includes(norm(w))))).map(d=>{const t=norm(d.title+d.authors),s=norm(d.summary),n=norm(d.note);const matches=[...terms].filter(w=>t.includes(w)||s.includes(w)||n.includes(w));const score=matches.reduce((a,w)=>a+(t.includes(w)?5:0)+(s.includes(w)?2:0)+(n.includes(w)?1:0),0);return {...d,score,matches:matches.slice(0,6)};}).filter(d=>d.score>=2&&(matchedGroups.length>0||d.matches.length>=Math.max(1,Math.ceil(terms.size*0.45)))).sort((a,b)=>b.score-a.score||a.id-b.id).slice(0,6);
}

