---
layout: '../../layouts/MarkdownPostLayout.astro'
title: 'Client vs Server Components in Next.js 13'
pubDate: 2023-01-15
author: 'Omri Green'
description: The crucial distinction between client & server components in Next.js 13, and how to utilize them fully.
tags: ['nextjs', 'react']
---

## What are client & server components?

The latest version of React, version 18, introduces a revolutionary new feature known as server components, now available in Next.js 13. This powerful tool represents a major advancement for React, and is poised to revolutionize the way we build web applications. In this post, we'll dive into the details of server components, exploring what they are and how they work.

Before we proceed, it's essential to understand the key distinctions between client and server components. Let's start with the fundamentals. Client components are the same components you know and are familiar with, the ones rendered on the client side. These components are required for interactivity and any use of JavaScript within the page.

Conversely, server components are only rendered on the server side and do not send any JavaScript to the browser by default. These components are an excellent option for optimizing performance, as well as displaying static content and fetching data. Additionally, server components can directly access backend resources and API keys (as we will explore later), since they are not exposed to the client. This offers a significant advantage over client components that are rendered in the browser and can be easily inspected by the user.

If you want to dive deeper into these concepts, the [official Next.js documentation](https://beta.nextjs.org/docs) is a comprehensive resource. It explains the difference between client and server components in detail, and it also provides a great overview of the new features in Next.js 13. But now, let's move on to the practical implementation.

## Using client & server components

Server components are only available in the `app` directory new to Next.js 13. To spin up a new Next.js 13 project, run the following command (using your favorite package manager)):

```bash
# npm
npx create-next-app@latest --experimental-app

# yarn
yarn create next-app --experimental-app
```

After that's done, you'll have a new Next.js 13 project ready to go. You can start by editing the root `page.tsx` file (assuming you're using TypeScript):

```tsx
import React, { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

However, you will get the following error when you try to run the app:

```bash
Server Error
Error:

You are importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they are Server Components by default.

   ,-[1:1]
 1 | import React, { useState } from 'react';
   :                 ^^^^^^^^
 2 |
 3 | export default function Home() {
 4 |   const [count, setCount] = useState(0);
   `----


Maybe one of these should be marked as a client entry with "use client":
  app/page.tsx

```

In the latest version of Next.js, all compoennts are server-side by default unless specified otherwise. If you recall, this means that the component is rendered on the server, and does not ship any JavaScript to the browser. As a result, the `useState` hook cannot be used in server components. **As a matter of fact, we cannot use any hooks in server components, or listen to events**. This is important to keep in mind.

Now, you may be wondering, how can we make use of `useState` in this case? The answer is simple: we need to mark the component as a client component. To do that, we can simply add the `use client` directive at the top of the file:

```tsx
'use client';
```

Now, if we try to run the app again, everything should work as expected.

A great principle to follow is to **prioritize server-side rendering and only use client-side components when absolutely necessary**. Server components are faster and more performant, but if a component requires client-side features, it can be marked as a client component.

Consider the following example:

```tsx
'use client';
import React, {useState} from 'react';
export default function Page() {
    const [count, setCount] = useState(0);
    return (
        <>
        <p>A bunch of static content...</p>
        <p>lorem ipsum dolor sit amet...</p>
        <button onClick={() => setCount(count + 1)}>Increment {count}</button>
    )
}
```

Since only a small portion of our component requires interactivity (the button), it is not efficient to mark the entire component as a client-side component and ship unnecessary JavaScript to the browser. A better solution is to extract the interactive part of the component into a separate client component, and render everything else on the server:

```tsx
// button.tsx
'use client';
import React, { useState } from 'react';
export default function Button() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Increment {count}</button>;
}
```

```tsx
// page.tsx
import React from 'react';
import Button from './button.tsx';
export default function Page() {
    return (
        <>
        <p>A bunch of static content...</p>
        <p>lorem ipsum dolor sit amet...</p>
        <Button />
    )
}
```

Now, we are only shipping the interactive part of the component to the browser, and we are still able to use `useState` in the component. This works because **client components can be neseted inside server components**. However, the opposite _cannot_ be done.

## Fetching data

In Next.js 13, it is recommended to fetch data on the server. You can read more about the advantages in the [official docs](https://beta.nextjs.org/docs/data-fetching/fundamentals#fetching-data-on-the-server), but in short, fetching data on the server is faster and more performant. If you must fetch data on the client, you can still use libraries such as [React Query](https://tanstack.com/query/latest) or [SWR](https://swr.vercel.app/) as you would normally.

When you fetch data inside server components, the `fetch` API is extended to provide a few extra features, such as automatic request deduping, as well as data cahing and revalidating. Additionally, server components can be asynchronous, which allows us to fetch data with ease. Let's take a look at an example:

```tsx
import React from 'react';

export default async function PostList() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(
    (res) => res.json()
  );
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

As you can see, the component is marked as `async`, and we are using the `await` keyword to fetch the data -- it doesn't get any simpler than that. You can also configure the `fetch` API to your liking with the configuration object, as illustrated here:

```tsx
// Default behavior. Data will be fetched at build time and cached. Best for data --
// that doesn't change often.
fetch('https://my-api.com/posts', { cache: 'force-cache' });

// Will fetch the data on every request. Best for data that changes regularly.
fetch('https://my-api.com/posts', { cache: 'no-store' });

// Hybrids of the above two options are also possible.
// Data will be fetched and cached, but will be revalidated every 10 seconds --
// if there are any requests.
fetch('https://my-api.com/posts', { next: { revalidate: 10 } });
```

In this new mental model, we can think of each fetch as an individual unit of data that can be configured independently. This is much more versatile than the previous model, where we could only configure data fetching at the page level. Also, since Next.js 13 does automatic request deduping, you should fetch data where it's used, and not worry about fetching the same data multiple times.

## Conclusion

I am very excited for this change, and think it will make building apps with Next.js a much better experience. Again, if you want to learn more, you can go through the [official documentation](https://nextjs.org/docs/basic-features/data-fetching), which provides a lot of useful information that I did not have time to cover in this article. I hope this article was helpful, and I will see you in the next one!
