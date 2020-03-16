baseUrl = "http://businessportal.vn/";
rootUrl = "businessportal.vn";
domainUrl = "http://" + rootUrl + "/";
href_hd = "http://businessportal.vn/Portals/HDSD_SmartOffice_TongQuanVeHeThong.htm"
Date.prototype.getWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof (dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        if (weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1, 0, 1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};
var os = angular.module("os", ['dndLists', 'ckeditor', 'angular-nicescroll', 'ui.utils.masks', 'ui.router', 'oc.lazyLoad', 'angularLazyImg', 'uiSwitch', 'ngtimeago', 'angularTreeview', 'ngFileUpload', 'treeGrid', 'ckeditor', 'ang-drag-drop', 'angular.filter', 'htmlToPdfSave', 'jsTag', 'angucomplete', 'ngSanitize', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'csCurrencyInput', 'ui.dateTimeInput', 'ngAnimate', 'smart-table', 'vs-repeat', 'apg.typeaheadDropdown']);
os.config(['$ocLazyLoadProvider', '$stateProvider', '$compileProvider', '$httpProvider', '$urlRouterProvider', '$sceDelegateProvider', function ($ocLazyLoadProvider, $stateProvider, $compileProvider, $httpProvider, $urlRouterProvider, $sceDelegateProvider) {
    $compileProvider.debugInfoEnabled(false);
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://businessportal.vn/**'
    ]);
    $httpProvider.useApplyAsync(1000); //true
    $ocLazyLoadProvider.config({
        'debug': false, // For debugging 'true/false'
        'events': false, // For Event 'true/false'
        'modules': [
            bindModulesFolder("Module", "module", "HT_TD_ModuleCtr"),
            bindModulesFolder("Home", "home", "HomeCtr"),
            bindModulesFolder("SendHub", "sendhub", "SendHubCtr"),
            bindModulesFolder("Account", "account", "AccountCtr"),
            bindModulesFolder("Account", "switchacc", "AccountCtr"),
            bindModulesFolder("Home", "danhba", "HomeCtr")
        ]
    });
    $stateProvider
        .state('module', bindStatePar("module", "Module/HT_TD_Module", "HT_TD_ModuleCtr", {
            id: { squash: true, value: null }
        }))
        .state('home', bindStatePar("home", "Home/Home", "HomeCtr", {
            id: { squash: true, value: null }
        }))

        .state('/', bindStatePar("home", "Home/Home", "HomeCtr", {
            id: { squash: true, value: null }
        }))
        .state('sendhub', bindStatePar("sendhub", "SendHub/SendHub", "SendHubCtr", {
            id: { squash: true, value: null }
        }))
        .state('account', bindStatePar("account", "Account/Account", "AccountCtr", {
            id: { squash: true, value: null }
        }))
        .state('switchacc', bindStatePar("switchacc", "Account/SwitchAcc", "AccountCtr", {
            id: { squash: true, value: null }
        }))
        .state('danhba', bindStatePar("danhba", "Home/Danhba", "HomeCtr", {
            id: { squash: true, value: null }
        }));
    $urlRouterProvider.otherwise('home');
}]);
os.run(function ($rootScope, $templateCache) {
    var cookie = readCookie("U");
    if (localStorage.getItem("lo") != cookie && cookie && cookie != "" && cookie != "null") {
        localStorage.setItem('lo', cookie);
        localStorage.setItem('au', cookie);
    }
    //else if (!cookie || cookie == "" || cookie == "null") {
    //    deleteAllCookies();
    //    setCookieUserDomain("");
    //    localStorage.removeItem("lo");
    //    localStorage.removeItem("u");
    //}
    if (!localStorage.getItem("lo") && cookie && cookie != "" && cookie != "null") {
        localStorage.setItem('lo', cookie);
        localStorage.setItem('au', cookie);
    }
    if (localStorage.getItem('au')) {
        $rootScope.objgetLogin = JSON.parse(decr(localStorage.getItem('au')));
    }
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (typeof current !== 'undefined') {
            $templateCache.remove(current.templateUrl);
            $templateCache.remove(turl);
        }
    });
    $rootScope.vcache = vhtmlcache;
    var link = location.href;
    var linkcheck = '/ResetPassowrd/IDKey/';
    if (link.indexOf(linkcheck) > 0) {
        $rootScope.isLogin = true;
    }
    $rootScope.pz = 20;
    if (localStorage.getItem("lo") !== null) {
        $rootScope.login = JSON.parse(decr(localStorage.getItem("lo")));
        $rootScope.isLogin = true;
        if ($rootScope.login && $rootScope.login.u) {
            $rootScope.Onlines = [];
            $rootScope.congtyID = $rootScope.login.u.congtyID;

            $rootScope.logOut = function () {
                $http({
                    method: "POST",
                    url: "Home/delFirebase",
                    data: { t: $rootScope.login.tk, Users_ID: $rootScope.login.u.NhanSu_ID, TokenCMID: $rootScope.TokenCMID },
                    contentType: 'application/json; charset=utf-8'
                }).then(function (res) {
                    if (!$rootScope.checkToken(res)) return false;
                    if (res.data.error !== 1) {

                    } 
                    });
                deleteAllCookies();
                setCookieUserDomain("");
                localStorage.removeItem("lo");
                localStorage.removeItem("u");
                location.href = baseUrl;
            };
            $rootScope.checkToken = function (res) {
                if (res.data.token === 0) {
                    if (!checkTK) {
                        dlg = dialogs.confirm("Thông báo", 'Token đã hết hạn, vui lòng đăng nhập lại ?', { windowClass: "apidialog", size: "sm" });
                        dlg.result.then(function () {
                            $rootScope.logOut(); checkTK = false;
                        }, function () {
                            $rootScope.logOut(); checkTK = false;
                        });
                    }
                    checkTK = true;
                    hideloading();
                    return false;
                }
                return true;
            };
        }
    }
});
os.controller("MainCtr", ['$scope', '$rootScope', '$state', '$http', '$sce', function ($scope, $rootScope, $state, $http, $sce) {
    $rootScope.domainUrl = domainUrl;
    $rootScope.href_hd = href_hd;
    $scope.bgColor = [
        "#2196f3", "#009688", "#ff9800", "#795548", "#ff5722"
    ];
    $rootScope.newUrl = "http://snews." + rootUrl + "/";
    $scope.rootSearch = function () {
        $scope.$broadcast('Search');
    };

    // SendHub
    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }
    var domains = [
        { domain: 1, loai: 0 }
    ];
    $scope.goMenuSendHub = function () {
        $rootScope.TenDuan = $rootScope.login.u.tenCongty;
        $state.go('sendhub');
    }
    $rootScope.BindListSendHub = function () {
        
        $http({
            method: "POST",
            url: "Home/CallProc",
            data: {
                t: $rootScope.login.tk, proc: "SOE_List_SendHub", pas: [
                    { "par": "NhanSu_ID", "va": $rootScope.login.u.NhanSu_ID },
                    { "par": "Congty_ID", "va": $rootScope.login.u.congtyID },
                    { "par": "p", "va": null },
                    { "par": "pz", "va": null },
                    { "par": "s", "va": null },
                ]
            },
            contentType: 'application/json; charset=utf-8'
        }).then(function (res) {
            
            if (!$rootScope.checkToken(res)) return false;
            if (res.data.error !== 1) {
                var data = JSON.parse(res.data.data);
                $rootScope.notifications = data[0];
                $rootScope.countNotifications = data[1][0].c;
            }
        });
    }
    //----------------------------
    // Account
    $scope.goMenuAccount = function () {
        $rootScope.TenDuan = $rootScope.login.u.tenCongty;
        $state.go('account');
    }
    // ---------------------------
    $scope.goMenuHome = function () {
        $scope.link = null;
        $state.go('/');
    };
    $scope.goMenuHomeMaster = function () {
        $scope.link = "Home";
        $state.go('home');
    }
    $scope.openFile = function (name, url) {
        saveAs(baseUrl + url, name);
    };

    $scope.BindListModule = function () {
        $http({
            method: "POST",
            url: "Home/CallProc",
            data: {
                t: $rootScope.login.tk, proc: "SOE_List_Module", pas: [
                    { "par": "Users_ID", "va": $rootScope.login.u.NhanSu_ID }
                ]
            },
            contentType: 'application/json; charset=utf-8'
        }).then(function (res) {
            if (!$rootScope.checkToken(res)) return false;
            if (res.data.error !== 1) {
                $rootScope.modules = JSON.parse(res.data.data)[0];
            }
        });
    };
    //--------------------------------------------------------------
    if ($rootScope.login) {
        //$rootScope.TenDuan = "Tin tức và sự kiện";
        var tlt = ($rootScope.login.u.fullName + '<br/>') + ($rootScope.login.u.tenChucVu !== null ? ($rootScope.login.u.tenChucVu + '<br/>') : '') + ($rootScope.login.u.tenPhongban !== null ? $rootScope.login.u.tenPhongban : '');
        $rootScope.login.u.tooltip = tlt;
        $scope.BindListModule();
        $scope.BindListSendHub();
    }
}]);
os.controller("LoginCtr", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.login = { tenTruyCap: '', matKhau: '', remer: true };
    let u = null;
    try {
        u = localStorage.getItem('u') != null ? JSON.parse(decr(localStorage.getItem('u'))) : null;
    } catch (e) {
        u = null;
    }
    if (u !== null) {
        $scope.login = { Users_ID: u.Users_ID, IsPassword: u.IsPassword, remer: u.remer };
    }
    $scope.err = { errAccount: "", errPass: "" };
    $scope.loadding = false;
    $scope.Login = function () {
        if ($scope.loadding) return false;
        if ($scope.login.tenTruyCap === null || $scope.login.tenTruyCap === undefined || $scope.login.tenTruyCap.trim() === "") {
            $scope.err.errAccount = "* Tên đăng nhập không được để trống!";
            $("input[name='tenTruyCap']").focus();
            Swal.fire({
                type: 'error',
                title: '',
                text: 'Tên đăng nhập không được để trống!'
            });
            return false;
        } else {
            $scope.err.errAccount = "";
        }
        if ($scope.login.matKhau === null || $scope.login.matKhau === undefined || $scope.login.matKhau.trim() === "") {
            $scope.err.errPass = "* Mật khẩu không được để trống!";
            Swal.fire({
                type: 'error',
                title: '',
                text: 'Mật khẩu không được để trống!'
            });
            $("input[name='matKhau']").focus();
            return false;
        } else {
            $scope.err.errPass = "";
        }
        swal.showLoading();
        $scope.loadding = true;
        $.ajax({
            type: "POST",
            url: "/Export/ExportData",
            data: null,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {
                //startLoader();
            },
            success: function (response) {
                if (response.status) {
                    window.location.href = "Export/Download/?file=" + response.fileName;
                }
                else {
                    alert("không có dữ liệu");
                }
            },
            error: function (response) {
                alert("lỗi");
                $scope.loadding = false;
            },
            complete: function () {
                //stopLoader();
            },
            always: function () {
                $scope.loadding = false;
            }
        });
        $.ajax({
            type: "POST",
            url: "/Login/CheckLoginEn",
            data: JSON.stringify({ str: encr(JSON.stringify($scope.login)).toString() }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.err.errAccount = "";
                $scope.err.errPass = "";
                if (data === null || data.trim().length === 0) {
                    $scope.err.ms = "* Tên đăng nhập hoặc mật khẩu không đúng!";
                    $scope.loadding = false;
                    Swal.fire({
                        type: 'error',
                        title: '',
                        text: 'Tên đăng nhập hoặc mật khẩu không đúng!'
                    });
                } else {
                    $rootScope.isLogin = true;
                    $scope.loadding = false;
                    if ($scope.login.remer) {
                        localStorage.setItem('u', encr(JSON.stringify($scope.login)));
                    }
                    setCookieUserDomain(data);
                    localStorage.setItem('lo', data);
                    localStorage.setItem('au', data);
                    location.href = baseUrl;
                    $scope.loadding = false;
                }
            },
            error: function (result) {
                Swal.fire({
                    type: 'error',
                    title: '',
                    text: 'Tên đăng nhập hoặc mật khẩu không đúng!'
                });
                $scope.loadding = false;
                $scope.err.ms = "* Tên đăng nhập hoặc mật khẩu không đúng!";
            },
            always: function () {
                $scope.loadding = false;
            }
        });
    };

    $scope.QuenMatKhau = function () {
        $rootScope.mTitleRePass = "Quên mật khẩu";
        $("#ModalRememberPass").modal("show");
    };
    $scope.GuiMailRePass = function () {
        showloading();
        $http({
            method: "POST",
            url: "/Login/SendMailKH",
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function () {
                var formData = new FormData();
                formData.append("NhanSu_ID", $scope.NhanSu_ID);
                formData.append("CongtyID", $rootScope.congtyID);
                formData.append("baseUrl", baseUrl);
                formData.append("userName", $scope.RememPass.userName);
                formData.append("Email", $scope.RememPass.Email);
                return formData;
            }

        }).then(function (res) {
            if (res.data.error === 1) {
                hideloading();
                dialogs.error('Thông báo', res.data.ms, { windowClass: "apidialog", size: "sm" });
            }
            else {
                hideloading();
                $("#ModalRememberPass").modal("hide");
                showtoastr('Đã gửi Email thành công!');
            }
        });
    };
}]);
os.directive('onError', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on('error', function () {
                element.attr('src', attr.onError);
                $(element).hide();
                $(element.next()).show();
            });
        }
    };
});
os.directive('fancybox', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            // find the inner elements and apply fancybox to all of them at once 
            var apply_fancybox_to = element.find('a.fbelements');
            $(apply_fancybox_to).fancybox({
                fitToView: true,
                autoSize: true,
            });
        }
    };
});
os.directive('jsSelect2', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            jQuery(element).select2(
            );
            scope.$watch(attrs.ngModel, function () {
                $timeout(function () {
                    element.trigger('change.select2');
                }, 100);
            });

        }
    };
});
os.filter('sumOfValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (value) {
            sum = sum + parseInt(value[key]);
        });
        return sum;
    };
});
os.directive('clockPicker', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.clockpicker();
        }
    };
});
os.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elm, attr, ngModel) {

            function updateViewValue() {
                ngModel.$setViewValue(this.innerHTML);
            }
            //Binding it to keyup, lly bind it to any other events of interest 
            //like change etc..
            elm.on('keyup', updateViewValue);

            scope.$on('$destroy', function () {
                elm.off('keyup', updateViewValue);
            });

            ngModel.$render = function () {
                elm.html(ngModel.$viewValue);
            };

        }
    };
});
os.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
os.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    };
});
os.directive("digitalClock", function ($timeout, dateFilter) {
    return function (scope, element, attrs) {

        element.addClass('text-center clock');

        scope.updateClock = function () {
            $timeout(function () {
                element.text(dateFilter(new Date(), 'hh:mm:ss'));
                scope.updateClock();
            }, 1000);
        };

        scope.updateClock();

    };
});
os.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
os.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    }
    return {
        link: fn_link
    };
}])
    .directive('modalMovable', ['$document',
        function ($document) {
            return {
                restrict: 'AC',
                link: function (scope, iElement, iAttrs) {
                    var startX = 0,
                        startY = 0,
                        x = 0,
                        y = 0;

                    var dialogWrapper = iElement.parent();

                    dialogWrapper.css({
                        position: 'relative'
                    });

                    iElement.on('mousedown', function (event) {
                        // Prevent default dragging of selected content
                        // event.preventDefault();
                        startX = event.pageX - x;
                        startY = event.pageY - y;
                        $document.on('mousemove', mousemove);
                        $document.on('mouseup', mouseup);
                    });

                    function mousemove(event) {
                        y = event.pageY - startY;
                        x = event.pageX - startX;
                        dialogWrapper.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                    }

                    function mouseup() {
                        $document.unbind('mousemove', mousemove);
                        $document.unbind('mouseup', mouseup);
                    }
                }
            };
        }
    ]);
