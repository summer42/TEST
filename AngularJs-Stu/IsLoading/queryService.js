
(function (angular) {
    angular.module('test', [])
        .service('queryService', function ($http, $q) {
            //todo inherit Query 
            // var PostQuery = function (url, param, fn) {
            //     this.isLoading = false;
            //     this.query = function () {
            //         this.isLoading = true;
            //         $http.post(url, param)
            //             .then(function (result) {
            //                 this.isLoading = false;
            //                 fn(result);
            //             })
            //     }
            // };
            var data = [
                {
                    name: 'a', age: '13', tele: '123'
                }, {
                    name: 'ab', age: '12', tele: '123'
                }, {
                    name: 'ac', age: '13', tele: '1543'
                }
            ]
            var PostQuery = function (url) {
                return function (fn, param, errFn) {
                    var callback = fn;
                    var _param = param;
                    var _this = this;
                    var defer = $q.defer();
                    _this.isLoading = false;
                    _this.query = function () {
                        _this.isLoading = true;
                        //reverse params fn                      
                        $q((resolve, reject) => {
                            setTimeout(function () { resolve(data) }, 1500)
                        }).then(function (result) {
                            _this.isLoading = false;
                            if (!callback || typeof callback != 'function') {
                                defer.resolve(result);
                            }
                            else if (fn && typeof fn == 'function') {
                                fn(result);
                            }
                        }).catch(err => {
                            if (typeof errFn == 'function') {
                                errFn(err)
                            }
                            else {
                                throw err;
                            }
                        })
                        return defer.promise;
                    }
                    return _this;
                }
            }
            this.PersenalSummary = PostQuery('/management/statistics/offline-line/logs');
            this.test2 = PostQuery('');
        })
        .controller('IsLoadingController', function ($timeout, $scope, queryService) {
            this.$onInit = function () {
                // $scope.users.query();
            }

            var test = queryService.PersenalSummary;
            var test2 = queryService.test2;
            // $scope.users = new test(function (data) {
            //     $scope.users.list = data;
            // });
            $scope.users = test();
            var promise2 = test2();

            $scope.users.query(123).then(function (data) {
                $scope.users.list = data;
            })

            // Promise.all([promise2.query(),$scope.users.query()])
            // .then(result=>{console.log(result)})


        })
        .directive('tableList', function () {
            return {
                restrict: 'A',
                transclude: true,
                link: function (scope, attrs, ele) {
                    // var tdCount = ele.$$element[0].querySelector('thead tr').childElementCount;
                },
                scope: {
                    tableObj: '='
                },
                template: ` 
                    <ng-transclude></ng-transclude ng-cloak>
                    <tr ng-if='tableObj.isLoading'>
                        <td colspan='99' style='text-align:center;'>正在加载</td>
                    </tr>
                     <tr ng-if='!tableObj.isLoading&&tableObj.list.length == 0' ng-cloak>
                        <td colspan='99' style='text-align:center;'>暂无数据</td>
                    </tr>                    
                `
            }
        })
}(angular))