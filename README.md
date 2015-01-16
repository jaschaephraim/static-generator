# Minimal Static Website Generator and Development Environment

Built specifically to manage [jaschaephraim.com](http://jaschaephraim.com), and explained in detail in this [article on medium.com](https://medium.com/@jaschaephraim/building-a-minimal-static-website-generator-and-development-environment-with-node-js-91fc153c189e).

- [CLI](#cli)
    + [stat-gen new](#stat-gen-new-new-project-dir)
    + [stat-gen start](#stat-gen-start-project-dir)
    + [stat-gen export](#stat-gen-export-project-dir-new-export-dir)
- [Project Structure](#project-structure)
    + [jade/index.jade](#jadeindexjade)
    + [styl/app.styl](#stylappstyl)
    + [js/app.js](#jsappjs)
    + [static/](#static)
    + [content/](#content)
    + [tags/](#tags)

## CLI

### stat-gen new _new-project-dir_
Creates new project template.

### stat-gen [start _project-dir_]
Starts development environment. Compiles everything (without writing to files), starts watcher and server.

### stat-gen export [_project-dir_] _new-export-dir_
Exports project to a static site with the structure:

```
[project-root]/
├──app.min.css
├──app.min.js
├──┬fonts/
│  ├──[font-one/]
│  └──[font-two/]
├──┬img/
│  ├──[image-one.jpg]
│  └──[image-two.png]
└──index.html
```

## Project Structure

### jade/index.jade
Exports to `index.html`.

### styl/app.styl
Exports to `app.min.css`.

### js/app.js
Exports to `app.min.js`. Can include CommonJS style `require()`, and you can require anything in `bower_components/` by its package name.

### static/
Contents copied recursively to `/` upon export. For images, fonts, etc.

### content/
Each Markdown file in `content/` represents an individual piece of content. Metadata can be included in YAML front matter, and will be available to Jade templates. The compiled markdown (which should not be html-escaped) itself is stored in the property `body`.

### tags/
Similar to `content/`, each Markdown file represents a tag. Each file should define at least a `content` list in its YAML, listing the file names (without `.md` extension) that are included in the tag.

#### Example:
`content/chihuaha.md`:

```yaml 
---
title: Chihuahua
---
Chihuahuas are the best.
```

`tags/dogs.md`:

```yaml
---
title: Dogs
content:
  - chihuaha
---
I like dogs!
```

`jade/index.jade`:

```jade
doctype html
html
  head
    title= tags.dogs.title
  body
    h1= tags.dogs.title
    div!= tags.dogs.body
    each dog in tags.dogs.content
      h2= content[dog].title
      div!= content[dog].body
```

Will render to `index.html` as:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Dogs</title>
  </head>
  <body>
    <h1>Dogs</h1>
    <div>
      <p>I like dogs!</p>
    </div>
    <h2>Chihuahua</h2>
    <div>
      <p>Chihuahuas are the best.</p>
    </div>
  </body>
</html>
```
