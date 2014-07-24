!function(){var app=angular.module("flaneur",["ngSanitize","ngTouch","templates"]);app.factory("Hub",function($timeout){var started=!1,Hub=function(){};Hub.prototype={subscribers:{},subscribe:function(channel,callback){this.subscribers[channel]||(this.subscribers[channel]=[]),this.subscribers[channel].push(callback)},publish:function(channel,data){this.subscribers[channel]&&this.subscribers[channel].forEach(function(callback){callback(data)})},bind:function(channel,scope){this.subscribe(channel,function(data){$timeout(function(){for(var n in data)scope[n]=data[n]})}),!started&&INITIAL_CHANNEL_DATA&&INITIAL_CHANNEL_DATA[channel]&&hub.publish(channel,INITIAL_CHANNEL_DATA[channel])}};var hub=new Hub,eventSource=new EventSource("/subscribe");return eventSource.onmessage=function(msg){started=!0;var data=JSON.parse(msg.data);data&&data.channel&&data.data&&hub.publish(data.channel,data.data)},hub}),window.Flaneur=function(name,create_fn){var getDashedName=function(name){return-1<name.indexOf("-")?name:name.replace(/([a-z])([A-Z])/,"$1 $2").split(" ").map(function(n){return n.toLowerCase()}).join("-")},getCamelCaseName=function(name){return name.indexOf("-")<0?name:name.split("-").map(function(n,i){return 0==i?n:n.charAt(0).toUpperCase()+n.substr(1)}).join("")},dashedName=getDashedName(name),camelName=getCamelCaseName(name);app.directive(camelName,function($injector,Hub){var options=create_fn?$injector.invoke(create_fn):{};return{restrict:"E",scope:{channel:"@"},templateUrl:options.templateUrl?options.templateUrl:"app/widgets/"+dashedName+"/"+dashedName+".html",link:function($scope,$element,$attrs,$transclude){$scope.channel&&Hub.bind($scope.channel,$scope),options.link&&options.link($scope,$element,$attrs,$transclude)}}})},app.run(function(){qbert(".widgets",{target_pixel_size:218})})}(),angular.module("flaneur").filter("zeroPadding",function(){return function(value,size){var valueStr=value+"";if(valueStr.length<size)for(var diff=size-valueStr.length,i=0;diff>i;i++)valueStr="0"+valueStr;return valueStr}}),angular.module("flaneur").directive("flaneurPagesControl",function($timeout){return{restrict:"E",templateUrl:"app/paging/pages-control.html",scope:{items:"=",perPage:"@",page:"="},link:function($scope,$element){var updatePages=function(){for(var numPages=$scope.items?Math.ceil($scope.items.length/$scope.perPage):0,pages=[],i=0;numPages>i;i++)pages.push(i);$scope.pages=pages};updatePages(),$scope.$watch("items",updatePages),$scope.$watch("perPage",updatePages),$element.on("click",function(){$timeout(function(){$scope.page==$scope.pages.length-1?$scope.page=0:$scope.page+=1})})}}}).directive("flaneurPages",function($swipe,$timeout,$interval){return{restrict:"E",scope:{items:"=",perPage:"@",page:"=",rotateEvery:"@"},transclude:!0,link:function($scope,$element,$attrs,$controller,$transclude){var groups=[];$scope.$watchCollection("items",function(items){if(items||(items=[]),groups.length>0)for(var i=0;i<groups.length;i++){for(var group=blocks[i],j=0;j<group.children.length;j++)group.children[j].$scope.$destroy();group.element.remove()}groups.length=0;for(var currentGroup=[],i=0;i<items.length;i++)currentGroup.length==$scope.perPage?(groups.push({items:currentGroup}),currentGroup=[items[i]]):currentGroup.push(items[i]);currentGroup.length>0&&groups.push({items:currentGroup});for(var i=0;i<groups.length;i++){var childScope=$scope.$new(),group=groups[i];group.element=angular.element("<div></div>"),group.children=[],group.element.addClass("page"),$element.append(group.element),childScope.items=group.items,childScope.$itemOffset=i*$scope.perPage,$transclude(childScope,function(clone){group.element.append(clone),group.children.push({element:clone,scope:childScope})})}}),$scope.$watch("page",function(page){groups&&groups[0]&&groups[0].element.animate({marginLeft:-$element.width()*page},150)});var rotateInterval=1e3*parseFloat($attrs.rotateEvery),rotatePromise=null,shouldRotate=$attrs.rotateEvery&&!0;rotate=function(){shouldRotate&&(rotatePromise=$interval(function(){$scope.page==groups.length-1?$scope.page=0:$scope.page+=1},rotateInterval))},stopRotating=function(){$interval.cancel(rotatePromise)},rotate();var pagingController={startPos:null,offset:0,setOffset:function(x){this.offset=x,groups[0].element.css("margin-left",-1*$scope.page*$element.width()+x)},snap:function(){var pageWidth=$element.width(),absOffset=Math.abs(this.offset);absOffset>pageWidth/2?this.updatePage():this.snapToCurrent()},snapToCurrent:function(){groups[0].element.animate({"margin-left":-1*$scope.page*$element.width()},150)},updatePage:function(){this.offset<0?$scope.page<groups.length-1?$timeout(function(){$scope.page+=1}):this.snapToCurrent():$scope.page>0?$timeout(function(){$scope.page-=1}):this.snapToCurrent()},start:function(pos){stopRotating(),this.startPos=pos},cancel:function(){this.snap(),rotate()},move:function(pos){this.setOffset(pos.x-this.startPos.x)},end:function(){0!=this.offset&&(this.updatePage(),rotate())}};$swipe.bind($element,pagingController)}}}),Flaneur("cooper-current-projects",function(){return{link:function($scope){$scope.page=0}}}),Flaneur("cooper-journal-posts"),angular.module("flaneur").filter("cooperJournalPostAuthors",function(){return function(value){if(1==value.length)return value[0].display_name;var last=value[value.length-1];return value.slice(0,-1).map(function(v){return v.display_name}).join(", ")+" and "+last.display_name}}).filter("cooperJournalPostDate",function($filter){return function(value){var date=new Date(1e3*value);return $filter("date")(date,"short")}}),Flaneur("flaneur-clock",function($interval){return{link:function(scope){scope.date=new Date,$interval(function(){scope.date=new Date},.7)}}}),angular.module("flaneur").filter("flaneurClockTime",function(){return function(date){return date.toLocaleTimeString()+" "+date.toLocaleDateString()}}),Flaneur("flaneur-counter"),Flaneur("flaneur-link"),Flaneur("flaneur-list"),Flaneur("flaneur-tweets"),angular.module("flaneur").filter("twitterDate",function($filter){return function(value){var date=new Date(Date.parse(value));return $filter("date")(date,"short")}}),Flaneur("flaneur-twitter-users",function(){return{link:function($scope){$scope.page=0}}});