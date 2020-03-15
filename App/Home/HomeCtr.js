angular.module('HomeCtr', ['ngAnimate', 'ui.bootstrap'])
    .controller("HomeCtr", ['$scope', '$rootScope', '$http', '$filter', 'Upload', '$interval', '$state', '$stateParams', '$sce', function ($scope, $rootScope, $http, $filter, Upload, $interval, $state, $stateParams, $sce) {
        $scope.rootUrls = [
            "http://snews.businessportal.vn",
            "http://scar.businessportal.vn",
        ]
        $scope.ListTinTop = function () {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Snews_Listtintop", pas: [
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    $scope.Tintop1 = data[0][0];
                    $scope.Tintops = data[0];
                    $scope.Tintops.splice(0, 1);
                    //$(".IsDuyetNS").animate({ scrollTop: 0 }, 400);
                }
            });
        }
        $scope.optionTB = {
            numPerPage: 2,
            currentPage: 1,
            Status: null,
            Total: 0,
            Pages: [15, 20, 50, 100, 1000]
        }
        $scope.bgColor = [
            "#2196f3", "#009688", "#ff9800", "#795548", "#ff5722"
        ];
        $scope.Listthongbao = function (f) {
            if (f) {
                $("#ThongbaoCtr .news-bot").animate({ scrollTop: 0 }, 400);
            }
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Snews_Listthongbaohome", pas: [
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID },
                        { "par": "p", "va": $scope.optionTB.currentPage },
                        { "par": "pz", "va": $scope.optionTB.numPerPage }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    $scope.Thongbaos = data[0];
                    if (f || !$scope.optionTB.noOfPages) {
                        $scope.optionTB.Total = data[1][0].c;
                        $scope.optionTB.noOfPages = Math.ceil(data[1][0].c / $scope.optionTB.numPerPage);
                    }
                }
            });
        }
        $scope.opitionns = {
            search: "",
            numPerPage: 15,
            currentPage: 1,
            sort: "thutu",
            ob: "asc",
            congtyID: $rootScope.login.u.congtyID,
            tenCongty: $rootScope.login.u.tenCongty,
            tenSort: "STT",
            tenTT: "Tất cả",
            Total: 0,
            View: 0,
            Pages: [15, 20, 50, 100, 1000]
        };
        $scope.ListSortns = [
            { id: 'tenNS', text: "Tên" },
            { id: 'thutu', text: "STT" }
        ];
        $scope.searchns = function () {
            $scope.opitionns.currentPage = 1;
            swal.showLoading();
            $scope.BindListFullContact(true);
            $(".searchbar.true>input").focus();
        };
        $scope.setPageSizens = function (p) {
            $scope.opitionns.currentPage = 1;
            $scope.opitionns.numPerPage = p;
            $scope.BindListFullContact(true);
        };
        $scope.setCongtyns = function (so) {
            
            $scope.opitionns.congtyID = so.Congty_ID;
            $scope.opitionns.tenCongty = so.tenCongty;
            $scope.BindListFullContact(true);
        };
        // Go detail
        $scope.goDetailTin = function (t, f) {
            
            location.href = $scope.rootUrls[0] + "/#!/chitiettin/" + t.Tintuc_ID + "/" + f;
        }
        $scope.goDetailTB = function (t, f) {
            
            location.href = $scope.rootUrls[0] + "/#!/chitietthongbao/" + t.Thongbao_ID + "/" + f;
        }
        // --------------------------------------
        // Doc
        $scope.BindListVB = function () {
            debugger
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Sdoc_ListVanban", pas: [
                        { "par": "p", "va": 1 },
                        { "par": "pz", "va": 5 },
                        { "par": "NhanSu_ID", "va": $rootScope.login.u.NhanSu_ID },
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID },
                        { "par": "s", "va": null },
                        { "par": "status", "va": null }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                debugger
                closeswal();
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    $scope.vanbans = data[0];
                    
                }
            });
        }
        $scope.BindListVBDi = function () {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Sdoc_ListVanbanDi", pas: [
                        { "par": "p", "va": 1 },
                        { "par": "pz", "va": 5 },
                        { "par": "NhanSu_ID", "va": $rootScope.login.u.NhanSu_ID },
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID },
                        { "par": "s", "va": null },
                        { "par": "status", "va": null }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                closeswal();
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    $scope.vanbandis = data[0];
                }
            });
        }
        // ----------------------------------------
        // Contact
        const lstTitleVB = [
            'Thông báo kết luận họp Ban lãnh đạo Công ty tháng 02.2020',
            'Quyết định tiếp nhận ông Nguyễn Thành Vũ - cán bộ kỹ thuật nhận công tác tại Phòng quản lý thi công',
            'Quyết định chấm dứt hợp đồng lao động đối với ông Phạm Văn Tiến - cán bộ phòng Quản lý đấu thầu',
            'Công ty thông báo về việc cấp phát khẩu trang phòng chống dịch viêm phổi do chủng virus corona mới',
            'Thông báo về việc phòng chống dịch viêm phổi do chủng virus corona mới (nCoV)'
        ];
        const lstTimeVB = [
            '10:20 11/02/2020',
            '09:10 10/02/2020',
            '16:36 05/02/2020',
            '14:22 08/02/2020',
            '12:01 09/02/2020'
        ]
        $scope.ListContactU = function () {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Snews_Listuser_congty", pas: [
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    data[0].forEach(function (r) {
                        r.tenStatus = $scope.ListStatusns.find(x => x.id == r.Status).text;
                    });
                    for (let i = 0; i <= 5; i++){
                        data[0][i].titleVB = lstTitleVB[i];
                        data[0][i].timeVB = lstTimeVB[i];
                    }
                    $scope.filterUser = data[0];
                    $scope.noduyetUser = data[0];
                }
            });
        }
        $scope.ListStatusns = [
            { id: -1, text: "Tất cả" },
            { id: 1, text: "Còn làm việc" },
            { id: 2, text: "Nghỉ theo chế độ" },
            { id: 3, text: "Đã nghỉ việc" }
        ];
        $scope.BindListRelativeCty = function () {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "List_Congty", pas: [
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                closeswal();
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    $scope.RelCty = data[0];
                }
            });
        }
        $scope.setSortns = function (so) {
            
            $scope.opitionns.sort = so.id;
            $scope.opitionns.tenSort = so.text;
            $scope.BindListFullContact(true);
        };
        $scope.complete = function (string, $event) {
            var keyCode = $event.keyCode;
            if (keyCode === 40) {
                // Down
                $("ul.autoUser").focus();
                $event.preventDefault();
            }
            string = string.replace("@", "");
            $scope.Focus1 = true;
            var output = [];
            if (!string) {
                string = "";
            }
            angular.forEach($scope.noduyetUser, function (u) {
                if ((u.fullName || "").toLowerCase().indexOf(string.toLowerCase()) >= 0 || (u.enFullName || "").toLowerCase().indexOf(string.toLowerCase()) >= 0 || (u.tenTruyCap || "").toLowerCase().indexOf(string.toLowerCase()) >= 0 || (u.phone + '').toLowerCase().indexOf(string.toLowerCase()) >= 0) {
                    output.push(u);
                }
            });
            $scope.filterUser = output;
        };
        $scope.BindListFullContact = function (f) {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "SOE_ListContact", pas: [
                        { "par": "Congty_ID", "va": $scope.opitionns.congtyID },
                        { "par": "p", "va": $scope.opitionns.currentPage },
                        { "par": "pz", "va": $scope.opitionns.numPerPage },
                        { "par": "sort", "va": $scope.opitionns.sort },
                        { "par": "ob", "va": $scope.opitionns.ob },
                        { "par": "s", "va": $scope.opitionns.search }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                closeswal();
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    //data[0].forEach(function (r) {
                    //    r.tenStatus = $scope.ListStatusns.find(x => x.id == r.Status).text;
                    //});
                    
                    $scope.Danhbas = data[0];
                    if (f || !$scope.opitionns.noOfPages) {
                        $scope.opitionns.Total = data[1][0].c;
                        $scope.opitionns.noOfPages = Math.ceil(data[1][0].c / $scope.opitionns.numPerPage);
                    }
                }
            });
        }
        // --------------------------------------
        // Birthday
        $scope.ListBirthdayToday = function () {
            var date = new Date();
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "SinhNhat_GetSinhNhatUserToDay", pas: [
                        { "par": "myDate", "va": date },
                        { "par": "congtyID", "va": $rootScope.login.u.congtyID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    data[0].forEach(function (r) {
                        r.tenStatus = $scope.ListStatusns.find(x => x.id == r.Status).text;
                    });
                    $scope.today_birthdayNS = data[0];
                    if ($scope.today_birthdayNS.length === 0) {
                        $scope.ListBirthdaySoon();
                    }
                }
            });
        }
        $scope.ListBirthdaySoon = function () {
            var date = new Date();
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "SinhNhat_GetListSinhNhatSapToi", pas: [
                        { "par": "myDate", "va": date },
                        { "par": "congtyID", "va": $rootScope.login.u.congtyID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    data[0].forEach(function (r) {
                        r.tenStatus = $scope.ListStatusns.find(x => x.id == r.Status).text;
                    });
                    $scope.soon_birthdayNS = data[0];
                }
            });
        }
        // --------------------------------------
        $scope.goMenuContact = function () {
            $state.go('danhba');
        };
        $scope.goSnews = function () {
            location.href = 'http://snews.businessportal.vn/';
        }
        //-----------------------------------------
        //Calendar
        $scope.ngay = Date();
        Date.prototype.getWeek = function () {
            var target = new Date(this.valueOf());
            var dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() != 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        };
        function getDateByWeek(weeks, year) {
            var d = new Date(year, 0, 1);
            var dayNum = d.getDay();
            var requiredDate = --weeks * 7;
            // If 1 Jan is Friday to Sunday, go to next week 
            if (((dayNum != 0) || dayNum > 4)) {
                requiredDate += 7;
            }
            // Add required number of days
            d.setDate(1 - d.getDay() + ++requiredDate);
            return d;
        }
        function weeksInYear(year) {
            var Tuans = [];
            var max = Math.max(
                moment(new Date(year, 11, 31)).isoWeek()
                , moment(new Date(year, 11, 31 - 7)).isoWeek()
            );
            for (var i = 0; i < max; i++) {
                var d = getDateByWeek(i, year);
                var de = getDateByWeek(i, year);
                var dn = new Date(de.setDate(de.getDate() + 6));
                Tuans.push({ Tuan: "Tuần " + (i + 1), TuNgay: d, DenNgay: dn, hientai: $scope.soTuanTrongNam === i + 1, stt: i + 1, quakhu: i < $scope.soTuanTrongNam - 1 });
            }
            return Tuans;
        }
        $scope.getYear = new Date().getFullYear();
        $scope.Thangs = [{ t: 0, n: "Tháng 1" }, { t: 1, n: "Tháng 2" }, { t: 2, n: "Tháng 3" }, { t: 3, n: "Tháng 4" }, { t: 4, n: "Tháng 5" }, { t: 5, n: "Tháng 6" }, { t: 6, n: "Tháng 7" }, { t: 7, n: "Tháng 8" }, { t: 8, n: "Tháng 9" }, { t: 9, n: "Tháng 10" }, { t: 10, n: "Tháng 11" }, { t: 11, n: "Tháng 12" },]
        $scope.Thus = [
            { v: 1, t: "Thứ 2" },
            { v: 2, t: "Thứ 3" },
            { v: 3, t: "Thứ 4" },
            { v: 4, t: "Thứ 5" },
            { v: 5, t: "Thứ 6" },
            { v: 6, t: "Thứ 7" },
            { v: 7, t: "Chủ nhật" }
        ];
        function getDayDate(d) {
            var date = new Date(d);
            var current_day = date.getDay();
            var day_name = '';
            switch (current_day) {
                case 0:
                    day_name = "Chủ Nhật";
                    break;
                case 1:
                    day_name = "Thứ Hai";
                    break;
                case 2:
                    day_name = "Thứ Ba";
                    break;
                case 3:
                    day_name = "Thứ Tư";
                    break;
                case 4:
                    day_name = "Thứ Năm";
                    break;
                case 5:
                    day_name = "Thứ Sáu";
                    break;
                case 6:
                    day_name = "Thứ Bảy";
            }
            return day_name;
        }
        function parseJsonDate(jsonDateString) {
            if (jsonDateString == null) return "";
            return new Date(parseInt(jsonDateString.replace('/Date(', '')));
        }
        Date.prototype.getWeek = function (date) {
            //Calcing the starting point
            var now = date ? new Date(date) : new Date();

            // set time to some convenient value
            now.setHours(0, 0, 0, 0);

            // Get the previous Monday
            var monday = new Date(now);
            monday.setDate(monday.getDate() - monday.getDay() + 1);

            // Get next Sunday
            var sunday = new Date(now);
            sunday.setDate(sunday.getDate() - sunday.getDay() + 7);

            // Return array of date objects
            return [monday, sunday];
        }
        //test code
        var Dates = new Date().getWeek();

        //Car
        $scope.BindListThuonghieuxe = function () {
            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "Scar_Listxehome", pas: [
                        { "par": "Congty_ID", "va": $rootScope.login.u.congtyID },
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                closeswal();
                if (!$rootScope.checkToken(res)) return false;
                if (res.data.error !== 1) {
                    var data = JSON.parse(res.data.data);
                    
                    $scope.cars = data[0];
                }
            });
        };
        //-------------------------------------------

        var getDates = function (startDate, endDate) {
            var dates = [],
                currentDate = startDate,
                addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            while (currentDate <= endDate) {
                dates.push(currentDate);
                currentDate = addDays.call(currentDate, 1);
            }
            return dates;
        };
        //lấy ra số tuần của năm
        function getWeekNumber(d) {
            // Copy date so don't modify original
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            // Get first day of year
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            // Return array of year and week number
            return [d.getUTCFullYear(), weekNo];
        }
        $scope.ListCalendar_LichhopTuan = function () {
            var bd = $scope.NgayDauTuan;
            var kt = $scope.NgayCuoiTuan;
            if (isValidDate(bd)) {
                bd = bd.toDateString();
            } else {
                bd = new Date().toDateString();
            }
            if (isValidDate(kt)) {
                kt = kt.toDateString();
            } else {
                kt = new Date().toDateString();
            }
            $http({
                method: "POST",
                url: "/Home/callProc",
                data: {
                    congtyID: $rootScope.congtyID, t: $rootScope.login.tk,
                    proc: "SCalendar_LichhopTuan",
                    pas: [
                        { "par": "Congty_ID", "va": $scope.LichCongTy_ID || $rootScope.login.u.congtyID },
                        { "par": "NgayDauTuan", "va": bd },
                        { "par": "NgayCuoiTuan", "va": kt },
                        { "par": "NhanSu_ID", "va": $rootScope.login.u.NhanSu_ID },
                        { "par": "IsType", "va": -1 },
                        { "par": "Loai", "va": 4 },
                        { "par": "Diadiem_ID", "va": $scope.Diadiem_ID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {

                if (res.data.error === 1) {
                    $scope.ListDataCalendar_LichhopTuan = [];
                    closeswal();
                    return false;
                }
                var data = JSON.parse(res.data.data)[0];
                data.forEach(function (r) {
                    if (r.ListNguoiThamDu) {
                        r.ListNguoiThamDu = JSON.parse(r.ListNguoiThamDu);
                    }
                });
                data = groupBy(data, 'BatdauG');
                var arr = [];
                for (let k in data) {
                    arr.push({ date: k, list: data[k] });
                }
                data = arr;
                if (data.length > 0) {
                    var index = 0;
                    var stt = 0;
                    angular.forEach(data, function (d) {
                        index = 0;
                        angular.forEach(d.list, function (detail) {
                            stt = stt + 1;
                            detail.gioBatDau = moment(detail.BatdauNgay).format('HH:mm');
                            detail.gioKetThuc = moment(detail.KethucNgay).format('HH:mm');

                            if (detail.gioBatDau == '00:00') {
                                detail.gioBatDau = '';
                            }
                            if (detail.gioKetThuc == '00:00') {
                                detail.gioKetThuc = '';
                            }
                            //get list phòng ban tham dự
                            detail.ThanhPhan = '';
                            if (detail.ListNguoiThamDu != null) {
                                for (var j = 0; j < detail.ListNguoiThamDu.length; j++) {
                                    if (detail.ListNguoiThamDu[j].ten != null) {
                                        detail.ThanhPhan += detail.ListNguoiThamDu[j].ten + ' (' + detail.ListNguoiThamDu[j].tenToChuc + ')' + ', ';
                                    }
                                }
                            }

                            d.GroupThu = getDayDate(d.date);
                            index = index + 1;
                            if (detail.IsDuyet && !$scope.isAllD) {
                                $scope.isAllD = true;
                            }
                        });
                    });
                }
                $scope.ListDataCalendar_LichhopTuan = data;
                setTimeout(function () {
                    if ($("#slich tr[today=true]") !== null && $("#slich tr[today=true]") !== undefined && $("#slich tr[today=true]").offset()) {
                        $("#slich").animate({
                            scrollTop: $("#slich tr[today=true]").offset().top
                        }, 1000);
                    }
                }, 200);
            },
                function (response) {
                });
        };
        function isValidDate(d) {
            return d instanceof Date && !isNaN(d);
        }
        $scope.Load_Donvi = function () {

            $http({
                method: "POST",
                url: "Home/CallProc",
                data: {
                    t: $rootScope.login.tk, proc: "SCalendar_ListCongtyAll", pas: [
                        { "par": "CongTy_ID", "va": $scope.CongTy_ID }
                    ]
                },
                contentType: 'application/json; charset=utf-8'
            }).then(function (res) {
                var data = JSON.parse(res.data.data);
                $scope.congtys = data[0];
            },
                function (response) {
                });
        };
        $scope.goCongty = function (t) {
            if (t != null) {
                $scope.LichCongTy_ID = t.Congty_ID;
            } else {
                $scope.LichCongTy_ID = null;
            }
            $scope.ListCalendar_LichhopTuan();
        };
        function initCalendar() {
            $scope.NgayDauTuan = Dates[0];
            $scope.NgayCuoiTuan = Dates[1];
            var result = getWeekNumber($scope.NgayDauTuan);
            $scope.soTuanTrongNam = result[1];
            $scope.soNamCuaTuan = result[0];
            $scope.datesarr = getDates(new Date(Dates[0]), new Date(Dates[1]));
            $scope.ListCalendar_LichhopTuan();
            $scope.CongTy_ID = $rootScope.login.u.congtyID;
            $scope.LichCongTy_ID = $rootScope.login.u.congtyID;
            $scope.Load_Donvi();
        }
        function groupBy(list, props) {
            return list.reduce((a, b) => {
                (a[b[props]] = a[b[props]] || []).push(b);
                return a;
            }, {});
        }
        // --------------------------------------
        // Quan ly cong viec
        var chart = AmCharts.makeChart("chartdiv", {
            "type": "pie",
            "marginBottom": 40,
            "allLabels": [{
                "x": "50%",
                "y": "25%",
                "text": "32",
                "size": 28,
                "align": "middle",
                "color": "#555"
            }],
            "dataProvider": [{
                "value": 70.5,
                "color": "#6dd230"
            }, {
                "value": 20.5,
                "color": "#ffeb00"
            }, {
                "value": 9.0,
                "color": "#ff0000"
            }],
            "colorField": "color",
            "valueField": "value",
            "labelRadius": -130,
            "pullOutRadius": 0,
            "labelRadius": 0,
            "innerRadius": "70%",
            "labelText": "",
            "balloonText": ""
        });

        //-------------------------------------
        $scope.initOne = function () {
            if($rootScope.login.u)
            $rootScope.TenDuan = $rootScope.login.u.tenCongty;
            $scope.ListTinTop();
            $scope.Listthongbao();
            $scope.ListContactU();
            $scope.ListBirthdayToday();
            $scope.BindListThuonghieuxe();
            $scope.BindListVB();
            $scope.BindListVBDi();
            var nameState = $state.current.name;
            if (nameState && nameState !== '')
            {
                if (nameState === 'danhba') {
                    $scope.$watch('opitionns.currentPage', $scope.BindListFullContact);
                    $scope.BindListRelativeCty();
                }
            }
            initCalendar();
        }
        $scope.initOne();
    }])