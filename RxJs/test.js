(function () {
    // $("body").on('click',"[btn-a]",function(){
    //     return Promise.resolve({data:123});
    // })
    var a = $("[btn-a]");
    var b = $("[btn-b]");
    test = Rx.Observable.fromEvent(a, "click");
    test.subscribe(e => console.log(e));
}())    
