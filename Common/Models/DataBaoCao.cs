using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MTN.Common.Models
{
    public class DataBaoCao
    {
        public DataBaoCao ()
        {
            datetime = string.Empty;
            datas = Enumerable.Empty<DataViewRows>();
        }

        public string datetime { get; set; }

        public IEnumerable<DataViewRows> datas { get; set; }
    }

    public class DataViewRows
    {
        public DataViewRows()
        {
            data = Enumerable.Empty<string>();
        }
        public IEnumerable<string> data { get; set; }
    }
}