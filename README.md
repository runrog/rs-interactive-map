## Rackspace Interactive SVG Map
This is a WIP project that creates a new svg map with custom bubbles/tooltips created from a config using svg.js.

![alt text](rs-map-demo.png "")

### Install
```
npm install
```
```
npm start
```
You're browser should automatically launch at localhost 2004.
## Config
The map is customizable through the config. It basically takes an array of markers in which you can edit it's bubble, tool tip and lines if needed. To reposition elements, you need to play with the x and y axises. See below:

```
{
  markers: [
    {
      bubble: {
        color: '#c40022',
        diameter: 30,
        x: 125,
        y: 295,
      },
      line: {
        enabled: true,
        color: '#c40022',
        width: 2,
        plots: '0, 50, 50, 30',
        x: 155,
        y: 285,
      },
      tip: {
        icon: '',
        type: 'Data Center',
        title: 'Lon DC',
        // array of lines
        text: [
          'I am a line!',
          'I am another line!',
        ],
        link: 'some-link',
        linkIcon: 'some-other-class',
        width: 200,
        height: 100,
      },
    },
    {
      bubble: {
        color: '#c40022',
        diameter: 35,
        x: 770,
        y: 285,
      },
      line: {
        enabled: false,
      },
      tip: {
        icon: '',
        type: 'Data Center',
        title: 'HK DC',
        // array of lines
        text: [
          'HK is Rackspaces latest',
          'Data Center, we patterned',
          'with Digital Realty Trust who',
          'lead the design and',
          'construction of the building',
          'to our requirements.',
        ],
        link: 'some-link',
        linkIcon: 'some-other-class',
        width: 250,
        height: 160,
      },
    },
}
```

### Gulp Tasks
Gulp tasks will run automatically but to manually run them:

Building Javascript: This will concat the js files together in order by name:
```
gulp build-js
```

Building SASS
```
gulp build-sass
```

### Repo STACK
* Gulp (automation)
* SVG.js
* EJS (templating)
* BrowserSync (live reloading)
* SASS
* ES6 (gulp-babel)
* eslint (js linting)
