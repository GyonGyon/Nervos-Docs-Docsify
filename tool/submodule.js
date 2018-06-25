#!/bin/env/node
var fs = require('fs')
var path = require('fs')
var log = console.log

var mergePath = function(filep, dirp) {
    var p = filep
    if (dirp !== undefined) {
        p = dirp + '/' + p
    }
    return p
}

var removeFiles = function(paths, dirp) {
    paths.forEach(function(p, i) {
        p = mergePath(p, dirp)
        if (!fs.existsSync(p)) {
            return
        }
        var stat = fs.statSync(p)
        if (stat.isDirectory()) {
            fpaths = fs.readdirSync(p)
            removeFiles(fpaths, p)
            fs.rmdirSync(p)
        } else {
            fs.unlinkSync(p)
        }
    })
}

var removeOld = function(paths) {
    removeFiles(paths)
}

var makeDirByFilePath = function(filePath) {
    var names = filePath.split(path.sep)
    names.pop()
    var pathtmp = ''
    if (names[0] === '.') {
        names.shift()
        pathtmp = './'
    }
    names.forEach(function(dir) {
        pathtmp = path.join(pathtmp, dir)
        if (!fs.existsSync(pathtmp)) {
            fs.mkdirSync(pathtmp)
        }
    })
}

var copyFile = function(oldp, newp) {
    makeDirByFilePath(newp)
    var file = fs.readFileSync(oldp)
    fs.writeFileSync(newp, file)
}

var copyFiles = function(paths, olddirp, newdirp) {
    paths.forEach(function(p, i) {
        var oldp = mergePath(p, olddirp)
        var newp = mergePath(p, newdirp)
        if (!fs.existsSync(oldp)) {
            return
        }
        var stat = fs.statSync(oldp)
        if (stat.isDirectory()) {
            fs.mkdirSync(newp)
            fpaths = fs.readdirSync(oldp)
            copyFiles(fpaths, oldp, newp)
        } else {
            copyFile(oldp, newp)
        }
    })
}

var main = function() {
    var submoduleFiles = ['.nojekyll', 'index.html', 'script']
    removeFiles(submoduleFiles)
    copyFiles(submoduleFiles, './Nervos-Docs-Docsify')
}

main()
