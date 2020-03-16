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
    public class ExportController : Controller
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

        [HttpPost]
        public JsonResult ExportData(string fromDate, string toDate)
        {
            // fix data request
            //DateTime? fromdate = fromDate.ConvertStringToDate();
            //DateTime? todate = toDate.ConvertStringToDate();

            //DateTime? fromdate = DateTime.Now;
            DateTime? fromdate = new DateTime(2020, 03, 14);
            DateTime? todate = DateTime.Now;

            // lấy dữ liệu xử lý
            string handle = Guid.NewGuid().ToString();
            using (var db = new Models.DbEntities())
            {
                var lstTT = db.NV_MaubaocaoThuoctinh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Thuoctinh_ID);
                var lstDD = db.NV_MaubaocaoDiadanh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Diadanh_ID);
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


                // tạo string[,] array
                Dictionary<DateTime, string[,]> list = new Dictionary<DateTime, string[,]>();
                string[,] arr;

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

                string fileName;
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
                    return Json(new { fileName, status = true });
                }
                else
                    return Json(new { status = false });
            }
        }
    }
}