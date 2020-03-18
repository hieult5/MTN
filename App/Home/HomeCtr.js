angular.module('HomeCtr', ['ngAnimate', 'ui.bootstrap'])
    .controller("HomeCtr", ['$scope', '$rootScope', '$http', '$filter', 'Upload', '$interval', '$state', '$stateParams', '$sce', function ($scope, $rootScope, $http, $filter, Upload, $interval, $state, $stateParams, $sce) {
        $scope.rootUrls = [
            "http://snews.businessportal.vn",
            "http://scar.businessportal.vn",
        ]
        //-------------------------------------
        $scope.initOne = function () {
           
        }
        $scope.initOne();
    }])