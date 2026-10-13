import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,handle,message} from './handler.mjs';
import {Submission} from './worker.mjs';
const data={name:'Test Visitor',email:'visitor@example.com',details:'Website enquiry integration test',category:'Custom Development',budget:'Let’s discuss',requestId:'f2cc4a0f-317a-4c28-a620-cfbb9557c4a1',website:''};
const request=(payload=data,origin='https://72-bpm.com',method='POST')=>new Request('https://worker.example/api/enquiry',{method,headers:{origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.1'},...(method==='POST'?{body:JSON.stringify(payload)}:{})});
test('accepts fields and fixes destination and reply-to',async()=>{
  const parsed=await validate(request({...data,to:'attacker@example.com'}));
  assert.equal(message(parsed).to,'hello@72-bpm.com');
  assert.equal(message(parsed).replyTo,data.email);
  assert.ok(message(parsed).text.includes(data.details));
});
test('rejects injections, invalid options, bots, missing fields and oversized bodies',async()=>{
  for (const changed of [{name:'x\r\nBcc:other@example.com'},{email:'x@example.com\r\nBcc:other@example.com'},{budget:'bad'},{website:'bot'},{requestId:'-'.repeat(36)},{details:''},{details:'x'.repeat(20000)}]) await assert.rejects(()=>validate(request({...data,...changed})));
});
test('restricts origin, permits preflight, fails closed without configuration',async()=>{
  assert.equal((await handle(request(data,'https://evil.example'),{})).status,403);
  const preflight=await handle(request(data,'https://72-bpm.com','OPTIONS'),{});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),'https://72-bpm.com');
  assert.equal((await handle(request(),{})).status,503);
});
test('applies platform rate limits before sending',async()=>{
  const env={SMTP_PASSWORD:'test',SMTP_USER:'hello@72-bpm.com',SMTP_HOST:'smtp.example',SUBMISSIONS:{},ENQUIRY_RATE_LIMITER:{limit:async()=>({success:false})}};
  assert.equal((await handle(request(),env)).status,429);
});
function state(){const values=new Map();let chain=Promise.resolve();return{storage:{get:async k=>values.get(k),put:async(k,v)=>values.set(k,v),setAlarm:async()=>{},deleteAll:async()=>values.clear()},blockConcurrencyWhile:fn=>{const result=chain.then(fn);chain=result.catch(()=>{});return result;}};}
const internal=payload=>new Request('https://internal/submit',{method:'POST',body:JSON.stringify(payload)});
test('concurrent retries send once; changed payload cannot reuse a reference',async()=>{
  let calls=0;
  const object=new Submission(state(),{},options=>{assert.equal(options.secure,true);assert.equal(options.tls.rejectUnauthorized,true);return{sendMail:async()=>{calls++;return{accepted:['hello@72-bpm.com']}},close(){}}});
  const results=await Promise.all([object.fetch(internal(data)),object.fetch(internal(data))]);
  assert.equal(calls,1);assert.ok(results.every(r=>r.status===200));
  assert.equal((await object.fetch(internal({...data,details:'Different message'}))).status,409);
});
test('uncertain SMTP outcome never sends again automatically',async()=>{
  let calls=0;
  const object=new Submission(state(),{},()=>({sendMail:async()=>{calls++;throw new Error('timeout')},close(){}}));
  assert.equal((await object.fetch(internal(data))).status,502);
  assert.equal((await object.fetch(internal(data))).status,503);
  assert.equal(calls,1);
});
