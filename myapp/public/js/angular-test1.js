angular.module('app', [])
    .controller('testController', function ($scope) {
        $scope.text = "text from angular";
        $scope.flag = false;
    })
    .directive('test', function () {
        return {
            template: `
        <div>{{param.text}}</div>
    `,
            priority: '9999',
            // require:['^ngIf'],
            link: function ($scope,element,attrs) {
                this.$onInit = function () {
                    // console.log(ngIf);
                    $scope.param = { text: 'component' }
                    console.log('from component')
                }
            }
        }
    })