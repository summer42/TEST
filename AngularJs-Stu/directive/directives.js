
	var myModule=angular.module("app1",[]);
	//directive
	myModule.directive('poptop',function(){
		return {
			restrict:'AE',
			scope:{
				subtitle:'=',
				foo1:'&'
			},
			replace : true,
	        transclude : true,			
			template:'<div class="popwrapper">'
					+'<div ng-if=out class="popbox">'//此处若用ng-if 会形成子作用域可用$parent绑定到父级
					// +'<span>{{subtitle}}</span>'
					+'<span ng-transclude></span><input type="text" ng-model="$parent.subtitle"></div>'
					+'<button ng-click="toggle();foo1({con:subtitle})">popover</button>'
					+'</div>',
			link:function(scope,element){
				scope.out=false;
				scope.toggle=function toggle(){
					scope.out=!scope.out;
				}
			}
		}
	}).directive('draggable', function($document) {
	    var startX=100, startY=100, x = 0, y = 0;
	    return {
			link:function(scope, element, attr) {
				element.css({
					position: 'relative',
					border: '1px solid red',
					backgroundColor: 'lightgrey',
					cursor: 'pointer'
				});
				element.bind('mousedown', function(event) {
					startX = event.screenX - x;
					startY = event.screenY - y;
					$document.bind('mousemove', mousemove);
					$document.bind('mouseup', mouseup);
				});

				function mousemove(event) {
					y = event.screenY - startY;
					x = event.screenX - startX;
					element.css({
					top: y + 'px',
					left:  x + 'px'
					});
				}

				function mouseup() {
					$document.unbind('mousemove', mousemove);
					$document.unbind('mouseup', mouseup);
				}
			}
		} 
 	}).directive('pagination',function($sce,$timeout){
		return {
			restrict:'E',			
	        transclude : true,
	        replace : true,
			require:'?ngModel',
	        scope:{				
	        	pagenum:"@",
				pageSize:'='
	        },
	        template:`
			<div>
				<button class="pagefloat" ng-click="prev()" ng-disabled="pagenumcur==1">上一页</button>				   
					<ul class="pagefloat">
						<li ng-repeat="page in pages" ng-class="{active:page==pagenumcur}" ng-click="setpagecur(page)">{{page}}</li>
					</ul>
					<select ng-model="pageSize">
						<option ng-repeat='item in [10,20,30,50]' value='{{item}}' ng-selected='pageSize == item'>
						{{item}}
						</option>						
					</select>
					{{pageSize}}
				<button class="pagefloat" ng-click="next()" ng-disabled="pagenumcur==pagenum">下一页</button>
			</div>`,
	        link:function(scope,element,attrs,ngModel){
	        	scope.pagenumcur=ngModel.$viewValue||0;	

				/** 
				 * formatters和parsers每一项的执行结果会返回给下一项
				 * */		

				//从DOM中获取绑定在ng-model的值(modelValue)时触发
				ngModel.$formatters.push((modelValue)=>{
					return modelValue + 1;//返回值是viewValue
				});
				//将formatter处理后的值放到scope中
				ngModel.$render = function() {
					scope.pagenumcur = ngModel.$viewValue;					
				};
				//检测值改变时赋给viewValue	
				scope.$watch('pagenumcur',(newval,oldval)=>{
					//pristine是否未进行操作(viewValue的改变)、 dirty是否已进行操作
					console.log('dirty:'+ngModel.$dirty,'---','pristine:'+ngModel.$pristine,'modelValue:'+ngModel.$modelValue);
					if(!isNaN(oldval)){	
						//将viewValue暂存(相当于git暂存)，以便触发viewValue->modelValue的处理	
						//或者用apply手动触发digest				
						$timeout(function(){
							ngModel.$setViewValue(scope.pagenumcur);
						})
					}
				},true);
				//在$setViewValue后触发 用于更新到modelValue时执行
				// ngModel.$parsers.push((viewValue)=>{
				// 	return viewValue + 1;	//返回值是modelValue,既外部ng-model绑定的值				
				// });
				//在viewValue发生改变时触发				
	        	ngModel.$viewChangeListeners.push(function(){
					console.log('viewValue:'+ngModel.$viewValue);
				});


	        	scope.pages=[];
	        	scope.prev=function(){
	        		scope.pagenumcur--;
	        	};
	        	scope.next=function(){
	        		scope.pagenumcur++;
	        	}
	        	scope.setpagecur=function(page){
	        		scope.pagenumcur=page;
	        	}
	        	if(scope.pagenum){
	        		for(var i=1;i<=scope.pagenum;i++)
	        		scope.pages.push(i);
	        	}				
	        }
		}
	}).directive('modal',function(){
		return {
			restrict:'AE',			
	        transclude : true,
	        replace : true,
	        scope: {
			  title: '=',  
			  onok: '&', 
			  oncancel: '&',
			  show: '='
			},
	        template:'<div ng-show="show"><h3>{{title}}</h3><div class="body" ng-transclude></div><div class="footer"><button ng-click="onok()">Save changes</button><button ng-click="oncancel()">Close</button></div></div>',
		}
	}).directive('clickClass',function(){
		return {
			restrict:'A',
			scope:{
				toggleClass:'@'
			},
			link:(scope,element) => {
				
			}
		}
	}).directive('myDialog', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			template: '<div class="alert" ng-transclude></div>',
			link: function(scope) {
				scope.name = 'InnerName';
			}
		};
	}).directive('tabs', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			template: `
				<div class="">
					<ul>
						<li ng-repeat='pane in panes'>
							<a ng-click='select(pane)'>{{pane.title}}</a>		
						</li>						
					</ul>
					<div class="tab-content" ng-transclude></div>
				</div>
			`,
			controller:['$scope', function MyTabsController($scope) {
				var panes = $scope.panes = [];
				$scope.select = (panes) => {
					angular.forEach(panes,(pane)=>{
						pane.selected = false;
					});
					pane.selected = true;
				};
				this.addPane = function(pane) {
					if (panes.length === 0) {
					$scope.select(pane);
					}
					panes.push(pane);
				};
				}]
		};
	}).directive('isLoading',function(){
		return {
			restrict:'A',
			transclude:true,
			// scope:{},
			template:`
			<tr ng-if='list.length == 0||!list'>
				<td colspan='3'>正在加载</td>
			</tr>
			<ng-transclude></ng-transclude>
			`
		}
	}).directive('multiSelect',() => ({
		controller:MultiSelectController,
		restrict:'EA',
		transclude:true,
		scope:{}


	}))
	// .directive('tabPane', function() {
	// 	return {
	// 		require: '^^tabs',
	// 		restrict: 'E',
	// 		transclude: true,
	// 		scope: {
	// 			title: '@'
	// 		},
	// 		link: function(scope, element, attrs, tabsCtrl) {
	// 		tabsCtrl.addPane(scope);
	// 		},
	// 		template: `
	// 			<div class="" ng-show="selected">
	// 			<h4>{{title}}</h4>
	// 			<div ng-transclude></div>
	// 			</div>`
	// 	};
	// })
	//controller
	myModule.controller('popCtrl',['$scope','$timeout',function($scope,$timeout){
		this.$onInit = function(){
			$timeout(()=>{
				$scope.list = [{a:1,b:2,c:3},{a:1,b:2,c:3}];
			},1000);
			$scope.testList = [{a:1},{a:2},{a:3},{a:4}];
			$scope.title='';
			$scope.text="正文";
			$scope.subtitle='副标题';
			$scope.name = 'OutterName'
			$scope.user={
				name:"a",
				age:1
			}
			$scope.test2={
				asd:123
			}
			$scope.newObj={};
		}
		
		$scope.newObj=angular.extend({},$scope.user,$scope.test2);
		console.log($scope.newObj,$scope.user);
		$scope.pagemax=7;
		$scope.page = {
			pageNo:1,
			pageSize:20
		};		
		$scope.showModal=false;
		$scope.print=function(con){
			if(con){
				console.log(con);
			}
			else {
				console.log('----')
			}
		};
		$scope.confirm=function(){
			$scope.showModal=false;
			console.log("保存");
		};
		$scope.cancel=function(){
			$scope.showModal=false;
		};
	}])


