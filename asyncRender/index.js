var promises = {
    asnyc1: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("A") }, 500)
    }),
    asnyc2: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("B") }, 300)
    }),
    asnyc3: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("C") }, 800)
    }),
}

let resultArr = [];

const render = (idx, data) => document.querySelector(`[data="${idx}"]`).innerHTML = data;

const resultHandler = (val, data) => {
    resultArr[val] = data;
    resultArr.forEach((x, idx) => {
        if (idx == 1) {
            render(val, data);
            x.seted = true;
            return
        }
        else if (x[idx - 1] && x[idx - 1].seted) {
            render(val, data);
            x.seted = true;
            return
        }
        else {
            return
        }
    })
};

document.querySelectorAll("[data-container] li").forEach(ele => {
    let name = "asnyc" + ele.attributes[0].value;
    promises[name].then(resultHandler.bind(this, ele.attributes[0].value));
});