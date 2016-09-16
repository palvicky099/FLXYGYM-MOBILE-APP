app.controller('profileCtrl', function ($scope, $ionicLoading, dataService, $ionicPlatform, $cordovaCamera, $jrCrop, $cordovaImagePicker, $http, $state, $ionicPopup, $cordovaLocalNotification) {
    //$scope.$on('$ionicView.enter', function () {
        $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('app.dashboard');
        });
        $scope.dates = new Date($scope.dashList.dob);
        $scope.updateProfile = function (dashList) {
            if (navigator.connection.type == Connection.NONE) {
                var alertPopup = $ionicPopup.alert({
                    title: ' No internet connection',
                    template: '<div style="text-align:center; font-size:22px">No internet connectivity detected. Please reconnect and try again.</div>'
                });
                alertPopup.then(function (res) {
                });
            }
            else {
              //  alert(dashList.image);
                var abc = dashList.image;
                $ionicLoading.show({
                    noBackdrop: false,
                    template: '<ion-spinner icon="lines"/>'
                });
                var modelProfile =
                    {
                        "mobile": dashList.mobile,
                        "name": dashList.name,
                        "email": dashList.email,
                        "address": dashList.address,
                        "dob": dashList.dob,
                        "blood_group": dashList.blood_group,
                        "height": dashList.height,
                        "weight": dashList.weight,
                        "gender": dashList.gender,
                        "image": dashList.image
                        //"image": "data:image/png;base64,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"
                    }
                ///var db = JSON.stringify(modelProfile);
                var req = {
                    method: 'POST',
                    url: 'http://www.flxygym.com/home/api/update_user_profile.php',
                    //   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: modelProfile
                }
                $http(req).then(function (res) {
                    // if (res.data.message)
                    var abc = JSON.parse(JSON.stringify(res.data));
                    console.log(abc)
                    if (abc.message = "User Information are Updated Succesfully") {
                      //  window.localStorage.setItem("UserProfile", JSON.stringify(res.data));
                        $ionicLoading.show({
                            noBackdrop: false,
                            template: abc.massage,
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 3000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: 'FLXY Gym',
                            text: 'Profile updated successfully',
                            data: {
                                customProperty: 'custom value'
                            }
                        }).then(function (result) {
                            // ...
                        });
                        window.localStorage.setItem("UserProfile", JSON.stringify(modelProfile));
                        $scope.dashList = modelProfile;
                        $ionicLoading.hide();

                    }
                    else {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            noBackdrop: false,
                            template: 'Update failed try again',
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 3000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                    }
                })
            }
        }

        $scope.visible = {};
        $scope.choose = function () {
            fromGallery();
        //    var popup = $ionicPopup.show({
        //        'templateUrl': 'chooseProfilePhoto.html',
        //        'title': 'Choose to upload profile',
        //        'scope': $scope,
        //        'buttons': [
        //                    {
        //                        'text': 'Cancel'
        //                    },
        //                    {
        //                        'text': 'OK',
        //                        'onTap': function (event) {
        //                            return $scope.visible.status;
        //                        }
        //                    }
        //        ]
        //    });
        //    popup.then(function (result) {
        //        fromGallery();
        //        //if (result == "1") {
        //        //    fromCamera();
        //        //}
        //        //if (result == "0") {
        //        //    fromGallery();
        //        //}
        //    });
        }

        function fromCamera(){
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.dashList.image = "data:image/jpeg;base64," + imageURI;
            });
        };
        function fromGallery() {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 100
            };

            $cordovaImagePicker.getPictures(options)
                 .then(function (results) {
                     for (var i = 0; i < results.length; i++) {
                         console.log('Image URI: ' + results[i]);
                         $scope.imageCrop = results[i];
                     }
                     $jrCrop.crop({
                         url: $scope.imageCrop,
                         width: 200,
                         height: 200
                     }).then(function (canvas) {
                         // success!
                         var image = canvas.toDataURL();
                         $scope.dashList.image = image;
                     }, function () {
                         // User canceled or couldn't load image.
                     });
                     //convertImgToBase64URL(results[0], function (base64Img) {
                     //    $scope.dashList.image =  base64Img;
                     //});
                 }, function (error) {
                     console.log(error);
                 });
        }

        function convertImgToBase64URL(url, callback, outputFormat) {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        };
        $scope.errSrc = "https://proseawards.com/wp-content/uploads/2015/08/no-profile-pic.png";
    })

