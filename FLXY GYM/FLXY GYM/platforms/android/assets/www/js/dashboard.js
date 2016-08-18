app.controller('dashboardCtrl', function($cordovaGeolocation, $scope, $q, $state,$ionicPopup, $ionicSideMenuDelegate, $ionicLoading,$cordovaSQLite, dataService, $rootScope) {
    //$scope.$on('$ionicView.enter', function () {
    setTimeout(function () {
            if (navigator.connection.type == Connection.NONE) {
                var alertPopup = $ionicPopup.alert({
                    title: ' No internet connection',
                    template: '<div style="text-align:center; font-size:22px">No internet connectivity detected. Please reconnect and try again.</div>'
                });
                alertPopup.then(function (res) {
                });
            }
    },2000)
 $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
 };
 $rootScope.categoryLoad = function () {
     loadAllGymData();
     dataService.getCategory().then(function (result) {
         console.log(result.data.response);
         window.localStorage.setItem("Category", JSON.stringify(result.data.response));
         $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
       //  $scope.dashList = result.data.response;
     },function(err){
         $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
     });
     $scope.LoginData = JSON.parse(window.localStorage.getItem("LoginData"));
     var getProfileModel = {
         "mobile": $scope.LoginData.mobile
     }

     dataService.getProfile(getProfileModel).then(function (result) {
         window.localStorage.setItem("UserProfile", JSON.stringify(result.data.response));
        
         //  $scope.dashList = result.data.response;
     }, function (err) {
         $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
     });
 }
 $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
//dataService.getGymMemberDetails().then(function (result) {
// console.log(result);
//});
 function loadAllGymData() {
     dataService.getAllGymCenter().then(function (result) {
         if (result.data.message == "details found!") {
             $ionicLoading.show({
                 noBackdrop: false,
                 template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Plase wait...</p>'
             });
             console.log(result)
             $scope.gymCenterData = JSON.parse(JSON.stringify(result.data.response));
             if ($scope.gymCenterData == null) { $scope.gymCenterDatalength = 0; }
             else { $scope.gymCenterDatalength = $scope.gymCenterData.length; }
             var promiseReadDataSync = deleteGymCenter();
             promiseReadDataSync.then(function () {
                 var promiseDelete = insertGymCenter();
                 promiseDelete.then(function () {
                     var listViewQuery = "select * from gymCenter";
                     $cordovaSQLite.execute(db, listViewQuery, []).then(function (result) {
                         if (result.rows.length > 0) {
                             setTimeout(function () {
                                 $ionicLoading.hide();
                             }, 2000)
                         }
                     }, function (err) {
                     });
                 })
             })
         }
         else {
         }
     });
 }


//	$scope.dashList = [
//	{
//"cat_id":"1",
//"cat_name":"CARDIO",
//"image_path":"http://greatist.com/sites/default/files/styles/big_share/public/Tag_Cardio.png?itok=KuJ2JPk4",
//	},
//	{
//"cat_id":"2",
//"cat_name":"DANCE",
//"image_path":"http://www.dancesofindia.co.in/images/Why-is-dance-better-than-traditional-workouts-Blogs-Way-of-Life-Studio-Mumbai.jpg",
//	},
//	{
//"cat_id":"3",
//"cat_name":"SPIN",
//"image_path":"http://mycoachkat.com/wp-content/uploads/2016/04/CardioTextimg1.jpg",
//	},
//	{
//"cat_id":"4",
//"cat_name":"SWIM",
//"image_path":"http://www.baronnews.com/wp-content/uploads/2012/04/swim.jpg",
//	},
//	{
//"cat_id":"5",
//"cat_name":"SPORTS",
//"image_path":"http://health.uq.edu.au/filething/get-styled/study_area_hero_825x320/3683/Exercise-and-Sport-Sciences6.jpg?itok=5taM4M60",
//	},
//	{
//"cat_id":"6",
//"cat_name":"TONE",
//"image_path":"http://hdwpro.com/wp-content/uploads/2016/02/Super-Sports-Wallpaper.jpg",
//	},
//	{
//"cat_id":"7",
//"cat_name":"YOGA",
//"image_path":"http://i.dailymail.co.uk/i/pix/2014/12/22/2438B44700000578-2883729-Pot_yoga_-m-5_1419262687022.jpg",
//	},
//	{
//"cat_id":"8",
//"cat_name":"COMBAT",
//"image_path":"http://www.courtlough.ie/wp-content/uploads/2013/03/IMG_4889.JPG",
//	},
//	{
//"cat_id":"9",
//"cat_name":"PILATES",
//"image_path":"https://breckenhealth.com.au/files/2015/10/pilates_slide01.png",
//	},
//  {
//"cat_id":"10",
//"cat_name":"WEIGHT TRANING",
//"image_path":" http://img.aws.livestrongcdn.com/ls-article-image-640/ds-photo/getty/article/199/251/181046007.jpg",
//  },
//  {
//"cat_id":"11",
//"cat_name":"BOXING",
//"image_path":"http://www.bhmpics.com/thumbs/kick_boxing_training_bag_to_hit-t3.jpg",
//  }
// ,
//  {
//"cat_id":"12",
//"cat_name":"CROSSFIT",
//"image_path":"http://www.domyos.co.uk/sites/domyos/files/conseils-sculpt-exercice-challenge-cross-training-header.jpg",
//  },
//  {
//"cat_id":"13",
//"cat_name":"AROBICS",
//"image_path":"http://cdn2.stylecraze.com/wp-content/uploads/2013/07/4312-best-aerobic-exercise-videos.jpg",
//  }
//  ,
//  {
//"cat_id":"14",
//"cat_name":"ZUMBA",
//"image_path":"http://wavesgym.com/wp-content/uploads/2015/01/Zumba-1.jpg",
//  }
//	];
 $scope.goList = function (l) {
     window.localStorage.setItem("ListItemData", JSON.stringify(l));
     $rootScope.HeaderName = l.cat_name;
     $rootScope.categoryID = l.cat_id;
     $state.go('list')
}
        
function deleteGymCenter() {
    return $q(function (resolve, reject) {
        var delGymCenterQuery = "Delete from gymCenter";
        $cordovaSQLite.execute(db, delGymCenterQuery, []).then(function (res) {
            resolve('Success');
        }, function (err) {
           
        });
    })
}

function insertGymCenter() {
        return $q(function (resolve, reject) {
            var j = 100, k = 0, m = 0, interval = 100;
            if (j > $scope.gymCenterDatalength) {
                j = $scope.gymCenterDatalength;
                interval = interval;
            }
            if ($scope.gymCenterDatalength == 0) {
                resolve('Success');
            }
            else {
                while (j <= $scope.gymCenterDatalength) {
                  //  var gymCenterQuery = "INSERT INTO gymCenter (cat_id, center_id, center_name, center_imgpath, price, price_id ," +
                    //   " address , branch_addr, center_slot_data, grade, grade_id , landmark, latitude, longitude, margin, s_id , s_name, seats_perday) VALUES ";

                    var gymCenterQuery = "INSERT INTO gymCenter (cat_id , center_id , " +
                    " center_name , center_imgpath , price , price_id , address  , branch_addr ," +
                    " center_slot_data , grade , grade_id , landmark , latitude , longitude , " +
                    " margin , s_id , s_name , seats_perday, distance, location, loc_id) VALUES ";
                    var gymCenterArgs = [];
                    var gymCenterDatas = [];
                    for (var i = k; i < j; i++) {
                        var arrayGymCenter = $scope.gymCenterData[i];
                        gymCenterArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                        gymCenterDatas.push(arrayGymCenter.cat_id);
                       // gymCenterDatas.push("SPORTS");

                        gymCenterDatas.push(arrayGymCenter.center_id);
                        gymCenterDatas.push(arrayGymCenter.center_name);

                        gymCenterDatas.push(arrayGymCenter.center_imgpath);
                      //  gymCenterDatas.push("http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg");

                        gymCenterDatas.push(arrayGymCenter.price);
                        gymCenterDatas.push(arrayGymCenter.price_id);
                        gymCenterDatas.push(arrayGymCenter.branch_addr);
                        gymCenterDatas.push(arrayGymCenter.branch_addr);
                        gymCenterDatas.push(arrayGymCenter.center_slot_data);
                        gymCenterDatas.push(arrayGymCenter.grade);
                        gymCenterDatas.push(arrayGymCenter.grade_id);
                        gymCenterDatas.push(arrayGymCenter.landmark);
                        gymCenterDatas.push(arrayGymCenter.latitude);
                        gymCenterDatas.push(arrayGymCenter.longitude);
                        gymCenterDatas.push(arrayGymCenter.margin);
                        gymCenterDatas.push(arrayGymCenter.s_id);
                        gymCenterDatas.push(arrayGymCenter.s_name);
                        gymCenterDatas.push(arrayGymCenter.seats_perday);

                        var lat = localStorage.getItem("lat");
                        var long = localStorage.getItem("long");
                        var latitude1 = arrayGymCenter.latitude;
                        var longitude1 =arrayGymCenter.longitude;
                        var latitude2 = lat;
                        var longitude2 = long;
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
                        gymCenterDatas.push(distance / 1000);
                        gymCenterDatas.push(arrayGymCenter.location);
                        gymCenterDatas.push(arrayGymCenter.loc_id);
                    }
                    gymCenterQuery += gymCenterArgs.join(", ");
                    $cordovaSQLite.execute(db, gymCenterQuery, gymCenterDatas).then(function (res) {
                    }, function (err) {
                     
                    });
                    k = j;
                    j = j + interval;
                    if (m == 1) {
                        resolve('Success');
                        break;
                    }
                    if ($scope.gymCenterDatalength < j) {
                        j = $scope.gymCenterDatalength;
                        m = 1;
                    }
                }
            }
        });
    }
      

 setTimeout(function () {
            current();
        },2000);
function current(){
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
             localStorage.setItem("lat", lat);
            localStorage.setItem("long", long);
            var lastLat=localStorage.getItem("lat");
    }, function(err) {
    });
}
//})
})
app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background': 'linear-gradient(rgba(0, 0, 0, 0.60),rgba(0, 0, 0, 0.60)),url(' + url +')',
            'background-size' : 'cover',
            'height':'100%',
              'border':'0px solid black'
        });
    }
});
    