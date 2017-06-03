var getHashParam = (function (name) {
    let hash = decodeURI(window.location.hash);
    let paramArr = hash.split('&');
    return function (name) {
        let tempStr = "";
        let tempStr1 = "";
        if (paramArr[0].indexOf('?') > -1) {
            tempStr1 = paramArr[0].substring(paramArr[0].lastIndexOf('?') + 1);
        }
        tempStr = paramArr.find(x => x.indexOf(name + '=') > -1);

        if (tempStr1 && tempStr1.indexOf(name) > -1 && tempStr1.substring(name.length + 1)) {
            return tempStr1.substring(name.length + 1);
        }
        else if (tempStr && tempStr.indexOf(name) > -1 && tempStr.substring(name.length + 1)) {
            return tempStr.substring(name.length + 1);
        }
        else {
            return '';
        }
    }
}());