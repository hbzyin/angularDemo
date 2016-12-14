var local=true;//模拟数据库数据开关，true->加载本地json数据  false->从服务器端获取数据
var app=angular.module('fanlaile',['ng']);
app.controller('parentCtr',function($scope){
  //1.自定义ng 函数
        $scope.jump = function(path){
            console.log(path);
            $.mobile.changePage(path,{'transition':'slide'});
        }
        //重新编译连接，然后进入循环，从而使动态添加了元素生效
        $(document).on('pagecreate', function (event) {
            console.log('page is creating....');
            //获取要加载到的容器
            var page = event.target;
            //获取作用域对象
            var scope = $(page).scope();
            //获取注入器对象
            var injector = $(page).injector();
            //调用注入器，为程序提供$compile服务
            injector.invoke(function($compile){
                //编译并链接DOM节点
                $compile(page)(scope);
                scope.$digest();
            });
        })
    })
  .controller('startCtr',function($scope){
    //$scope.imgSrc="img/kid-foods.jpg";
    $scope.imgSrc="img/sample.jpg";
    $scope.tips="轻轻一点，美食即来!";
    })
  .controller('mainCtr',function($scope,$http){
    var url={
      first:local?"../data_json/dish_getbypage.json"
           : "../data/dish_getbypage.php?start=0",
      more :local?"../data_json/dish_getbypage1.json"
           :"../data/dish_getbypage.php?start="+ $scope.dishList.length
    };
    $scope.hasMore = true;  //是否还有更多数据可供加载
    $scope.dishList = [];  //用于保存所有菜品数据的数组
    //控制器初始化/页面加载时，从服务器读取最前面的5条记录
    $http.get(url.first).success(function(data){
      $scope.dishList = data;
    });
    //“加载更多”按钮的单击事件处理函数：每点击一次，加载更多的5条数据
    $scope.loadMore = function(){
      $http.get(url.more).success(
        function(data){
          if(data.length<5){  //服务器返回的菜品数量不足5条
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
        });
    }
    //监视搜索框中的内容是否改变——监视 kw Model变量
    $scope.$watch('kw', function(){
      if( $scope.kw ){
        if(local){
          $scope.dishList.forEach(function(data){
            var res=data.name.indexOf($scope.kw);
            if(!res){
              $scope.dishList=[
                {"did":"1",
                  "name":"【"+$scope.kw+"】",
                  "price":36,
                  "img_sm":"p0281.jpg",
                  "material":"明虾、番茄酱、白糖、白醋、葱、姜、淀粉"
                }
              ];
              return true;
            }
          });
          return false;
        }else{$http.get('../data/dish_getbykw.php?kw='+$scope.kw).
          success(function(data){
            $scope.dishList = data;
          })}

      }
    })
    // 是用来将选中的id传递给detail页面（localStorage）
    $scope.showDetail = function (dishId) {
      localStorage.id = dishId-1;
      $.mobile.changePage('detail.html');
    }
    })
  .controller('detailCtr',function($scope,$http){
    //读取路由URL中的参数
    var id = localStorage.id;
    var url=local?"../data_json/dish_getbyid.json"
      : "../data/dish_getbyid.php?id="+id;
    //console.log('在详情页面拿到的id参数为：'+id);
    $http.get(url).success(
      function(data){
        $scope.dish = data[id];
      })
    })
  .controller('orderCtr',function($scope,$http,$rootScope){
    var url=local?"../data_json/order_add.php"
                 : "../data/order_add.php?";
        //定义order对象，用于保存order数据
        //$scope.order = {"did":$routParams.dishid};`
        $scope.order = {"did":$rootScope.dishid};
        $scope.submitOrder = function(){
          $scope.succMsg = '订餐成功！您的订单编号为：5。您可以在用户中心查看订单状态。';
          $scope.errMsg = '订餐失败！错误码为：404';
            //console.log($scope.order);
            var str = jQuery.param($scope.order);
            $http.get(url+str).
                success(function(data){
                    //console.log(data[0].msg);
                    if(data[0].msg == 'succ'){
                        $scope.succMsg = '订餐成功！您的订单编号为：'+data[0].did+'。您可以在用户中心查看订单状态。'
                        //记载用户手机号，用于查询订单
                        $rootScope.phone = $scope.order.phone;
                    }else {
                        $scope.errMsg = '订餐失败！错误码为：'+data[0].reason;
                    }
                    //console.log($scope.succMsg);
                    //console.log($scope.errMsg);
                })
        }
    })
  .controller('myorderCtr',function($scope,$http,$rootScope){
        //console.log($rootScope.phone);
        $http.get('data/order_getbyphone.php?phone='+$rootScope.phone).
            success(function(data){
                 $scope.orderList = data;
                console.log(data);
        });

    });

