function Lazyman(name) {
    var _this = this;
    _this.arr = [];    
    _this.realObj = {
        hello: name => {
            console.log('Hi this is ' + name + "!");
        },
        sleep: seconds => {
            var now = new Date();
            var later = now.getTime() + seconds * 1000;
            while (1) {
                var currentTime = new Date();
                if (currentTime.getTime() > later) {
                    console.log('Wake up after ' + seconds + 's');
                    break;
                }
            }
        },
        eat: food => { console.log('Eat ' + food + '~') },
        sleepFirst: seconds => {
            _this.realObj.sleep(seconds);
        }
    };
    _this.watchArr = function () {
        setTimeout(() => {
            _this.arr.forEach(item => { _this.realObj[item.todo](item.val) });
            return;
        }, 0)
    };
    _this.hello(name);
    _this.watchArr();


}
Lazyman.prototype = {
    hello: function (name) {
        this.arr.push({ todo: 'hello', val: name });
        this.endFlag = true;
        return this;
    },
    sleep: function (seconds) {
        this.arr.push({ todo: 'sleep', val: seconds });
        return this;
    },
    eat: function (food) {
        this.arr.push({ todo: 'eat', val: food });
        return this;
    },
    sleepFirst: function (seconds) {
        this.arr.unshift({ todo: 'sleepFirst', val: seconds });
        return this;
    }
};

var lazyman = function () { return new Lazyman('Tom') };