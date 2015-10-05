var joi = require('joi');
var ffmpeg = require('fluent-ffmpeg');
var move_wowza_recorded_files = function(server, recordDir, fileExtension, scanInterval) {
  var fs = require('fs');
  var path = require('path');
  var watcher = require('./DirectoryWatcher.js');

  var dirWatcher = new watcher.DirectoryWatcher(recordDir, true);

  var extractThumbnail = function(filePath) {
    ffmpeg(filePath)
      .takeScreenshots({
        count: 1,
        timemarks: ['1'] // number of seconds
      }, filePath.slice(0, -4) , function(err) {
        console.log('screenshots were saved')
      });
  }

var updateDb = function(documents){
           var db = server.plugins['hapi-mongodb'].db;
          db.collection('streams').ensureIndex({
            loc: "2d"
          }, {
            min: -500,
            max: 500,
            w: 1
          }, function(err, result) {
            if (err)
              return console.dir(err);
            db.collection('streams').insert(documents, {
              w: 1
            }, function(err, result) {
              if (err)
                return console.dir(err);
            });
          }); 
}
  var handleRecordedFile = function(filePath) {
    if (path.extname(filePath) == fileExtension) {
      fs.stat(filePath, function(err, stats) {
        if (stats.isFile()) {
          //var arr = path.basename(filePath).slice(0, -4).split('@');
          //var basenameWithoutExtension = arr[0];
          //var geolocationString = arr[1];
          //var geo = geolocationString.split(',');
           extractThumbnail(filePath);
          var basenameWithoutExtension = path.basename(filePath).slice(0, -4);
          var documents = {
            title: basenameWithoutExtension,
            description: '',
            //loc: [parseFloat(geo[0]), parseFloat(geo[1])],
            creationDate: new Date(stats.atime),
            creator: '',
            videoUrl: 'rtsp://52.74.45.88:1935/vods3/_definst_/mp4:amazons3/remoterealityvod/'+ path.basename(filePath),
            thumbnailUrl: 'https://s3-ap-southeast-1.amazonaws.com/remoterealityvod/' + path.basename(filePath).slice(0, -4)+'/tn.png'
          };
          updateDb(documents);
        }
      });
    }
  }

  dirWatcher.on("fileRemoved", function(filepath, changes) {
    console.log("File deleted: " + filepath.fullPath);
  });

  dirWatcher.on("fileAdded", function(filepath) {
    if (path.extname(filepath.fullPath) == fileExtension) {
      console.log("File added: " + filepath.fullPath);
      var videoFileFullPath = filepath.fullPath;
      handleRecordedFile(videoFileFullPath);
    }
  });

dirWatcher.on("fileChanged", function (fileDetail, changes) {
  console.log("File Changed: " + fileDetail.fullPath);
  for (var key in changes) {
    console.log("  + " + key + " changed...");
    console.log("    - From: " + ((changes[key].baseValue instanceof Date) ? 
    changes[key].baseValue.toISOString() : changes[key].baseValue));
    console.log("    - To  : " + ((changes[key].comparedValue instanceof Date) ? 
    changes[key].comparedValue.toISOString() : changes[key].comparedValue));
  }
});

  dirWatcher.start(scanInterval);
  console.log("A directory monitor for " + dirWatcher.root + " has started now.");
};

exports.register = function(server, options, next) {
  move_wowza_recorded_files(server, options.recordDir, options.fileExtension, options.scanInterval);
  next();
};

exports.register.attributes = {
  name: 'vod-file-handler',
  version: '1.0.0'
};
