---
layout: '../../layouts/MarkdownPostLayout.astro'
title: 'Client vs Server Components in Next.js 13'
pubDate: 2022-07-01
author: 'Omri Green'
description: The crucial distinction between client & server components in Next.js 13.
tags: ['nextjs', 'react']
---

React 18 comes with a brand new feature called server components, which is supported in Next.js version 13. This is a huge step forward for React, and it's a game-changer for the web. In this post, I'll explain what server components are, and how they work.

There is a crucial difference between client and server components, and it's important to understand this difference. Let's start with the basics. Client components are the same components you've seen and are familiar with, the ones rendered on the client side. This means that the component is rendered in the browser (though it can be rendered on the server side and then hydrated in the browser, as you've seen in previous versions of Next.js). Client components are required for interactivity and use of JavaScript.

Server components, on the other hand, are rendered exclusively on the server side. They ship zero JavaScript to the browser by default, and they are a great choice for SEO and performance, as well as for static content and data fetching. They can access backend resources and API keys directly (as we'll see in a little bit), since they are never exposed to the client. This is a huge advantage over client components, which are rendered in the browser and can be easily inspected by the user.

If you want to dive deeper into these concepts, the official Next.js documentation is a great resource. It explains the difference between client and server components in detail, and it also provides a great overview of the new features in Next.js 13. But now, let's jump into the implementation.

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

You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.

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

This is because, in the new version of Next.js, **every component in your application is a server component by default, unless explicitly stated otherwise**. If you remember, this means that the component is rendered on the server side, and ships zero JavaScript to the browse -- we cannot make use of `useState`, since it's a client-side feature that requires JavaScript. **As a matter of fact, we cannot use any hooks in server components, or listen to events.**

Now, you may be wondering, how can we make use of `useState` in this case? The answer is simple: we need to mark the component as a client component. To do that, we need to add the `use client` directive at the top of the file:

```tsx
'use client';
```

Now, if we try to run the app again, everything should work as expected.

**As a rule of thumb, you should render as much as possible on the server side, and only use client components when you need to.** This is because server components are much faster and more performant than client components, and they are also great for SEO. However, if you need to make use of client-side features, such as `useState`, you can do so by marking the component as a client component.

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
In this example, only a small portion of our component actually requires interactivity. However, this requires as to mark the entire component as a client component. This is not ideal, since we are shipping a lot of unnecessary JavaScript to the browser. In this case, we can extract the interactive part of the component into a separate component, and mark it as a client component:

```tsx
// button.tsx
'use client';
import React, {useState} from 'react';
export default function Button() {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>Increment {count}</button>
    )
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

Now, we are only shipping the interactive part of the component to the browser, and we are still able to use `useState` in the component. This works because **client components can be neseted inside server components**. However, the opposite *cannot* be done.


## Fetching data

Fetching data can be done on both the client and the server, but Next.js recommends fetching as much as possible on the server. This has a few advantages:

TODO: add advantages

If you are fetching data on the client, you can still use libraries such as React Query or SWR, as you would normally. On the server, Next.js extends the native browser `fetch` API to provide a few extra features, such as TODO: add features.

As we've mentioned before, server components can be asynchonous. This allows us to fetch async data with ease. Let's take a look at an example:

```tsx
import React from 'react';

export default async function PostList() {
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    )
}
```

As you can see, the component is marked as `async`, and we are using the `await` keyword to fetch the data. As simple as that.

If you are familiar with previous versions of Next.js, you might remember that you could use the `getStaticProps` and `getServerSideProps` functions to fetch data. These functions no longer exist in Next.js 13, as we can fetch data directly inside server components. This new mental model is much more versatile, as it allows you to fetch data at the individual *fetch* level, and not just at the page level. The extension to the `fetch` API provided by Next.js 13 allows you to configure revalidation, caching, and a whole lot more for each and every fetch in your app. It also does automatically request deduping, which means that you should fetch data where it's used, and not worry about fetching the same data multiple times.

I am very excited for this change, and think it will make building apps with Next.js much more enjoyable. If you want to learn more, you can read the [official documentation](https://nextjs.org/docs/basic-features/data-fetching).