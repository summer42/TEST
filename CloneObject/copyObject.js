var copy = obj => {
    var newObj = {};
    for (var i in obj) {
        if (typeof obj[i] == "object") {
            newObj[i] = copy(obj[i]);
        }
        else {
            if (typeof obj[i] == "string" || typeof obj[i] == "number") {
                newObj[i] = obj[i];
            }
            if (typeof obj[i] == "function") {
                newObj[i] = (obj[i]);
            }
        }
    }
    return newObj
}