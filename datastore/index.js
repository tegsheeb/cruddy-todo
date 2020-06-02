const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //getNextUniqueId needs to be fixed with callback
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw ('error writing item');
    } else {
      items[id] = text;
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, data) => {
        if (err) {
          throw ('error writing item');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  fs.readdir(exports.dataDir, function(err, files) {
    if (err) {
      throw ('error scanning directory');
    } else {
      if (files.length === 0) {
        callback(null, []);
      } else {
        var list = [];
        files.forEach(function (file) {
          var obj = {};
          obj['id'] = file.substring(0, 5);
          obj['text'] = file.substring(0, 5);
          list.push(obj);
        });

        callback(null, list);
      }
    }

  });
};

exports.readOne = (id, callback) => {
  var fileP = path.join(exports.dataDir, `${id}.txt`);
  console.log(fileP);
  fs.readFile(fileP, (err, fileData)=> {
    if (err) {
      callback(err, 0);
    } else {
      callback(null, {id, text: fileData.toString()});
    }
  });

};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};