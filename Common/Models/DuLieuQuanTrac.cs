using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MTN.Common.Models
{
    public class DuLieuQuanTrac
    {
        public DuLieuQuanTrac() { }
        public DuLieuQuanTrac(DateTime _ngayQuantrac, string _diadanh_ID, string _thuocTinh_ID, double _giatri)
        {
            NgayQuantrac = _ngayQuantrac;
            Diadanh_ID = _diadanh_ID;
            Thuoctinh_ID = _thuocTinh_ID;
            Giatri = _giatri;
        }

        public DuLieuQuanTrac(MTN.Models.NV_DulieuQuantrac quantrac)
        {
            NgayQuantrac = quantrac.NgayQuantrac;
            Diadanh_ID = quantrac.Diadanh_ID;
            Thuoctinh_ID = quantrac.Thuoctinh_ID;
            Giatri = quantrac.Giatri;
        }
        public DateTime NgayQuantrac { get; set; }
        public string Diadanh_ID { get; set; }
        public string Thuoctinh_ID { get; set; }
        public double Giatri { get; set; }
    }
}