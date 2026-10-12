export const recipient = 'hello@72-bpm.com';
const origins = new Set(['https://72-bpm.com', 'https://www.72-bpm.com']);
const categories = new Set(['EV CMS Platform', 'OCPI Integration', 'IoT Dashboard', 'Custom Development']);
const budgets = new Set(['Under ₹5 lakh', '₹5–15 lakh', '₹15–50 lakh', '₹50 lakh+', 'Let’s discuss']);
export const json = (status, body) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff'}});
export async function validate(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('format');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('form');
  const chunks = []; let size = 0;
  for (;;) {
    const {done, value} = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 16000) {await reader.cancel(); throw new Error('size');}
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.length;}
  const input = JSON.parse(new TextDecoder().decode(bytes));
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.website) throw new Error('form');
  const data = {};
  for (const [key, limit] of Object.entries({name:100,email:254,details:3000,category:100,budget:100,requestId:36})) {
    if (typeof input[key] !== 'string') throw new Error('form');
    data[key] = input[key].trim();
    if (!data[key] || data[key].length > limit || data[key].includes('\0')) throw new Error('form');
  }
  if (/[\r\n]/.test(data.name) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) || !categories.has(data.category) || !budgets.has(data.budget) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) throw new Error('form');
  return data;
}
export function message(data) {
  return {from:{name:'72BPM Website',address:recipient},to:recipient,replyTo:data.email,
    subject:'Website enquiry: '+data.category,
    text:`New project enquiry from 72BPM\n\nName: ${data.name}\nCompany email: ${data.email}\nCategory: ${data.category}\nBudget: ${data.budget}\n\nProject details:\n${data.details}\n\nReference: ${data.requestId}`};
}
export async function handle(request, env) {
  const origin = request.headers.get('origin');
  const respond = response => {
    const headers = new Headers(response.headers);
    if (origins.has(origin)) headers.set('access-control-allow-origin', origin);
    headers.set('vary','Origin');
    return new Response(response.body,{status:response.status,headers});
  };
  if (new URL(request.url).pathname !== '/api/enquiry') return respond(json(404,{error:'Not found'}));
  if (!origins.has(origin)) return json(403,{error:'Please submit through the 72BPM website.'});
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST','access-control-allow-headers':'Content-Type','access-control-max-age':'600','vary':'Origin'}});
  if (request.method !== 'POST') return respond(json(405,{error:'Please use the enquiry form.'}));
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip || !env.ENQUIRY_RATE_LIMITER || !env.SUBMISSIONS || !env.SMTP_PASSWORD || !env.SMTP_HOST || !env.SMTP_USER) return respond(json(503,{error:'Email submission is being connected. Please email hello@72-bpm.com.'}));
  try {
    const allowed = await env.ENQUIRY_RATE_LIMITER.limit({key:ip});
    if (!allowed.success) return respond(json(429,{error:'Please wait a minute before trying again.'}));
    const data = await validate(request);
    const object = env.SUBMISSIONS.get(env.SUBMISSIONS.idFromName(data.requestId));
    return respond(await object.fetch(new Request('https://internal/submit',{method:'POST',body:JSON.stringify(data)})));
  } catch (error) {
    if (['format','form','size'].includes(error.message) || error instanceof SyntaxError) return respond(json(400,{error:'Please check all form fields and shorten long project details.'}));
    return respond(json(503,{error:'Enquiries are temporarily unavailable. Please email hello@72-bpm.com.'}));
  }
}
