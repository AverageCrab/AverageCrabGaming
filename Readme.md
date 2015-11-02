# The Good Exchange - Web App
This is the frontend node app for **The Good Exchange**.


## Setup
`npm install` to fetch dependencies.

`npm install -g gulp` to install gulp command line globally

`node server` - will start the web server

* `gulp vendor` - builds dependencies as vendor packages
* `gulp build` - builds apps within `/client`
* `gulp watch` - watches apps for changes and rebuilds



## Tips

`gulp vendor` - will build deps specified under vendor_packages in `config.yml` and place them in the main `layout.jade` file. If new packages are added, and `gulp vendor` is run, a server restart is required along with a `gulp build`.
