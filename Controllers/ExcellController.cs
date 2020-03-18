using System;
using System.IO;
using System.Web;
using System.Text;
using System.Linq;
using System.Web.Mvc;
using MTN.Common.Enum;
using System.Collections.Generic;
using MTN.Util;
using MTN.Common.Models;
using MTN.Attributes;

namespace MTN.Controllers
{
    public class ExcellController : Controller
    {
        // GET: Export
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [DeleteFileAttribute]
        public ActionResult Download(string file)
        {
            string fullPath = Path.Combine(Server.MapPath("~/TemplateFile/temp"), file);

            return File(fullPath, "application/vnd.ms-excel", file);
        }

        #region ExportExcel
        [HttpPost]
        public JsonResult ExportData(string fromDate, string toDate, string isDuBao)
        {
            // fix data request
            DateTime? fromdate = fromDate.ConvertStringToDate();
            DateTime? todate = toDate.ConvertStringToDate();

            // lấy dữ liệu xử lý
            using (var db = new Models.DbEntities())
            {
                string fileName;
                Dictionary<DateTime, string[,]> list = GetDataSearch(db, fromDate, toDate, isDuBao);
                string excelFile = Excel.getCopyExcelTemplateFile(out fileName);
                var excelBytes = list.WriteExcel(excelFile);
                if (excelBytes != null)
                {
                    string fullPath = Path.Combine(Server.MapPath("~/TemplateFile/temp"), fileName);
                    using (var exportData = new MemoryStream())
                    {
                        exportData.Write(excelBytes, 0, excelBytes.Length);
                        exportData.Position = 0;

                        FileStream file = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
                        exportData.WriteTo(file);
                        file.Close();
                    }
                    return Json(new { messenger = "success", fileName, status = true });
                }
                else
                    return Json(new { messenger = list.Count() > 0 ? "success" : "not_data", status = false });
            }
        }
        #endregion

