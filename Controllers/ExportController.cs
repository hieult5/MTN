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

namespace MTN.Controllers
{
    public class ExportController : Controller
    {
        // GET: Export
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ExportData(string fromDate, string toDate)
        {
            try
            {
                // fix data request
                //DateTime? fromdate = fromDate.ConvertStringToDate();
                //DateTime? todate = toDate.ConvertStringToDate();

                DateTime? fromdate = fromDate.ConvertStringToDate();
                DateTime? todate = DateTime.Now;

                // get and hadle data
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

                    var dataNgayQuanTrac = db.NV_DulieuQuantrac.Select(x => x.NgayQuantrac).Distinct().ToList();

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

                    string excelFile = Excel.getCopyExcelTemplateFile("TemplateFile\\test.xlsx");
                    var excelBytes = Excel.WriteExcel(list, excelFile, "TemplateFile\\test.xlsx");

                    Response.Buffer = true;
                    Response.Clear();
                    Response.ClearHeaders();
                    Response.ClearContent();
                    string FileDownloadName = string.Format("Export_{0}_{1}.xlsx",
                        DateTime.Now.ToString("yyMMdd"), "Dunning Invoices");
                    Response.AddHeader("content-disposition", "attachment;filename=" + FileDownloadName + ".xlsx");
                    Response.AddHeader("Content-Type", "application/vnd.ms-excel");
                    Response.BinaryWrite(excelBytes);
                    Response.Flush();
                    Response.End();

                    FileResult fr = new FileContentResult(excelBytes, "application/vnd.ms - excel")
                    {
                        FileDownloadName = string.Format("Export_{0}_{1}.xlsx",
                        DateTime.Now.ToString("yyMMdd"), "Dunning Invoices")
                    };
                }
                return Json(new { message = Messenger.Success.ToString(), status = false });
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, status = false });
            }
        }
    }
}