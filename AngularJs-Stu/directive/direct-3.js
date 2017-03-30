var myModule=angualr.Module("MyModule",{});
myModule.directive("hello",function(){
	return{
			restrict:'AE',
			scope:{},//给每个符合限制的元素加上独立作用域
			template：'<div><input type="text" ng-model="userName"/>{{userName}}</div>',
			replace:true
	}
});
myModule.directive("drink",function(){
	return{
		restrict:'AE',
		template："<div>{{flavor}}</div>",
		link:function(scpoe,element,attrs){
			scope.flavor=attrs.flavor;
		}
	}
})
myModule.directive("drink",function(){
	return{
		restrict:'AE',
		scope:{
			flavor:'@'//传递字符串
		}
		template："<div>{{flavor}}</div>",
	}
})
myModule.directive("drink",function(){
	return{
		restrict:'AE',
		scope:{
			flavor:'='//
		}
		template：'<input type="text" ng-model="flavor">{{flavor}}</input>',
	}
})

