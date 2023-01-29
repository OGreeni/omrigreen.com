---
layout: '../../layouts/MarkdownPostLayout.astro'
title: "What's New in Astro 2.0?"
pubDate: '2023-01-29'
author: 'Omri Green'
description: Astro 2.0 is here! In this short article, we will take a tour of the new features and improvements.
tags: ['astro', 'typescript']
---
## But first, what is Astro?

Astro is a framework agnostic, top-performing static site generator (though it is not limited to static sites). This means you can use your favorite frontend library or framework (such as React, Svelte, Vue, SolidJS, and Preact) and ship 0 JavaScript to the browser by default. With its powerful integrations and Markdown support, Astro is a great choice for building content-heavy sites.

## Content Collections

The first thing you'll notice when wandering around the changelog is something called "Content Collections," which is a new, type-safe way to work with Markdown or MDX files. I always found Markdown annoying to work with in Astro, especially when using TypeScript, so I'm glad to see the team has addressed this issue.

### Creating New Collections

To create a new collection, create a new `/content` directory within your `/src` directory. Within `/content`, create a new `config.ts` file to define your collection schema. For example, if you want to create a collection of blog posts, you can do the following:

```ts
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    pubDate: z.string(),
    tags: z.array(z.string()),
    ttr: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

This will create a new `blog` collection with the specified schema as the type for the frontmatter of each post. You can then create a new `/blog` directory within `/content`, and host your blog posts there. For example, you can create a new `hello-world.md` file with the following frontmatter:

```md
---
title: 'Hello World'
author: 'Omri Green'
description: 'My first blog post!'
pubDate: '2021-01-01'
tags: ['astro', 'typescript']
ttr: '5 minutes'
---
```

If you try to add a new property to your frontmatter that is not defined in your schema, or omit a required property, you will get an error at build time. This is a great way to ensure that your frontmatter is consistent across all of your posts.

### Using Collections

You can import your collections and use them in your pages, in a type-safe way. For example, in your `index.astro` file, you can do the following:

```astro
---
import {(getCollection, getEntryBySlug)} from 'astro:content';

const blogPosts = await getCollection('blog');
// each blog post is now typed as the schema you defined in your config.ts file. You can access the frontmatter using the `data` property.

// you can also access individual posts by a slug, which will be automatically generated as a URL-friendly version of your filename. Note that this function is also type-safe, and you will only be able to query for posts that exist in your collection. Pretty cool, right?
const helloWorldPost = await getEntryBySlug('blog', 'hello-world');
---
```

Note that the types for your collections are generated at build time, so you will need to rebuild your site if you make any changes to your collection schema. You can simply run `npm run dev`, `npm run build`, or update the types manually using the `npm run astro sync` command.

## Hybrid Rendering
Another new feature is "Hybrid Rendering," which is a fancy way of saying that you can now choose between server-side rendering and static site generation on an individual page basis.

### Enabling Hybrid Rendering
First, you must enable server-side rendering in your `astro.config.mjs` file as follows:

```js
import { defineConfig } from 'astro';

export default defineConfig({
  output: 'server',
});
```

Now, your entire site will be server-rendered. With the new hybrid rendering feature, you can choose to render a page statically by adding the `prerender` export. For example, in your `index.astro` file, you can do the following:

```astro
export const prerender = true;
```

Now, your `index.astro` file will be rendered statically, and the rest of your site will be server-rendered.
My only gripe with this feature is that you must enable server-side rendering for the entire site, and then enable static rendering for individual pages. I would have preferred to be able to enable server-side rendering on a per-page basis instead, but I guess that's a feature for another day.

## Other Features and Improvements
There are also some smaller features that I'd like to mention. There is a new error UI that is much more helpful and informative than the previous one, as well as improvements to hot module reloading (HMR).

## Conclusion
Astro 2.0 is a great update, and I'm excited to see what the future holds for this framework. If you're interested in learning more about Astro, check out the [official documentation](https://docs.astro.build/).