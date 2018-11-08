# Car game in planckjs

The original code by:
 * Copyright (c) 2016-2018 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org

## How to run
```
git clone git@github.com:KizmetMars/car-in-planckjs.git
npm run build
```

## Setup a repo

### Create a project direcory
```
mkdir car-in-planckjs
cd car-in-planckjs
```

### Init npm project
```
npm init -y
```

### Install required dependencies
```
npm install planck-js --save
```

### Create a structure of a project

`src` - the source code
`dist` - compiled code

### Create index.js file in src
### Create index.html file in dist and include bundle.js
```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="all:initial">
    <script src="bundle.js"></script>
</body>
</html> 
```

### Generate bundle.js and run the app
```
npm run build
```

where `build` is a reference to a script name in package.json
the script is: `webpack && cd dist && python -m SimpleHTTPServer 8000`, 
    where webpack picks up `webpack.config.js`.

and `python -m SimpleHTTPServer 8000` runs a simple web server to serve the content
