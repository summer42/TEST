
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
                            setTimeout(function () { resolve(data) }, 1500)
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
                $scope.userList = data;
                console.log(this)
            });
            this.$onInit = function () {
                $timeout(() => {
                    $scope.users.query();
                }, 600)

            }
        })
        .directive('tableList', function () {
            return {
                restrict: 'A',
                link: function (scope, attrs, ele) {

                }
            }
        })
}(angular))