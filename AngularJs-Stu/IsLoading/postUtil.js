((angular) => {

    angular.module('people')
        /**
         * url:string 请求的地址
         * param:{} 请求需要的参数
         * fn:{} (可不传)请求状态isLoading会作为fn的属性被维护
         */
        .service('postUtil', function ($http, $q) {
            this.Post = function (url) {
                return function (param, fn) {
                    //此处严格模式会报错
                    var foo = fn || arguments.callee.caller || {};
                    var defer = $q.defer();
                    //为传入的方法维护加载状态
                    foo.isLoading = false;
                    return (function () {
                        foo.isLoading = true;
                        $http.post(url, param)
                            .then(function (data) {
                                foo.isLoading = false;
                                //解除无用的引用
                                foo = null;
                                //从响应对象中解构出data
                                const { result, error } = data;
                                if (error != null) {
                                    return defer.reject(error);
                                }
                                return defer.resolve(result);
                            })
                        return defer.promise;
                    }());
                }
            };

        })
})(angular);
