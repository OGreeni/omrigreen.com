import React, { useState } from 'react';
import { z, ZodError } from 'zod';
import axios from 'axios';
import NewsletterFormStatus from './NewsletterFormStatus';

// DEBUG TOMORROW...
export default function NewsletterModalButton() {
  const [formStatus, setFormStatus] = useState<
    'success' | 'invalid input' | 'server error' | 'email exists' | null
  >(null);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInput) return;

    setLoading(true);

    try {
      z.string().email().parse(emailInput);
      await axios.put('/api/newsletter/subscribe', {
        email: emailInput,
      });

      setFormStatus('success');
    } catch (error) {
      if (error instanceof ZodError) {
        setFormStatus('invalid input');
      } else {
        // @ts-ignore --> refactor
        if (error.response.data.error.response.text.includes('Member Exists')) {
          setFormStatus('email exists');
        } else {
          setFormStatus('server error');
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <label
        htmlFor="my-modal-6"
        className="btn-primary btn-xs btn md:btn-sm lg:btn-md"
      >
        Newsletter
      </label>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Subscribe to my newsletter</h3>
          <p className="py-4">
            By signing up, you will receive notifications of new articles,
            tutorials, and resources to help you grow as a developer. No spam
            guaranteed.
          </p>
          <form id="newsletter-form" onSubmit={(e) => handleSubmit(e)}>
            <label className="label">
              <span className="label-text">Enter your email:</span>
            </label>
            <input
              type="text"
              placeholder="username@site.com"
              id="email"
              name="email"
              className="input-bordered input-primary input w-full max-w-xs"
              onChange={(e) => setEmailInput(e.target.value)}
              value={emailInput}
            />
            <button className="btn-primary btn mt-1 ml-1">Subscribe</button>
          </form>
          <div className="mt-2">
            {formStatus && <NewsletterFormStatus formStatus={formStatus} />}
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
