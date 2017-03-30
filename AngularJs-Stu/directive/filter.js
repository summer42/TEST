var myModule=angular.module("MyModule",[]);
myModule.filter('filter1',function(){
	return function(item){
		return item + '^_^我是后缀';//字符自动加上后缀
	}
})