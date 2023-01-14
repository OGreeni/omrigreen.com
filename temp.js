// @ts-nocheck
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: 'b3dc5f183ab580c4aec863361db7e2d7-us21',
  server: 'us21',
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();
