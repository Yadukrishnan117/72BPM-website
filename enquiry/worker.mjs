import nodemailer from 'nodemailer';
import {handle, json, message} from './handler.mjs';
export default {fetch:handle};

// One durable object per submission serializes retries. Only hashes and status are stored.
export class Submission {
  constructor(state, env, createTransport = nodemailer.createTransport) {this.state=state;this.env=env;this.createTransport=createTransport;}
  async fetch(request) {
    return this.state.blockConcurrencyWhile(async()=>{
      const data=await request.json();
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(message(data))));
      const fingerprint=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
      const previous=await this.state.storage.get('result');
      if (previous) {
        if (previous.fingerprint!==fingerprint) return json(409,{error:'This enquiry changed. Please refresh the page before submitting it.'});
        if (previous.status==='accepted') return json(200,{ok:true});
        return json(503,{error:'We could not confirm this submission. Please email hello@72-bpm.com and include your reference: '+data.requestId});
      }
      // Persist before SMTP: a timeout may mean Zoho already accepted the message.
      await this.state.storage.put('result',{fingerprint,status:'sending'});
      await this.state.storage.setAlarm(Date.now()+24*60*60*1000);
      const transport=this.createTransport({host:this.env.SMTP_HOST,port:465,secure:true,
        auth:{user:this.env.SMTP_USER,pass:this.env.SMTP_PASSWORD},
        connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
        tls:{minVersion:'TLSv1.2',rejectUnauthorized:true},
        disableFileAccess:true,disableUrlAccess:true});
      try {
        const result=await transport.sendMail(message(data));
        if (!result.accepted?.includes('hello@72-bpm.com')) throw new Error('rejected');
        await this.state.storage.put('result',{fingerprint,status:'accepted'});
        return json(200,{ok:true});
      } catch {
        await this.state.storage.put('result',{fingerprint,status:'uncertain'});
        return json(502,{error:'We could not confirm delivery. Please email hello@72-bpm.com and include your reference: '+data.requestId});
      } finally {transport.close();}
    });
  }
  async alarm() {await this.state.storage.deleteAll();}
}
