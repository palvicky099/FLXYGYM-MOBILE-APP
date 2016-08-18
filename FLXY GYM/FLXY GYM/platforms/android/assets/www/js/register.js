app.controller('registerCtrl', function ($scope, dataService, $ionicHistory, $state, $ionicLoading,$q,$cordovaSQLite, $rootScope) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    $scope.user = {};
    $scope.register = function (user) {
        if (user.name == undefined || user.name == '' || user.email == undefined || user.email == '' || user.password == undefined || user.password == '' || user.confirm == undefined || user.confirm == '') {
            $ionicLoading.show({
                template: 'All Field Required',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: true,
                duration: 2000,
                maxWidth: 200,
                showDelay: 0
            });
        }
        else {
            if (user.password != user.confirm) {
                $ionicLoading.show({
                    template: 'Password not match',
                    animation: 'fade-in',
                    showBackdrop: true,
                    noBackdrop: true,
                    duration: 2000,
                    maxWidth: 200,
                    showDelay: 0
                });
            } else {
                $ionicLoading.show({
                    noBackdrop: false,
                    template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
                });
                var model = {
                    "name":user.name,
                    "email":user.email,
                    "mobile":user.mobile,
                    "password":user.password
                }
                dataService.register(model).then(function (result) {
                    $ionicLoading.hide();
                    if (result.data.message == "Mobile number is already exist") {
                        $ionicLoading.show({
                            template: result.data.message,
                            animation: 'fade-in',
                            showBackdrop: true,
                            noBackdrop: true,
                            duration: 2000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                    }
                    else {
                        window.localStorage.setItem("registerSuccess", JSON.stringify(result.data.response));
                        $state.go('otp');
                        user.name = '';
                        user.password = '';
                        user.email = '';
                        user.confirm = '';
                        user.mobile = '';
                    }
                    });
                
            }
        }
    }
    $scope.otpCheck = function (otp) {
        if (otp) {
            var modelOTP = JSON.parse(window.localStorage.getItem("registerSuccess"));
            if (modelOTP[0].otp == otp)
            {
                dataService.registerSuccess(modelOTP).then(function (result) {
                    window.localStorage.setItem("LoginData", JSON.stringify(result.data));
                    LoadData();
                })
            }
            //else {
            //    $ionicLoading.show({
            //        template: 'PLease try again lator there is some problem to authenticate OTP',
            //        animation: 'fade-in',
            //        showBackdrop: true,
            //        noBackdrop: true,
            //        duration: 2000,
            //        maxWidth: 200,
            //        showDelay: 0
            //    });
            //}
        }
        else {
            $ionicLoading.show({
                template: 'Please enter OTP',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: true,
                duration: 2000,
                maxWidth: 200,
                showDelay: 0
            });
        }
    }


    function LoadData() {
        loadAllGymData();
        dataService.getCategory().then(function (result) {
            console.log(result.data.response);
            window.localStorage.setItem("Category", JSON.stringify(result.data.response));
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
            //  $scope.dashList = result.data.response;
        }, function (err) {
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
        });
        $scope.LoginData = JSON.parse(window.localStorage.getItem("LoginData"));
        var getProfileModel = {
            "mobile": $scope.LoginData.mobile
        }
        dataService.getProfile(getProfileModel).then(function (result) {
            window.localStorage.setItem("UserProfile", JSON.stringify(result.data.response));
        }, function (err) {
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
        });
    }


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
                                    $state.go('app.dashboard');
                                    window.localStorage.setItem("isLogin", "yes");
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
                        var longitude1 = arrayGymCenter.longitude;
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
})
