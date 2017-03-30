angular.module('alert', ['ui.bootstrap'])
    .provider('alert', function () {
        var defaultOption = {
            // showTitle: false,
            type: 'confirm',//tip,operate,confirm
            theme: 'normal',//danger
            reverse: false,
            template: false,
            timer: false,
            oktext: '确定',
            canceltext: '取消',
            size: 'sm',
        };
        return {
            setDefaultOption: function (option) {
                defaultOption = angular.merge({}, defaultOption, option);
            },
            $get: function ($uibModal, $timeout) {
                return function (option) {
                    var option = option || null;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'alert.html',
                        animation: true,
                        controller: function ($scope) {
                            $scope.option = angular.merge({}, defaultOption, option);
                            if ($scope.option.timer) {
                                $timeout(function () {
                                    $scope.$close();
                                }, $scope.option.timer)
                            }
                        },
                        resolve: {

                        }
                    });
                    return modalInstance.result
                }

            }
        }
    })
    .config(function (alertProvider) {
        alertProvider.setDefaultOption({

        })
    })
    .controller('AlertController', [
        '$scope',
        '$uibModal',
        'alert',
        '$timeout',
        function ($scope, $uibModal, alert, $timeout) {
            $scope.modal_option = {
                // title: 'AAA',
                content: 'test',
                fail: function () { console.log('failed') },
                template: 'test.html'
            };
            $scope.alert = alert;
            $scope.delete = function () {
                return alert({
                    type: 'operate',
                    theme: 'danger'
                }).then(data => {
                    console.log(123)
                }, reject => {
                    console.log('local_failed')
                });
            };

            

        }
    ])