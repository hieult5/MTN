using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MTN.Common.Models
{
    public class DuLieuQuanTrac { }

    public class DanhSachDiaDanh
    {
        public string thuocTinhId { get; set; }
        public IEnumerable<DanhSachThuocTinh> diadanh { get; set; }
    }

    public class DanhSachThuocTinh
    {
        public string DiaDanhId { get; set; }
        public string GiaTri { get; set; }
    }
}