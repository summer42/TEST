function foo(father,child){
    father[child]
}

function copyObj(obj) {
    var newObj;
    for(var i in obj) {
        if(typeof i == "object") {
            copyObj(obj[i]);
        }
        else {
            
        }
    }
}