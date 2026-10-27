// Regular {8,3} hyperbolic tiling, constructed by reflections in disk geodesics.
const norm=z=>Math.hypot(z[0],z[1]);
const key=z=>z.map(n=>Math.round(n*1e7)).join(',');

function mirror(a,b){
 const det=2*(a[0]*b[1]-a[1]*b[0]);
 if(Math.abs(det)<1e-12){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const u=[(b[0]-a[0])/length,(b[1]-a[1])/length];
  return {centre:null,radius:Infinity,reflect:z=>{const dot=z[0]*u[0]+z[1]*u[1];return[2*dot*u[0]-z[0],2*dot*u[1]-z[1]];}};
 }
 const aa=1+a[0]*a[0]+a[1]*a[1],bb=1+b[0]*b[0]+b[1]*b[1];
 const centre=[(aa*b[1]-bb*a[1])/det,(a[0]*bb-b[0]*aa)/det];
 const radiusSquared=centre[0]*centre[0]+centre[1]*centre[1]-1;
 return {centre,radius:Math.sqrt(Math.max(0,radiusSquared)),reflect:z=>{
  const dx=z[0]-centre[0],dy=z[1]-centre[1],scale=radiusSquared/(dx*dx+dy*dy);
  return[centre[0]+scale*dx,centre[1]+scale*dy];
 }};
}

export function createAdSTessellation(){
 const sides=8,aroundVertex=3,limit=.9915,maxDepth=9;
 const coshRadius=1/(Math.tan(Math.PI/sides)*Math.tan(Math.PI/aroundVertex));
 const radius=Math.sqrt((coshRadius-1)/(coshRadius+1));
 const root={centre:[0,0],depth:0,vertices:Array.from({length:sides},(_,i)=>{
  const angle=(2*i+1)*Math.PI/sides;return[radius*Math.cos(angle),radius*Math.sin(angle)];
 })};
 const tiles=[root],seen=new Set([key(root.centre)]);
 for(let i=0;i<tiles.length;i++){
  const tile=tiles[i];if(tile.depth>=maxDepth)continue;
  for(let edge=0;edge<sides;edge++){
   const reflection=mirror(tile.vertices[edge],tile.vertices[(edge+1)%sides]);
   const centre=reflection.reflect(tile.centre),id=key(centre);
   if(norm(centre)>limit||seen.has(id))continue;
   const vertices=tile.vertices.map(reflection.reflect);
   if(vertices.some(z=>!Number.isFinite(z[0]+z[1])||norm(z)>1.000001))continue;
   seen.add(id);tiles.push({centre,vertices,depth:tile.depth+1});
  }
 }
 const edges=new Map();
 for(const tile of tiles)for(let i=0;i<sides;i++){
  const a=tile.vertices[i],b=tile.vertices[(i+1)%sides],id=[key(a),key(b)].sort().join('|');
  if(!edges.has(id))edges.set(id,{a,b,geodesic:mirror(a,b)});
 }
 return{tiles,edges:[...edges.values()],sides,aroundVertex,radius};
}

let cached;
export function adsDiskFigure(lang='en'){
 const tiling=cached??=(createAdSTessellation());
 const cx=190,cy=145,scale=128,f=n=>String(Number(n.toFixed(3)));
 const point=z=>`${f(cx+scale*z[0])} ${f(cy+scale*z[1])}`;
 const arc=(a,b,geo)=>{
  if(!geo.centre)return`L${point(b)}`;
  const u=[a[0]-geo.centre[0],a[1]-geo.centre[1]],v=[b[0]-geo.centre[0],b[1]-geo.centre[1]];
  return`A${f(scale*geo.radius)} ${f(scale*geo.radius)} 0 0 ${u[0]*v[1]-u[1]*v[0]>0?1:0} ${point(b)}`;
 };
 const bands=Array.from({length:5},()=>[]);
 for(const edge of tiling.edges){
  const radius=(norm(edge.a)+norm(edge.b))/2;
  const band=radius<.65?0:radius<.85?1:radius<.95?2:radius<.982?3:4;
  bands[band].push(`M${point(edge.a)}${arc(edge.a,edge.b,edge.geodesic)}`);
 }
 const central=tiling.tiles[0].vertices;
 const centrePath=`M${point(central[0])}`+central.map((a,i)=>{const b=central[(i+1)%central.length];return arc(a,b,mirror(a,b));}).join('')+'Z';
 const widths=[.95,.8,.63,.48,.34],colours=['#547f68','#6c937b','#7c9f86','#8fac96','#a3b9a8'];
 const paths=bands.map((d,i)=>`<path d="${d.join('')}" stroke="${colours[i]}" stroke-width="${widths[i]}"/>`).join('');
 const title=lang==='es'?'Disco hiperbólico simétrico de AdS':'Symmetric hyperbolic AdS disk';
 const description=lang==='es'?'Teselación hiperbólica regular con simetría de orden ocho en el disco de Poincaré, como representación de una sección espacial de AdS3.':'An eightfold-symmetric regular hyperbolic tessellation in the Poincaré disk, representing a spatial slice of AdS3.';
 return `<svg class="ads-disk-diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 300" fill="none" role="img" aria-labelledby="ads-disk-title ads-disk-description"><title id="ads-disk-title">${title}</title><desc id="ads-disk-description">${description}</desc><defs><clipPath id="ads-disk-clip"><circle cx="${cx}" cy="${cy}" r="${scale}"/></clipPath><radialGradient id="ads-disk-wash"><stop stop-color="#f6f7f1"/><stop offset="1" stop-color="#edf2ea"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${scale}" fill="url(#ads-disk-wash)"/><g clip-path="url(#ads-disk-clip)"><path d="${centrePath}" fill="#dce8da" fill-opacity=".28"/><g stroke-linecap="round" stroke-linejoin="round">${paths}</g></g><circle cx="${cx}" cy="${cy}" r="${scale}" stroke="#91ad98" stroke-width=".75"/></svg>`;
}
