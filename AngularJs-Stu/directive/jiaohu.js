var myModule = angular.module("MyModule", []); //ng-app="myModule"
myModule.directive("superman", function() {
    return {
        scope: {}, //空对象、独立作用域
        restrict: 'AE',
        controller: function($scope) {
            $scope.abilities = [];
            this.addstrength = function() {
                $scope.abilities.push("strength");
            };
            this.addSpeed = function() {
                $scope.abilities.push("speed");
            };
            this.addLight = function() {
                $scope.abilities.push("light");
            };
        },
        link: function(scope, element, attrs) {
            // element.addClass("btn");
            element.bind("click", function() { //绑定鼠标事件，打印abilities数组成员
                console.log(scope.abilities);
            });
        }

    }
});
myModule.directive("speed", function() {
    return {
        require: '^superman', //依赖于superman,这样在下面就可以注入supermanCtrl
        link: function(scope, element, attrs, superman) { //注入supermanCtrl后就可以用里面的方法
            //(等价于Superman+controller)
            superman.addSpeed();
        }
    }
});
myModule.directive("strength", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, superman) {
            superman.addstrength();
        }
    }
});
myModule.directive("light", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addLight();
        }
    }
});
myModule.directive('hello', function() {
    return {
        scope: {}, //指令之间建立互相独立的作用域
        restrict: 'AECM',
        template: '<input ng-model="words" type="text">', //
        replace: true
    }
});


myModule.directive('event', function() {
    return {
        restrict: 'AECM',
        // link:function(scope,element,attr){
        // 	element.bind("click",function(){
        // 		//全用小写
        // 		scope.$apply(attr.mousefoo)
        // 	})
        // }
        scope: {
            mouseFoo: '&'
        },
        template: '<button ng-click="mouseFoo()"></button>'
    }
});

myModule.directive('convey', function() {
    return {
        restrict: 'AECM',
        scope: {
            conveyNum: '@',
        },


        template: '<div>{{num}}</div>',
        replace: true
        // ,
        // transclude:true,
        // link:function(scope,element,attrs){
        // 	scope.num=attrs.num
        // }
    }
});

myModule.controller('MyCtrl1', ['$scope',
    function($scope) {
        $scope.foo1 = function() {
            console.log(111);
        }
    }
]);
myModule.controller('MyCtrl2', ['$scope',
    function($scope) {
        $scope.foo2 = function() {
            console.log(222);
        }
    }
]);
myModule.controller('Ctrl', ['$scope',
    function($scope) {
        $scope.num = '';
    }
]);