angular.module("myapp",[])
.directive('order',function(){
	return {
        restrict: 'E',
        templateUrl:`
            <div class="">
                <button ng-click=''>id降序</button>
                <button ng-click=''>age降序</button>
            </div>
        `,
        controller:($scope)=>{
            $scope.order = () => {
                
            }
        }
    }
})
.controller('OrderController',function(){
    this.items = [
        {
           id:1,
           name:'a',
           age:25 
        },
        {
           id:2,
           name:'a',
           age:24 
        },
        {
           id:3,
           name:'a',
           age:23 
        },
        {
           id:4,
           name:'a',
           age:22 
        },
        {
           id:5,
           name:'a',
           age:21 
        },
        {
           id:6,
           name:'a',
           age:20 
        }
    ]
})