os.directive('currencyInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            return ctrl.$parsers.push(function (inputValue) {
                var inputVal = element.val();
                //clearing left side zeros
                while (inputVal.charAt(0) == '0') {
                    inputVal = inputVal.substr(1);
                }
                inputVal = inputVal.replace(/[^\d.\',']/g, '');
                var point = inputVal.indexOf(".");
                if (point >= 0) {
                    inputVal = inputVal.slice(0, point + 3);
                }
                var decimalSplit = inputVal.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];
                intPart = intPart.replace(/[^\d]/g, '');
                if (intPart.length > 3) {
                    var intDiv = Math.floor(intPart.length / 3);
                    while (intDiv > 0) {
                        var lastComma = intPart.indexOf(",");
                        if (lastComma < 0) {
                            lastComma = intPart.length;
                        }

                        if (lastComma - 3 > 0) {
                            intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
                        }
                        intDiv--;
                    }
                }

                if (decPart === undefined) {
                    decPart = "";
                } else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;

                if (res != inputValue) {
                    ctrl.$setViewValue(res);
                    ctrl.$render();
                }
            });

        }
    };
});
os.directive('integer', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
            if (!ngModel)
                return;

            function isValid(val) {
                if (val === "")
                    return true;

                var asInt = parseInt(val, 10);
                if (isNaN(asInt) || (asInt.toString() !== val && "0" + asInt.toString() !== val)) {
                    return false;
                }
                var min = parseInt(attr.min);
                if (isNaN(min) && asInt < min) {
                    return false;
                }

                var max = parseInt(attr.max);
                if (isNaN(max) && max < asInt) {
                    return false;
                }

                return true;
            }

            var prev = scope.$eval(attr.ngModel);
            ngModel.$parsers.push(function (val) {
                // short-circuit infinite loop
                if (val === prev)
                    return val;
                if (!isValid(val)) {
                    ngModel.$setViewValue(prev);
                    ngModel.$render();
                    return prev;
                }

                prev = val;
                return val;
            });
        }
    };
});