        #region Import
        [HttpPost]
        public JsonResult ImportExcel(HttpPostedFileBase file, string bc)
        {
            try
            {
                string filePath = string.Empty;
                if (file != null)
                {
                    string path = Server.MapPath("~/Uploads/");
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    filePath = path + Path.GetFileName(file.FileName);

                    //delete the file exits
                    if (!System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                    string extension = Path.GetExtension(file.FileName);
                    file.SaveAs(filePath);

                    if (!filePath.ReadAndWriteDataToExcel("true".Equals(bc)))
                        return Json(new { status = false });
                }
                else
                    return Json(new { status = false, messenger = "chưa chọn file" });
                return Json(new { status = true } );
            }
            catch (Exception ex)
            {
                return Json(new { status = false });
            }
        }
        #endregion

        #region Get Data Search DateTime
        [HttpPost]
        public JsonResult GetData(string fromDate, string toDate, string bc)
        {
            try
            {
                Dictionary<DateTime, string[,]> list = new Dictionary<DateTime, string[,]>(); 
                using (var db = new Models.DbEntities())
                {
                    list = GetDataSearch(db, fromDate, toDate, bc);
                }
                return Json(new { date = list.Keys, arrDatas = list.Values, status = true });
            }
            catch(Exception ex)
            {
                return Json(new { messenger = ex.Message, status = false });
            }
        }

        private Dictionary<DateTime, string[,]> GetDataSearch(Models.DbEntities db, string fromDate, string toDate, string isDuBao)
        {
            // fix data request
            DateTime? fromdate = fromDate.ConvertStringToDate();
            DateTime? todate = toDate.ConvertStringToDate();

            Dictionary<DateTime, string[,]> list = new Dictionary<DateTime, string[,]>();
            string[,] arr;
            var lstTT = db.NV_MaubaocaoThuoctinh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Thuoctinh_ID);
            var lstDD = db.NV_MaubaocaoDiadanh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Diadanh_ID);
            if (!"true".Equals(isDuBao))
            {
                var data = db.NV_DulieuQuantrac.Where(x => lstTT.Any(y => y.Equals(x.Thuoctinh_ID))).Select(row => row);
                // xử lý filter theo NgayQuanTrac
                data = data.WhereIf(fromdate.HasValue, row => DateTime.Compare(fromdate.Value, row.NgayQuantrac) <= 0)
                .WhereIf(todate.HasValue, row => DateTime.Compare(row.NgayQuantrac, todate.Value) <= 0);

                var dataQuanTrac = data.GroupBy(row =>
                    new
                    {
                        row.NgayQuantrac,
                        row.Diadanh_ID,
                        row.Thuoctinh_ID,
                        row.Giatri
                    }).Select(g => new DuLieuQuanTrac()
                    {
                        NgayQuantrac = g.Key.NgayQuantrac,
                        Diadanh_ID = g.Key.Diadanh_ID,
                        Thuoctinh_ID = g.Key.Thuoctinh_ID,
                        Giatri = g.Key.Giatri
                    });

                var dataNgayQuanTrac = db.NV_DulieuQuantrac.Select(x => x.NgayQuantrac).Distinct().
                WhereIf(fromdate.HasValue, row => DateTime.Compare(fromdate.Value, row) <= 0)
                .WhereIf(todate.HasValue, row => DateTime.Compare(row, todate.Value) <= 0).ToList();

                // loaddata to string[,]
                int? rowIndex, colIndex;

                dataNgayQuanTrac.ForEach(date =>
                {
                    arr = null;
                    rowIndex = null;
                    lstDD.AsEnumerable().ForEach(ref rowIndex, row =>
                    {
                        colIndex = null;
                        arr = arr ?? new string[lstDD.Count(), lstTT.Count()];
                        lstTT.AsEnumerable().ForEach(ref colIndex, col =>
                        {
                            var temp = dataQuanTrac.FirstOrDefault(x =>
                                DateTime.Compare(x.NgayQuantrac, date) == 0 &&
                                x.Diadanh_ID.Equals(row) &&
                                x.Thuoctinh_ID.Equals(col));

                            arr[rowIndex.Value, colIndex.Value] = temp == null ? string.Empty : temp.Giatri.ToString();
                        });
                    });

                    list.Add(date, arr);
                });
            }
            else
            {
                var data = db.NV_Dulieudubao.Where(x => lstTT.Any(y => y.Equals(x.Thuoctinh_ID))).Select(row => row);
                // xử lý filter theo NgayQuanTrac
                data = data.WhereIf(fromdate.HasValue, row => DateTime.Compare(fromdate.Value, row.Ngaydubao) <= 0)
                .WhereIf(todate.HasValue, row => DateTime.Compare(row.Ngaydubao, todate.Value) <= 0);

                var dataDuBao = data.GroupBy(row =>
                    new
                    {
                        row.Ngaydubao,
                        row.Diadanh_ID,
                        row.Thuoctinh_ID,
                        row.Giatri
                    }).Select(g => new DuLieuDuBao()
                    {
                        NgayDuBao = g.Key.Ngaydubao,
                        Diadanh_ID = g.Key.Diadanh_ID,
                        Thuoctinh_ID = g.Key.Thuoctinh_ID,
                        Giatri = g.Key.Giatri
                    });

                var dataNgayDuBao = db.NV_Dulieudubao.Select(x => x.Ngaydubao).Distinct().
                WhereIf(fromdate.HasValue, row => DateTime.Compare(fromdate.Value, row) <= 0)
                .WhereIf(todate.HasValue, row => DateTime.Compare(row, todate.Value) <= 0).ToList();

                // loaddata to string[,]
                int? rowIndex, colIndex;

                dataNgayDuBao.ForEach(date =>
                {
                    arr = null;
                    rowIndex = null;
                    lstDD.AsEnumerable().ForEach(ref rowIndex, row =>
                    {
                        colIndex = null;
                        arr = arr ?? new string[lstDD.Count(), lstTT.Count()];
                        lstTT.AsEnumerable().ForEach(ref colIndex, col =>
                        {
                            var temp = dataDuBao.FirstOrDefault(x =>
                                DateTime.Compare(x.NgayDuBao, date) == 0 &&
                                x.Diadanh_ID.Equals(row) &&
                                x.Thuoctinh_ID.Equals(col));

                            arr[rowIndex.Value, colIndex.Value] = temp == null ? string.Empty : temp.Giatri.ToString();
                        });
                    });

                    list.Add(date, arr);
                });
            }

            return list;
        }
        #endregion
    }
}