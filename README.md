# simonwardjones.co.uk

Personal website

This personal website is built with the Hugo static site generator and is currently hosted on AWS amplify.

# Useful commands

Build and serve pages (including drafts -D)

```bash
hugo -D serve
```


# Theme details

The theme (see `simon-blog-theme`) is found in the themes folder. To install the theme dependencies use (make sure to be in the theme directory):

```bash
npm install
```

To run the theme in dev mode:
```bash
npm run dev
```
which is just:
```bash
webpack --watch --config webpack.dev.config
```

To build theme
```bash
npm run build
```


## Webpack

The webpack server builds the custom js, importing bootstrap into bundle js. This is loaded in the footer of the layouts.
The css is compiled from sass so that custom scss can be included with the bootstrap import. Also rebuilding bootstrap allows us to edit settings like base font before building in bootstrap.

The sass is compiled and then extracted using a plugin so that we can include the css in the header separately from the js (it is included in ths js if we were using the 'style-loader'). When I tried the style-loader the page was flashing with no formatting before the loader kicked in.

The issue with with this approach is the client doesn't know when the bundle.js has updated.

However chrome does not hot reload css so for dev mode it is better to use the style loader in dev!

Favicon and Icons
- I generated them using favicon.io and then just referenced the links in the head partial
- Icons are provided with fonts awesome https://fontawesome.com/icons?d=gallery&m=free

Checking emojis compatibility - https://www.emojibase.com/emojilist/money