os.filter('customArray', function ($filter) {
    return function (list, arrayFilter, element) {
        if (arrayFilter) {
            return $filter("filter")(list, function (listItem) {
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
});
os.filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
});
os.directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
os.filter('filterMultiple', ['$filter', function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data: items,
            filteredData: [],
            applyFilter: function (obj, key) {
                var fData = [];
                if (this.filteredData.length == 0)
                    this.filteredData = this.data;
                if (obj) {
                    var fObj = {};
                    if (!angular.isArray(obj)) {
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                    } else if (angular.isArray(obj)) {
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                if (angular.isDefined(obj[i])) {
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                }
                            }

                        }
                    }
                    if (fData.length > 0) {
                        this.filteredData = fData;
                    }
                }
            }
        };
        if (keyObj) {
            angular.forEach(keyObj, function (obj, key) {
                filterObj.applyFilter(obj, key);
            });
        }
        return filterObj.filteredData;
    };
}]);
os.filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>');

        return $sce.trustAsHtml(text);
    };
});
os.filter('crop', function () {
    return function (input, limit, respectWordBoundaries, suffix) {
        if (input === null || input === undefined || limit === null || limit === undefined || limit === '') {
            return input;
        }
        if (angular.isUndefined(respectWordBoundaries)) {
            respectWordBoundaries = true;
        }
        if (angular.isUndefined(suffix)) {
            suffix = '...';
        }

        if (input.length <= limit) {
            return input;
        }

        limit = limit - suffix.length;

        var trimmedString = input.substr(0, limit);
        if (respectWordBoundaries) {
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + suffix;
        }
        return trimmedString + suffix;
    }
});
os.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
// Filter convert url using view file pdf
os.filter('trustAsResourceUrl',
    [
        '$sce', function ($sce) {
            return function (val) {
                return $sce.trustAsResourceUrl(val);
            };
        }
    ]);
