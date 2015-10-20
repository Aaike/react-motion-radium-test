## react-motion + radium tests

React demos with `radium` and `react-motion`

See the [react-motion test](http://aaike.github.io/react-motion-radium-test/demos/motion-list)

See the [react-motion test with radium](http://aaike.github.io/react-motion-radium-test/demos/motion-list-radium)

This demo creates a list using react-motion.

The only difference between the 2 demos is the addition of the `@Radium` decorator in `Item.jsx`.

Both demos will react the same on desktop environment, but on mobile devices the difference is very noticeable.
The one with the `@Radium` decorator is slower than the one without Radium.

This seems to be an issue if Radium is used on many items on a page.

## Development

Watch a demo (build, serve and update with hot module reloading)

    npm run watch -- --demo motion-list

Server will be listen at localhost:9000.

## Production

Build a demo

    npm run build -- --demo motion-list

Start a server

    npm run start

Server will be listen at localhost:9000
