
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
                return function (fn, param) {
                    var defer = $q.defer();
                    var _this = this;
                    _this.isLoading = false;
                    _this.query = function () {
                        _this.isLoading = true;
                        // $http.post(url, param)
                        $q((resolve, reject) => {
                            setTimeout(function () { resolve([]) }, 1500)
                        }).then(function (result) {
                            _this.isLoading = false;
                            fn(result);
                        })
                    }
                }
            }
            this.PersenalSummary = PostQuery('/management/statistics/offline-line/logs');
        })
        .controller('IsLoadingController', function ($timeout, $scope, queryService) {
            var test = queryService.PersenalSummary;
            $scope.users = new test(function (data) {
                $scope.users.list = data;
            });
            this.$onInit = function () {
                $scope.users.query();
            }
        })
        .directive('tableList', function () {
            return {
                restrict: 'A',
                transclude: true,
                link: function (scope, attrs, ele) {
                    var tdCount = ele.$$element[0].querySelector('thead tr').childElementCount;
                },
                scope: {
                    tableObj: '='
                },
                template: `                    
                    <ng-transclude></ng-transclude ng-cloak>
                    <tr ng-if='tableObj.isLoading'>
                        <td colspan='tdCount' style='text-align:center;'>正在加载</td>
                    </tr>
                     <tr ng-if='!tableObj.isLoading&&tableObj.list.length == 0' ng-cloak>
                        <td colspan='tdCount' style='text-align:center;'>暂无数据</td>
                    </tr>
                `
            }
        })
}(angular))