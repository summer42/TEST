var promises = {
    asnyc0: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("A") }, 500)
    }),
    asnyc1: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("B") }, 300)
    }),
    asnyc2: new Promise((resolve, reject) => {
        setTimeout(() => { resolve("C") }, 800)
    })
}

let resultArr = [];

const render = (idx, data) => document.querySelector(`[data="${idx}"]`).innerHTML = data;

const resultHandler = (domIdx, data) => {
    resultArr[domIdx] = { data, seted: false };
    resultArr = Array.from(resultArr);
    resultArr.forEach((x, idx) => {
        if (idx == 0) {
            if (x && x.data) {
                render(idx, x.data);
                x.seted = true;
            }
            return
        }
        else if (resultArr[idx - 1] && resultArr[idx - 1].seted && x.data) {
            render(idx, x.data);
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