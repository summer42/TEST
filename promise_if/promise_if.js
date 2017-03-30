
function getNum() {
    return Math.round(Math.random() * 10);
}

function getPro(data) {
    var data = data || null;
    return Promise.resolve(getNum() + data);
}

var handlePro = function (arr) {
    //arr = [{pro:promise,exp:expression}]
    // if(exp) return pro;
    // else return Promise.resolve();   
    var promises = [];
    arr.forEach(function (x) {
        if (x.exp) {
            promises.push(x.pro)
        }
        else {
            promises.push(Promise.resolve());
        }
    })
    return Promise.all(promises);
}
$("body").on('click', "[data-start]", () => {
    var promise1 = getPro();
    promise1.then((data) => {
        if (!(data % 2)) {
            console.log('even');
        }
        else {
            var arr = [
                {
                    pro: getPro('奇数'),
                    exp: 1
                },
                {
                    pro: getPro('被3整除'),
                    exp: !(data % 3)
                }
            ]
            return handlePro(arr)
        }
    }).then(data => {
        console.log(data);
    })
})




