// (function () {
// $("body").on('click',"[btn-a]",function(){
//     return Promise.resolve({data:123});
// })
var $input = $("[data]");
var btns = $(".btn-wrapper>button");
var a = $("[btn-a]");
var b = $("[btn-b]");
// clickA = Rx.Observable.fromEvent(a, "click");
// clickB = Rx.Observable.fromEvent(b, "click");
// clickA.subscribe(e => $("[data]").val(111));
// clickB.subscribe(e => $("[data]").val(222));
var A = () => new Promise((resolve, reject) => {
    setTimeout(function () { resolve("AAA") }, 800)
});

var B = () => new Promise((resolve, reject) => {
    setTimeout(function () { resolve("BBB") }, 400)
});


var btnClick = Rx.Observable.fromEvent(btns, "click");

btnClick
    // .filter(x=>x.timeSamptle)
    .map(x => x.target.innerText)
    .subscribe(x => console.log(x))
// .switchMap(x => {
//     if (x.target.innerText == "A") {
//         return Rx.Observable.fromPromise(A())
//     }
//     return Rx.Observable.fromPromise(B())
// })    
// .subscribe(x => $input.val(x))


var observer = Rx.Observable.create(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
});

observer.map(x => console.log(x));
// }())    
