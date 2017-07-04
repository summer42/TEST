angular.module('alert', ['ui.bootstrap'])
    .provider('alert', function () {
        var defaultOption = {
            // showTitle: true,
            title: '操作确认',
            type: 'confirm',//tip,operate,confirm
            theme: 'normal',//danger
            reverse: false,
            template: false,
            timer: false,
            oktext: '确定',
            canceltext: '取消',
            size: 'sm'
        };
        return {
            setDefaultOption: function (option) {
                defaultOption = angular.merge({}, defaultOption, option);
            },
            $get: function ($uibModal, $timeout) {
                return function (option) {
                    var option = option || null;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'confirm.html',
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