using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MTN.Models;

namespace MTN.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        private DbEntities db = new DbEntities();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ListDanhmucDiadanh()
        {
            try
            {
                var dm = from a in db.TD_Danhmuc
                         select new
                         {
                             a.Danhmuc_ID,
                             a.TenDanhmuc,
                             dd = db.TD_Diadanh.Where(x => x.Danhmuc_ID == a.Danhmuc_ID && x.Diadanhcha_ID == null).Select(x => new
                             {
                                 x.Tendiadanh,
                                 x.Diadanh_ID
                             })
                         };
                return Json(new { data = dm, error = 0 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { error = 1 }, JsonRequestBehavior.AllowGet);
            }
        }
        

        public JsonResult GetMauBaoCao(string id)
        {
            try
            {
                var bc = from a in db.NV_MauBaocao
                         where a.Diadanh_ID == id && a.Trangthai == true
                         select new
                         {
                             a.MauBC_ID,
                             listbcdd = db.NV_MaubaocaoDiadanh.Where(n => n.MauBC_ID == a.MauBC_ID).Select(n => new {
                                 n.Diadanh_ID,
                                 listdd = db.TD_Diadanh.Where(m => m.Diadanh_ID == n.Diadanh_ID).Select(m => new {
                                     m.Tendiadanh,
                                 }),
                                 n.BaocaoDiadanh_ID
                             }),
                             listbctt = db.NV_MaubaocaoThuoctinh.Where(n => n.MauBC_ID == a.MauBC_ID).Select(n => new {
                                 n.Thuoctinh_ID,
                                 listtt = db.TD_Thuoctinh.Where(m => m.Thuoctinh_ID == n.Thuoctinh_ID).Select(m => new {
                                     m.Tenthuoctinh,
                                     m.Donvitinh,
                                 }),
                                 n.BaocaoThuoctinh_ID
                             }),

                         };
                        
                return Json(new { data = bc, error = 0 }, JsonRequestBehavior.AllowGet);
        }
            catch (Exception e)
            {
                return Json(new { error = 1 }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}