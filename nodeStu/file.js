var fs = require("fs");
var path = require('path');
var filePath = __dirname + '\\js';

function mergeFile(path) {
    fs.readdir(path, function (err, files) {
        var mergeData = new Buffer('');
        if (err) {
            return console.log(err);
        }
        files.forEach(function (x) {
            fs.readFile(path + "\\" + x, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                // console.log(data)
                // var temp = new Buffer(data);               
                // mergeData = Buffer.concat([mergeData, temp]);
                fs.appendFile('result2.js', data + '\n', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            })
        });
        console.log(mergeData);
        // fs.appendFile('result2.js', mergeData, function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        // });
    });
};
// mergeFile(filePath);

// copy

function copyFileSync(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src))
}

function copyFileAsync(src, dst) {
    fs.readFile(src, function (err, data) {
        if (err) console.log(err);
        fs.writeFile(dst, data, function (err) { if (err) console.log(err); })
    })
}

var filePaths = [];
function foo(pathname){
    console.log(pathname);
}
function readAllFilesSync(dir,foo) {
    fs.readdirSync(dir).forEach(function(file){
        var pathname = path.join(dir,file);
        if(fs.statSync(pathname).isDirectory()){
            readAllFilesSync(pathname,foo);
        }
        else {
            foo(pathname)
        } 
    })
}

function readAllFiles(dir,foo) {   
    fs.readdir(dir,function(err,files){
        files.forEach(function(file){
            var pathname = path.join(dir,file)
            fs.stat(pathname,(err,data)=>{
                if(err) console.log(err);
                if(data.isDirectory()) {
                    readAllFiles(pathname,foo);
                }
                else {
                    foo(pathname)
                }
            })           
            
        })
    })
}
readAllFiles(filePath,foo);
// copyFileAsync(filePath+'\\test2.js',filePath+'\\test1.js')