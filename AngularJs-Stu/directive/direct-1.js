myModule.controller('MyCtrl',['$scope',function($scope){
		$scope.loadData=function(){
				console.log("加载中。。。");
		}
}])


myModule.controller('MyCtrl2',['$scope',function($scope){
		$scope.loadData=function(){
				console.log("加载中2333333。。。");
		}
}])


myModule.directive("loader",function(){
		return {
			restrict:"AE",
			link:function(scope,element,attr){
				element.bind("mouseenter",function(){
					// scope.loadData();
					scope.$apply("loadData()");//一样调用
				})
			}
		}
})




myModule.directive("loader",function(){
		return {
			restrict:"AE",
			link:function(scope,element,attr){
				element.bind("mouseenter",function(){
					// scope.loadData();
					// scope.$apply("loadData()");//一样调用
					
					scope.$apply(attr.howtoload());//此处需小写
					//directive和自定属性howtoload绑定
				})
			}
		}
})