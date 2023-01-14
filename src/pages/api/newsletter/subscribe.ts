import { z, ZodError } from 'zod';
// @ts-ignore --> declaration file unavailable
import mailchimp from '@mailchimp/mailchimp_marketing';
import type { APIRoute } from 'astro';

export const put: APIRoute = async ({ request }) => {
  try {
    mailchimp.setConfig({
      apiKey: import.meta.env.MAILCHIMP_API_KEY,
      server: import.meta.env.MAILCHIMP_SERVER,
    });

    const { email } = await request.json();

    z.string().email().parse(email);

    const listId = '98c34add6c';
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'pending',
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