//component
os.component('user', {
    bindings: {
        vu: '<',
        vp: '<',
        all: '<',
        ct: '<',//công ty
        ctch: '<',//công ty cha
        ctc: '<',//công ty con
        hTitle: '@',
        choiceUser: '&',
        one: '<',
        objfilter: '<'
    },
    templateUrl: baseUrl + '/App/Temp/User.html?v=' + vhtmlcache,
    controller: function ($rootScope) {
        var $ctr = this;
        this.$onChanges = function (a) {
            $ctr.uAll = false;
            $ctr.Search = null;
            this.reset();
        };
        this.uAll = false;
        this.goFilter = function (m, f) {
            $ctr.uAll = false;
            var us = this.vu;
            if (this.Search) {
                var s = this.Search.toLowerCase();
                var sk = change_alias(this.Search.toLowerCase());
                us = us.filter(u =>
                    u.fullName.toLowerCase().indexOf(s) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(s) !== -1
                    || u.fullName.toLowerCase().indexOf(sk) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(sk) !== -1
                );
            }
            var rs = this.roles.filter(r => r.CongTy_ID === $rootScope.congty.Congty_ID && r.isCheck);
            if (rs.length > 0) {
                us = us.filter(u => rs.find(r => u.roles !== null && u.roles.indexOf(r.Role_ID) > -1));
            }
            if (m && !f) {
                if (m.isCheck === true) {
                    m.isCheck = false;
                } else {
                    this.phongbans.filter(p => p.isCheck).forEach(function (r) {
                        r.isCheck = false;
                    });
                    m.isCheck = true;
                }
            } else if (m && f) {
                this.phongbans.filter(p => p.isClick).forEach(function (r) {
                    r.isClick = false;
                });
                m.users.forEach(function (u) {
                    u.isCheck = m.isCheck;
                });
            }
            var ps = this.phongbans.filter(p => p.isCheck);
            if (ps.length > 0) {
                this.phongbansUS = ps;
            } else {
                this.phongbansUS = this.phongbans;
            }
            this.phongbansUS.forEach(function (p) {
                p.users = us.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
            });
        };
        this.SelectModel = function (m) {
            $ctr.uAll = false;
            var us = this.vu;
            if (this.Search) {
                var s = this.Search.toLowerCase();
                var sk = change_alias(this.Search.toLowerCase());
                us = us.filter(u =>
                    u.fullName.toLowerCase().indexOf(s) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(s) !== -1
                    || u.fullName.toLowerCase().indexOf(sk) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(sk) !== -1
                );
            }
            if (m.isClick === true) {
                m.isClick = false;
            } else {
                this.phongbans.filter(p => p.isClick).forEach(function (r) {
                    r.isClick = false;
                });
                m.isClick = true;
            }
            var rs = this.roles.filter(r => r.CongTy_ID === $rootScope.congty.Congty_ID && r.isCheck);
            if (rs.length > 0) {
                us = us.filter(u => rs.find(r => u.roles !== null && u.roles.indexOf(r.Role_ID) > -1));
            }
            var ps = this.phongbans.filter(p => p.isClick);
            if (ps.length > 0) {
                this.phongbansUS = ps;
            } else {
                this.phongbansUS = this.phongbans;
            }
            this.phongbansUS.forEach(function (p) {
                p.users = us.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
            });
        };
        this.goCtyFilter = function (c) {
            if (!this.phongbans) return;
            $ctr.uAll = false;
            this.phongbans.forEach(function (r) {
                r.isCheck = false;
            });
            this.childcongtys.forEach(function (r) {
                r.isCheck = false;
            });
            $ctr.congty.isCheck = false;
            c.isCheck = true;
            var us = this.vu;
            if (this.Search) {
                var s = this.Search.toLowerCase();
                var sk = change_alias(this.Search.toLowerCase());
                us = us.filter(u =>
                    u.fullName.toLowerCase().indexOf(s) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(s) !== -1
                    || u.fullName.toLowerCase().indexOf(sk) !== -1
                    || (u.enFullName + "").toLowerCase().indexOf(sk) !== -1
                );
            }
            var rs = this.roles.filter(r => r.CongTy_ID === $rootScope.congty.Congty_ID && r.isCheck);
            if (rs.length > 0) {
                us = us.filter(u => rs.find(r => u.roles !== null && u.roles.indexOf(r.Role_ID) > -1));
            }
            this.phongbansUS = this.phongbans.filter(p => p.Congty_ID === c.Congty_ID);
            this.phongbansUS.forEach(function (p) {
                p.users = us.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
            });
        };
        this.refershModel = function () {
            $ctr.uAll = false;
            var pbs = this.vp;
            var us = this.vu;
            this.Search = null;
            if (pbs) {
                pbs.forEach(function (p) {
                    p.users = us.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
                });
                this.phongbans = pbs;
                this.phongbansUS = pbs;
            }
            this.roles.forEach(function (r) {
                r.isCheck = false;
            });
        };
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        this.toogleModel = function (m) {
            $ctr.uAll = false;
            if (m.close !== true) {
                m.close = true;
            } else {
                m.close = false;
            }
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.users.forEach(function (u) {
                    u.isCheck = check;
                });
            });
        };
        this.ChoiceUser = function () {
            var us = this.vu.filter(u => u.isCheck);
            this.reset();
            this.choiceUser({ us: us });
        };
        this.reset = function () {
            $ctr.uAll = false;
            $ctr.Search = null;
            var pbs = $ctr.vp;
            if (pbs && $ctr.vu) {
                $ctr.vu.forEach(function (u) {
                    u.isCheck = false;
                });
                if ($rootScope.ctyroles) {
                    $rootScope.ctyroles.forEach(function (u) {
                        u.isCheck = false;
                    });
                }
                if ($ctr.vu) {
                    pbs.forEach(function (p) {
                        p.isCheck = false;
                        if ($ctr.vu) {
                            p.users = $ctr.vu.filter(u => u.phongbans && u.phongbans.indexOf(p.Phongban_ID) !== -1);
                        }
                    });
                    //pbs = pbs.filter(p=>p.users.length>0);
                } else {
                    pbs.forEach(function (p) {
                        p.isCheck = false;
                    });
                }
                $ctr.congty = $rootScope.congty;
                $ctr.childcongtys = $rootScope.childcongtys;
                if (this.ct) {
                    if (!this.ctch) {
                        if ($rootScope.me.congtyID !== $rootScope.congty.Congty_ID) {
                            $ctr.congty = $rootScope.childcongtys.find(x => x.Congty_ID === $rootScope.me.congtyID);
                        }
                    }
                    if (!this.ctc) {
                        $ctr.childcongtys = [];
                    }
                }
                if (!pbs || pbs.length == 0) {
                    var pbss = $rootScope.phongbans.find(x => x.Phongban_ID === $rootScope.login.u.Phongban_ID);
                    if (pbss) {
                        var cty = $rootScope.phongbans.find(x => x.Phongban_ID === pbss.IDCha.split(",")[0]);
                        pbs = $rootScope.phongbans.filter(x => cty.IDCon.indexOf(x.Phongban_ID) > -1);
                        pbs.push(cty);
                    }
                    $ctr.childcongtys = [];
                }
                if (this.all) {
                    $ctr.congty = $rootScope.childcongtys.find(x => x.Congty_ID === $rootScope.congty.Parent_ID);
                }
                if ($ctr.objfilter !== null && $ctr.objfilter !== undefined) {
                    if ($ctr.objfilter.donvi === true) {//Gửi nội bộ
                        var cty = $rootScope.childcongtys.find(x => x.Congty_ID === $rootScope.me.congtyID);
                        if (cty) {
                            $ctr.congty = cty;
                        }
                        $ctr.childcongtys = [];
                        pbs = pbs.filter(x => x.Congty_ID === $rootScope.me.congtyID);
                    } else if ($ctr.objfilter.donvi === false) {//Gửi ra ngoài
                        $ctr.childcongtys = $rootScope.childcongtys.filter(x => x.Congty_ID !== $rootScope.me.congtyID);
                        pbs = pbs.filter(x => $ctr.childcongtys.filter(a => a.Congty_ID === x.Congty_ID).length > 0);
                    }
                }
                $ctr.phongbans = pbs;
                $ctr.phongbansUS = pbs;
                $ctr.roles = $rootScope.ctyroles;
            }
        };
        this.checkU = function (u) {
            var us = this.vu.filter(m => m.NhanSu_ID !== u.NhanSu_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };
    }
});
os.component('phong', {
    bindings: {
        vp: '<',
        hTitle: '@',
        choiceUser: '&'
    },
    templateUrl: baseUrl + '/App/Temp/Phong.html?v=' + vhtmlcache,
    controller: function ($scope, $rootScope, dialogs, $http, $stateParams, $state, $filter, Upload) {
        var $ctr = this;
        this.$onInit = function () {
            var pbs = $ctr.vp;
            if (pbs) {
                $ctr.phongbans = pbs;
                $ctr.phongbansUS = pbs;
            }
        };
        var Temp = [];
        function addToArray(array, id, lv) {
            var filter = $filter('filter')(array, { Parent_ID: id }, true);
            filter = $filter('orderBy')(filter, 'thutu');
            if (filter.length > 0) {
                var sp = "";
                for (var i = 0; i < lv; i++) {
                    sp += "----";
                }

                lv++;
                angular.forEach(filter, function (item) {
                    item.lv = lv;
                    item.close = true;
                    item.ids += "," + item.Congty_ID;
                    item.tenmoi = sp + item.tenCongty;
                    Temp.push(item);
                    addToArray(array, item.Congty_ID, lv);
                });
            }
        }
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        this.toogleModel = function (m) {
            if (m.close !== true) {
                m.close = true;
            } else {
                m.close = false;
            }
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoiceUser = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choiceUser({ us: us });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };
        this.getCheckPbChild = function (m) {
            var getListPbChild = $ctr.phongbans.filter(x => x.IDCha != null && x.IDCha.indexOf(m.Phongban_ID) > -1);
            if (m.isCheck == true)
                getListPbChild.forEach(function (t) {
                    t.isCheck = true;
                });
            else
                getListPbChild.forEach(function (t) {
                    t.isCheck = false;
                });
        }
        //

        this.changeCheckCty = function (idxID, check) {
            var checkIsCongtyTong = $rootScope.childcongtys.find(m => m.Congty_ID == idxID);
            if (checkIsCongtyTong.Parent_ID == null) {
                var getListPbCtyCha = $ctr.phongbans.filter(n => n.Congty_ID == idxID);
                //
                if (check == true) {
                    getListPbCtyCha.forEach(function (t) {
                        t.isCheck = true;
                    });
                }
                else {
                    getListPbCtyCha.forEach(function (t) {
                        t.isCheck = false;
                    });
                }
            }
            addToArray($rootScope.childcongtys, idxID, 0);
            var listAllCongtyByIDCha = Temp;
            Temp = [];
            if (check == true) {
                var objCongtyHienTai = $rootScope.childcongtys.find(n => n.Congty_ID == idxID);
                angular.forEach(objCongtyHienTai.phongbans, function (u) {
                    u.isCheck = true;
                });
                //
                listAllCongtyByIDCha.forEach(function (t) {
                    t.isCheck = true;
                    angular.forEach(t.phongbans, function (u) {
                        u.isCheck = true;
                    });
                });
            }
            else {
                var objCongtyHienTai = $rootScope.childcongtys.find(n => n.Congty_ID == idxID);
                angular.forEach(objCongtyHienTai.phongbans, function (u) {
                    u.isCheck = false;
                });
                //
                listAllCongtyByIDCha.forEach(function (t) {
                    t.isCheck = false;
                    angular.forEach(t.phongbans, function (u) {
                        u.isCheck = false;
                    });
                });
            }
        }
        //
        //
    }
});
os.component('treephong', {
    bindings: {
        cb: '=',
        vp: '<',
        hTitle: '@',
        choiceUser: '&'
    },
    templateUrl: baseUrl + '/App/Temp/TreePhong.html?v=' + vhtmlcache,
    controller: function ($rootScope) {
        var $ctr = this;
        this.$onInit = function () {
            var pbs = $ctr.vp;
            if (pbs) {
                $ctr.phongbans = pbs;
                $ctr.phongbansUS = pbs;
            }
        };
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        this.clickModel = function (m, f) {
            if (!f) {
                this.phongbansUS.filter(p => p.isCheck).forEach(function (p) {
                    p.isCheck = false;
                });
                m.isCheck = !m.isCheck;
            }
            $ctr.ChoiceUser();
        };
        this.toogleModel = function (m, f) {
            if (m.close !== true) {
                m.close = true;
            } else {
                m.close = false;
            }
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoiceUser = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choiceUser({ us: us });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };

    }
});
os.component('treephongstore', {
    bindings: {
        cb: '=',
        vp: '<',
        ct: '<',
        cts: '<',
        hTitle: '@',
        choiceUser: '&'
    },
    templateUrl: baseUrl + '/App/Temp/TreePhongStore.html?v=' + vhtmlcache,
    controller: function ($rootScope) {
        var $ctr = this;
        this.$onInit = function () {
            var pbs = $ctr.vp;
            $ctr.congty = $ctr.ct;
            $ctr.childcongty = $ctr.cts;
            if (pbs) {
                $ctr.phongbans = pbs;
                $ctr.phongbansUS = pbs;
            }
        };
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        this.clickModel = function (m, f) {
            if (!f) {
                this.phongbansUS.filter(p => p.isCheck).forEach(function (p) {
                    p.isCheck = false;
                });
                m.isCheck = !m.isCheck;
            }
            $ctr.ChoiceUser();
        };
        this.toogleModel = function (m, f) {
            if (m.close !== true) {
                m.close = true;
            } else {
                m.close = false;
            }
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoiceUser = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choiceUser({ us: us });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };

    }
});
os.component('treephongnocheck', {
    bindings: {
        vp: '<',
        hTitle: '@',
        choiceCongty: '&',
        choicePhong: '&'
    },
    templateUrl: baseUrl + '/App/Temp/TreePhongNoCheck.html?v=' + vhtmlcache,
    controller: function ($filter) {
        var $ctr = this;
        this.$onInit = function () {
            var pbs = $ctr.vp;
            if (pbs) {
                $ctr.phongbans = pbs;
                $ctr.phongbansUS = pbs;
            }
            pbs = this.vp;
        };
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        this.so = "thutucha";
        var Temp2 = [];
        this.SortPB = function (f) {
            Temp2 = [];
            if (f) {
                this.so = "thutucha";
            } else {
                this.so = "tenmoi";
            }
            addToArray2(this.phongbans, null, 0, this.so);
            this.phongbans = Temp2;
            console.log(Temp2);
        };
        function addToArray2(array, id, lv, so) {
            var filter = $filter('filter')(array, { Parent_ID: id }, true);
            filter = $filter('orderBy')(filter, so);
            if (filter.length > 0) {
                var sp = "";
                for (var i = 0; i < lv; i++) {
                    sp += "";
                }
                lv++;
                angular.forEach(filter, function (item) {
                    item.lv = lv;
                    if (!item.ids) {
                        item.ids += "," + item.Phongban_ID;
                        item.tenmoi = sp + item.tenPhongban;
                    }
                    Temp2.push(item);
                    addToArray2(array, item.Phongban_ID, lv, so);
                });
            }
        }
        this.toogleModel = function (m, f) {
            if (f) {
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
            } else {
                this.phongbansUS.filter(p => p.isCheck).forEach(function (p) {
                    p.isCheck = false;
                });
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
                m.isCheck = !m.isCheck;
            }
            $ctr.ChoicePhong();
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoicePhong = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choicePhong({ us: us });
        };
        this.ChoiceCongty = function (p) {
            if (p.close !== true) {
                p.close = true;
            } else {
                p.close = false;
            }
            this.choiceCongty({ us: p });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };
        //var Temp2 = [];
        //$ctr.so = "thutu";
        //$ctr.SortPB = function (f) {
        //    ;
        //    if (f) {
        //        $scope.so = "thutu";
        //    } else {
        //        $scope.so = "tenmoi";
        //    }
        //    addToArray2($ctr.phongbans, null, 0);
        //    $ctr.phongbans = Temp2;
        //    Temp2 = [];
        //    var vbs = $rootScope.phongbans;
        //    if (vbs) {
        //        vbs.forEach(function (r) {
        //            r.Count = $scope.phongbans.find(x => x.Phongban_ID === r.Phongban_ID).countNsPb;
        //        });
        //        $scope.vbphongbans = vbs;
        //    }
        //};
        //function addToArray2(array, id, lv) {
        //    ;
        //    var filter = $filter('filter')(array, { Parent_ID: id }, true);
        //    filter = $filter('orderBy')(filter, $ctr.so);
        //    if (filter.length > 0) {
        //        var sp = "";
        //        for (var i = 0; i < lv; i++) {
        //            sp += "";
        //        }
        //        lv++;
        //        angular.forEach(filter, function (item) {
        //            item.lv = lv;
        //            item.close = true;
        //            if (!item.ids) {
        //                item.ids += "," + item.Phongban_ID;
        //                item.tenmoi = sp + item.tenPhongban;
        //            }
        //            Temp2.push(item);
        //            addToArray2(array, item.Phongban_ID, lv);
        //        });
        //    }
        //}
    }
});
os.component('treephongusers', {
    bindings: {
        vp: '<',
        hTitle: '@',
        choiceCongty: '&',
        choicePhong: '&'
    },
    templateUrl: baseUrl + '/App/Temp/TreePhongUser.html?v=' + vhtmlcache,
    controller: function ($scope, $rootScope, dialogs, $http, $stateParams, $state, $filter, Upload) {
        var $ctr = this;
        this.$onInit = function () {
            var pbs = $ctr.vp;
            $rootScope.ListDataPbUser = pbs;
            if (pbs) {
                pbs.forEach(function (p) {
                    p.users = $rootScope.users.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
                });
                this.phongbans = pbs;
                this.phongbansUS = pbs;
            }
        };
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        var Temp = [];
        function addToArray(array, id, lv) {
            var filter = $filter('filter')(array, { Parent_ID: id }, true);
            filter = $filter('orderBy')(filter, 'thutu');
            if (filter.length > 0) {
                var sp = "";
                for (var i = 0; i < lv; i++) {
                    sp += "----";
                }
                lv++;
                angular.forEach(filter, function (item) {
                    item.lv = lv;
                    item.close = true;
                    item.ids += "," + item.Phongban_ID;
                    item.tenmoi = sp + item.tenPhongban;
                    Temp.push(item);
                    addToArray(array, item.Phongban_ID, lv);
                });
            }
        }
        this.toogleModel = function (m, f) {
            if (f) {
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
            } else {
                this.phongbansUS.filter(p => p.isCheck).forEach(function (p) {
                    p.isCheck = false;
                });
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
                m.isCheck = !m.isCheck;
            }
            $ctr.ChoicePhong();
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoicePhong = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choicePhong({ us: us });
        };
        this.ChoiceCongty = function (p) {
            if (p.close !== true) {
                p.close = true;
            } else {
                p.close = false;
            }
            this.choiceCongty({ us: p });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };
        //getListCheck phanquyen
        $scope.arrListUserChoice = [];
        this.getcheckRolePb = function (m) {
            var ListPbUser = $ctr.vp;
            addToArray($ctr.vp, m.Phongban_ID, 0);
            $scope.ListPhongBanChild = Temp;
            Temp = [];
            if (m.isCheckItem == true) {
                //l?y ra list user theo pbID
                $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                $scope.getListUser.users.forEach(function (t) {
                    t.isCheckItem = true;
                    $scope.arrListUserChoice.push(t);
                });
                //get list phongbanCon
                if ($scope.ListPhongBanChild.length > 0) {
                    $scope.ListPhongBanChild.forEach(function (t) {
                        t.isCheckItem = true;
                        //l?y ra list user theo pbID con
                        $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                        $scope.getListUser.users.forEach(function (u) {
                            u.isCheckItem = true;
                            $scope.arrListUserChoice.push(u);
                        });
                    });
                }
            }
            else {
                //l?y ra list user theo pbID
                $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                $scope.getListUser.users.forEach(function (t) {
                    t.isCheckItem = false;
                    $scope.arrListUserChoice.pop(t);
                });
                //get list phongbanCon
                if ($scope.ListPhongBanChild.length > 0) {
                    $scope.ListPhongBanChild.forEach(function (t) {
                        t.isCheckItem = false;
                        //l?y ra list user theo pbID con
                        $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                        $scope.getListUser.users.forEach(function (u) {
                            u.isCheckItem = false;
                            $scope.arrListUserChoice.pop(u);
                        });
                    });
                }
                //
            }
        }
        //check user
        this.getcheckRoleUs = function (m, index) {
            if (m.isCheckItem == true) {
                //chek trùng
                checkTrung = $scope.arrListUserChoice.filter(n => n.NhanSu_ID == m.NhanSu_ID);
                if (checkTrung.length == 0) {
                    //checkTrung.isCheckItem = true;
                    $scope.arrListUserChoice.push(m);
                }
            }
            else {
                checkTrung = $scope.arrListUserChoice.filter(n => n.NhanSu_ID == m.NhanSu_ID);
                if (checkTrung.length > 0) {
                    //$scope.arrListUserChoice.pop(m);
                    $scope.arrListUserChoice.splice(index, 1);
                }
            }
        }

        this.checkChucNangRole = function (m, check) {
            var ListPbUser = $ctr.vp;
            addToArray($ctr.vp, m.Phongban_ID, 0);
            $scope.ListPhongBanChild = Temp;
            Temp = [];

            //check
            if (check == 'IsRead') {
                if (m.IsRead == true) {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsRead = true;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsRead = true;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsRead = true;
                            });
                        });
                    }
                }
                //
                else {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsRead = false;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsRead = false;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsRead = false;
                            });
                        });
                    }
                }
            }
            else if (check == 'IsWrite') {
                if (m.IsWrite == true) {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsWrite = true;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsWrite = true;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsWrite = true;
                            });
                        });
                    }
                }
                //
                else {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsWrite = false;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsWrite = false;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsWrite = false;
                            });
                        });
                    }
                }
            }
            else {
                if (m.IsFull == true) {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsFull = true;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsFull = true;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsFull = true;
                            });
                        });
                    }
                }
                //
                else {
                    //l?y ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsFull = false;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsFull = false;
                            //l?y ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsFull = false;
                            });
                        });
                    }
                }
            }
        }

        this.ConfigRoleUser = function (frm) {
            addToArray($rootScope.phongbans, null, 0);
            var listPbcheck = Temp;
            Temp = [];
            $scope.arr = [];
            listPbcheck.forEach(function (t) {
                angular.forEach(t.users, function (value, key) {
                    var check = null;
                    if ($scope.arr.length > 0) {
                        check = $scope.arr.find(n => n.NhanSu_ID == t.users[key].NhanSu_ID);
                    }
                    if ((t.users[key].IsRead || t.users[key].IsWrite || t.users[key].IsFull) && check == null) {
                        $scope.arr.push(t.users[key]);
                    }
                });
            })
            var Urlaction;
            Urlaction = "/KTL_MyFolder/ConfigRoleUser";

            var formData = new FormData();
            formData.append("t", $rootScope.login.tk);
            formData.append("CongtyID", $rootScope.congtyID);
            formData.append("NhanSu_ID", $rootScope.NhanSu_ID);
            formData.append("FolderID", $rootScope.getparentIDFolder);
            //   formData.append("arrListUserChoice", JSON.stringify($scope.arrListUserChoice));
            formData.append("arrListUserChoice", JSON.stringify($scope.arr));

            $http.post(baseUrl + Urlaction, formData, {
                withCredentials: false,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data.error == 1) {
                    hideloading();
                    dialogs.error('Thông báo', res.data.ms, { windowClass: "apidialog", size: "sm" });
                    return false;
                }
                else {
                    $scope.checkLen = 0;
                    $("#ModalPhanQuyen").modal("hide");
                    showtoastr('Đã cập nhật dữ liệu thành công!.');
                }
            });
        };
    }
});
os.directive('pagination', function () {
    return {
        restrict: 'E',
        scope: {
            numPages: '=',
            currentPage: '=',
            onSelectPage: '&'
        },
        templateUrl: 'App/directive/pagination.html',
        replace: true,
        link: function (scope) {
            scope.$watch('numPages', function (value) {
                scope.pages = [];
                for (var i = 1; i <= value; i++) {
                    scope.pages.push(i);
                }
                if (scope.currentPage > value) {
                    scope.selectPage(value);
                }
            });
            scope.noPrevious = function () {
                return scope.currentPage === 1;
            };
            scope.noNext = function () {
                return scope.currentPage === scope.numPages;
            };
            scope.isActive = function (page) {
                return scope.currentPage === page;
            };

            scope.selectPage = function (page) {
                if (!scope.isActive(page)) {
                    scope.currentPage = page;
                    scope.onSelectPage({ page: page });
                }
            };

            scope.selectPrevious = function () {
                if (!scope.noPrevious()) {
                    scope.selectPage(scope.currentPage - 1);
                }
            };
            scope.selectNext = function () {
                if (!scope.noNext()) {
                    scope.selectPage(scope.currentPage + 1);
                }
            };
        }
    };
});
os.component('treephongusersrolemodule', {
    bindings: {
        vp: '<',
        hTitle: '@',
        choiceCongty: '&',
        choicePhong: '&'
    },
    templateUrl: baseUrl + '/App/SetRoleModule/treephongusersRoleModule.html?v=' + vhtmlcache,
    controller: function ($scope, $rootScope, dialogs, $http, $stateParams, $state, $filter, Upload) {
        var $ctr = this;
        this.$onInit = function () {
            // $scope.LoadListTich();
            var pbs = $ctr.vp;
            $rootScope.ListDataPbUser = pbs;
            if (pbs) {
                pbs.forEach(function (p) {
                    p.users = $rootScope.users.filter(u => u.phongbans !== null && u.phongbans.indexOf(p.Phongban_ID) !== -1);
                });
                this.phongbans = pbs;
                this.phongbansUS = pbs;
            }
        };
        this.uAll = false;
        this.checkUFilter = function (item) {
            return item.isCheck;
        };
        var Temp = [];
        function addToArray(array, id, lv) {
            var filter = $filter('filter')(array, { Parent_ID: id }, true);
            filter = $filter('orderBy')(filter, 'thutu');
            if (filter.length > 0) {
                var sp = "";
                for (var i = 0; i < lv; i++) {
                    sp += "----";
                }
                lv++;
                angular.forEach(filter, function (item) {
                    item.lv = lv;
                    item.close = true;
                    item.ids += "," + item.Phongban_ID;
                    item.tenmoi = sp + item.tenPhongban;
                    Temp.push(item);
                    addToArray(array, item.Phongban_ID, lv);
                });
            }
        }
        this.toogleModel = function (m, f) {
            if (f) {
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
            } else {
                this.phongbansUS.filter(p => p.isCheck).forEach(function (p) {
                    p.isCheck = false;
                });
                if (m.close !== true) {
                    m.close = true;
                } else {
                    m.close = false;
                }
                m.isCheck = !m.isCheck;
            }
            $ctr.ChoicePhong();
        };
        this.checkAllUST = function () {
            var check = this.uAll;
            this.phongbansUS.forEach(function (p) {
                p.isCheck = check;
            });
        };
        this.ChoicePhong = function () {
            var us = this.vp.filter(u => u.isCheck);
            this.choicePhong({ us: us });
        };
        this.ChoiceCongty = function (p) {
            if (p.close !== true) {
                p.close = true;
            } else {
                p.close = false;
            }
            this.choiceCongty({ us: p });
        };
        this.checkU = function (u) {
            var us = this.vp.filter(m => m.Phongban_ID !== u.Phongban_ID);
            us.forEach(function (n) {
                n.isCheck = false;
            });
        };

        $scope.LoadListTich = function () {
            var data = [];
            data = [
                { key: 'VB_themDen' },
                { key: 'VB_themDi' },
                { key: 'VB_xoaDen' },
                { key: 'VB_xoaDi' },
                { key: 'VB_xemBCcaNhan' },
                { key: 'VB_xemBCPhong' },
                { key: 'VB_xemBCCty' },
                { key: 'VB_xemBCAll' },
                { key: 'LCT_LapLich' },
                { key: 'LCT_DuyetLich' },
                { key: 'LCT_XemPhongHop' },
                { key: 'LCT_XemLichCaNhan' },
                { key: 'LCT_XemLichPhong' },
                { key: 'LCT_XemLichCongTy' },
                { key: 'LCT_XemLichAll' },
                { key: 'TSC_QuetBarCode' },
                { key: 'TSC_TheoDoiCaNhan' },
                { key: 'TSC_TheoDoiPhong' },
                { key: 'TSC_TheoDoiCongTy' },
                { key: 'TSC_TheoDoiAll' },
                { key: 'DX_XemXe' },
                { key: 'DX_TheoDoiCaNhan' },
                { key: 'DX_TheoDoiPhong' },
                { key: 'DX_TheoDoiCongTy' },
                { key: 'DX_TheoDoiAll' },
                { key: 'VPP_TheoDoiCaNhan' },
                { key: 'VPP_TheoDoiPhong' },
                { key: 'VPP_TheoDoiCongTy' },
                { key: 'VPP_TheoDoiAll' },
                { key: 'DP_TheoDoiCaNhan' },
                { key: 'DP_TheoDoiPhong' },
                { key: 'DP_TheoDoiCongTy' },
                { key: 'DP_TheoDoiAll' }
            ];

            $scope.ListTichFunction = data;
        };
        //getListCheck phanquyen
        $scope.arrListUserChoice = [];
        this.getcheckRolePb = function (m) {
            var ListPbUser = $ctr.vp;
            addToArray($ctr.vp, m.Phongban_ID, 0);
            $scope.ListPhongBanChild = Temp;
            Temp = [];
            if (m.isCheckItem == true) {
                //lấy ra list user theo pbID
                $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                $scope.getListUser.users.forEach(function (t) {
                    t.isCheckItem = true;
                    $scope.arrListUserChoice.push(t);
                });
                //get list phongbanCon
                if ($scope.ListPhongBanChild.length > 0) {
                    $scope.ListPhongBanChild.forEach(function (t) {
                        t.isCheckItem = true;
                        //lấy ra list user theo pbID con
                        $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                        $scope.getListUser.users.forEach(function (u) {
                            u.isCheckItem = true;
                            $scope.arrListUserChoice.push(u);
                        });
                    });
                }
            }
            else {
                //lấy ra list user theo pbID
                $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                $scope.getListUser.users.forEach(function (t) {
                    t.isCheckItem = false;
                    $scope.arrListUserChoice.pop(t);
                });
                //get list phongbanCon
                if ($scope.ListPhongBanChild.length > 0) {
                    $scope.ListPhongBanChild.forEach(function (t) {
                        t.isCheckItem = false;
                        //lấy ra list user theo pbID con
                        $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                        $scope.getListUser.users.forEach(function (u) {
                            u.isCheckItem = false;
                            $scope.arrListUserChoice.pop(u);
                        });
                    });
                }
                //
            }
        }
        //check user
        this.getcheckRoleUs = function (m, index) {
            if (m.isCheckItem == true) {
                //chek trùng
                var checkTrung = $scope.arrListUserChoice.filter(n => n.NhanSu_ID == m.NhanSu_ID);
                if (checkTrung.length == 0) {
                    //checkTrung.isCheckItem = true;
                    $scope.arrListUserChoice.push(m);
                }
            }
            else {
                var checkTrung = $scope.arrListUserChoice.filter(n => n.NhanSu_ID == m.NhanSu_ID);
                if (checkTrung.length > 0) {
                    //$scope.arrListUserChoice.pop(m);
                    $scope.arrListUserChoice.splice(index, 1);
                }
            }
        }

        this.checkChucNangRole = function (m, check) {
            var ListPbUser = $ctr.vp;
            addToArray($ctr.vp, m.Phongban_ID, 0);
            $scope.ListPhongBanChild = Temp;
            Temp = [];

            //check
            if (check == 'IsRead') {
                if (m.IsRead == true) {
                    //lấy ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsRead = true;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsRead = true;
                            //lấy ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsRead = true;
                            });
                        });
                    }
                }
                //
                else {
                    //lấy ra list user theo pbID
                    $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == m.Phongban_ID);
                    $scope.getListUser.users.forEach(function (t) {
                        t.IsRead = false;
                    });
                    //get list phongbanCon
                    if ($scope.ListPhongBanChild.length > 0) {
                        $scope.ListPhongBanChild.forEach(function (t) {
                            t.IsRead = false;
                            //lấy ra list user theo pbID con
                            $scope.getListUser = ListPbUser.find(n => n.Phongban_ID == t.Phongban_ID);
                            $scope.getListUser.users.forEach(function (u) {
                                u.IsRead = false;
                            });
                        });
                    }
                }
            }
        };

        this.ConfigRoleUser = function (frm) {
            addToArray($rootScope.phongbans, null, 0);
            var listPbcheck = Temp;
            Temp = [];
            $scope.arr = [];
            listPbcheck.forEach(function (t) {
                angular.forEach(t.users, function (value, key) {
                    var check = null;
                    if ($scope.arr.length > 0) {
                        check = $scope.arr.find(n => n.NhanSu_ID == t.users[key].NhanSu_ID);
                    }
                    if ((t.users[key].IsRead || t.users[key].IsWrite || t.users[key].IsFull) && check == null) {
                        $scope.arr.push(t.users[key]);
                    }
                });
            })
            var Urlaction;
            Urlaction = "/KTL_MyFolder/ConfigRoleUser";

            var formData = new FormData();
            formData.append("t", $rootScope.login.tk);
            formData.append("CongtyID", $rootScope.congtyID);
            formData.append("NhanSu_ID", $rootScope.NhanSu_ID);
            formData.append("FolderID", $rootScope.getparentIDFolder);
            //   formData.append("arrListUserChoice", JSON.stringify($scope.arrListUserChoice));
            formData.append("arrListUserChoice", JSON.stringify($scope.arr));

            $http.post(baseUrl + Urlaction, formData, {
                withCredentials: false,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data.error == 1) {
                    hideloading();
                    dialogs.error('Thông báo', res.data.ms, { windowClass: "apidialog", size: "sm" });
                    return false;
                }
                else {
                    $scope.checkLen = 0;
                    $("#ModalPhanQuyen").modal("hide");
                    showtoastr('Đã cập nhật dữ liệu thành công!.');
                }
            });
        };
    }
});
os.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});
os.directive("owlCarousel", function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function (element) {
                // provide any default options you want
                var defaultOptions = {
                };
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        }
    };
});
os.directive('owlCarouselItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);
moment.locale('vi');