# simonwardjones.co.uk
Personal website


# Theme details

## Webpack

The webpack server builds the custom js, importing bootstrap into bundle js. This is loaded in the footer of the layouts.
The css is compiled from sass so that custom scss can be included with the bootstrap import. Also rebuilding bootstrap allows us to edit settings like base font before building in bootstrap.

The sass is compiled and then extracted using a plugin so that we can include the css in the header separately from the js (it is included in ths js if we were using the 'style-loader'). When I tried the style-loader the page was flashing with no formatting before the loader kicked in.

The issue with with this approach is the client doesn't know when the bundle.js has updated.

However chrome does not hot reload css so for dev mode it is better to use the style loader in dev! For this use

Favicon and Icons
- I generated them using favicon.io and then just referenced the links in the head partial

```bash
npm run dev
```
which is just:
```bash
webpack --watch --config webpack.dev.config
```