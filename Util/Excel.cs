using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace MTN.Util
{
    public static class Excel
    {
        public static string getCopyExcelTemplateFile(out string newFile)
        {
            newFile = Guid.NewGuid() + "Excel.xlsx";
            string
                rootPath = HttpContext.Current.Request.MapPath("~"),
                templateFile = rootPath + "\\TemplateFile\\Template.xlsx",
                tempFile = Path.GetDirectoryName(templateFile) + "\\temp\\" + newFile;

            // coppy excel file
            File.Copy(templateFile, tempFile, true);
            return tempFile;
        }

        #region WriteExcel
        public static byte[] WriteExcel(this Dictionary<DateTime, string[,]> lst, string excelFile)
        {
            var template = new FileInfo(excelFile);
            bool hasData = true;
            using (var templateStream = new MemoryStream())
            {
                using (SpreadsheetDocument spreadDocument = SpreadsheetDocument.Open(excelFile, true))
                {
                    WorkbookPart workBookPart = spreadDocument.WorkbookPart;
                    Workbook workbook = workBookPart.Workbook;

                    var fileVersion = new FileVersion { ApplicationName = "Microsoft Office Excel" };
                    Workbook wb = new Workbook();
                    wb.Append(fileVersion);
                    Sheets sheets = null;

                    WorksheetPart sourceSheetPart = null;
                    
                    // add sheet
                    foreach (KeyValuePair<DateTime, string[,]> item in lst)
                    {
                        sheets = sheets ?? new Sheets();
                        var sheetId = sheets != null ? (uint)sheets.ChildElements.Count + 1 : 1;

                        using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(HttpContext.Current.Request.MapPath("~") + "TemplateFile\\Template.xlsx", true))
                        {
                            WorkbookPart workbookPart = spreadsheetDocument.WorkbookPart;
                            string rId = workbookPart.Workbook.Descendants<Sheet>().Where(s => s.Name.Value.Equals("sheet_name")).First().Id;

                            WorksheetPart wsPart = (WorksheetPart)workbookPart.GetPartById(rId);
                            try
                            {
                                workbookPart.ChangeIdOfPart(wsPart, "wsPart_" + sheetId);
                            }
                            catch
                            {
                                workbookPart.ChangeIdOfPart(wsPart, "rId1");
                                workbookPart.Workbook.Descendants<Sheet>().Where(s => s.Name.Value.Equals("sheet_name")).First().Id = "rId1";
                                workbookPart.ChangeIdOfPart(wsPart, "wsPart_" + sheetId);
                            }
                            workbookPart.Workbook.Descendants<Sheet>().Where(s => s.Name.Value.Equals("sheet_name")).First().Id = "wsPart_" + sheetId;
                            sourceSheetPart = wsPart;

                            WorksheetPart worksheetPart = workBookPart.AddPart<WorksheetPart>(sourceSheetPart);

                            Sheet copiedSheet = new Sheet
                            {
                                Name = item.Key.ToString("dd-MM-yyyy"),
                                Id = workBookPart.GetIdOfPart(worksheetPart)
                            };
                            copiedSheet.SheetId = sheetId;

                            sheets.Append(copiedSheet);
                            worksheetPart.Worksheet.GetFirstChild<SheetData>().UpdateSheetData(item.Key, item.Value);
                            workbookPart.ChangeIdOfPart(wsPart, "rId1");
                            workbookPart.Workbook.Descendants<Sheet>().Where(s => s.Name.Value.Equals("sheet_name")).First().Id = "rId1";
                        }
                    }
                    hasData = sheets != null;
                    if (sheets != null)
                    {
                        wb.Append(sheets);

                        //Save Changes
                        workBookPart.Workbook = wb;
                        wb.Save();
                        workBookPart.Workbook.Save();
                    }
                    spreadDocument.Close();
                }
                if (hasData)
                {

                    byte[] templateBytes = File.ReadAllBytes(template.FullName);
                    templateStream.Write(templateBytes, 0, templateBytes.Length);
                    var result = templateStream.ToArray();
                    templateStream.Position = 0;
                    templateStream.Flush();
                    try
                    {
                        if (!File.Exists(excelFile))
                        {
                            File.Delete(excelFile);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    return result;
                }
                else
                    return null;
            }
        }
        #endregion

        public static bool ReadAndWriteDataToExcel(this string filePath, bool isBC_QuanTrac)
        {
            bool response = true;
            using (SpreadsheetDocument spreadDocument = SpreadsheetDocument.Open(filePath, true))
            {
                WorkbookPart workBookPart = spreadDocument.WorkbookPart;
                Workbook workbook = workBookPart.Workbook;
                using (var db = new Models.DbEntities())
                {
                    using (DbContextTransaction transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            workBookPart.Workbook.Descendants<Sheet>().ForEach(sheet =>
                            {
                                if (response)
                                {
                                    WorksheetPart wsPart = (WorksheetPart)workBookPart.GetPartById(sheet.Id);
                                    SheetData sheetData = wsPart.Worksheet.GetFirstChild<SheetData>();

                                    bool res = sheetData.WriteDatabase(sheet.Name, workBookPart, db, isBC_QuanTrac);
                                    if (!res) response = false;
                                }
                            });
                            if (response)
                                transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            response = false;
                        }
                    }
                }
                    
            }
            return response;
        }

        #region phương thức xử lý 
        private static void UpdateSheetData(this SheetData sheetData, DateTime date, string[,] arr)
        {
            // update date
            Row headerTimeRow = sheetData.Elements<Row>().Where(r => r.RowIndex == 2).First();
            Cell headerTimeCell = headerTimeRow.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, 9.GetColumnName() + 2, true) == 0).First();
            headerTimeCell.UpdateText("Ngày " + date.ToString("dd/MM"));


            Row timeInfoRow = sheetData.Elements<Row>().Where(r => r.RowIndex == 5).First();
            Cell timeInfoCell = timeInfoRow.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, 2.GetColumnName() + 5, true) == 0).First();
            timeInfoCell.UpdateText("CHỈ TIÊU CHẤT LƯỢNG NƯỚC ĐO ĐẠC LÚC 9 GIỜ SÁNG NGÀY " + date.ToString("dd/MM/yyyy"));

            for (int i = 0; i < arr.GetLength(0); i++)
            {
                uint rowIndex = (uint)i + 6;
                Row row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();

                for (int j = 0; j < arr.GetLength(1); j++)
                {
                    try
                    {
                        string cellRef = (j + 3).GetColumnName() + rowIndex;
                        Cell cell = row.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, cellRef, true) == 0).First();
                        cell.UpdateText(arr[i, j]);
                    }
                    catch (Exception ex)
                    {
                        string excep = ex.Message;
                    }
                }
            }
        }

        private static void UpdateText(this Cell cell, string cellValue)
        {
            int resInt;
            double resDouble;
            DateTime resDate;

            try
            {
                if (int.TryParse(cellValue, out resInt))
                {
                    cell.CellValue = new CellValue(resInt.ToString());
                    cell.DataType = CellValues.String;
                }
                else if (double.TryParse(cellValue, out resDouble))
                {
                    cell.CellValue = new CellValue(resDouble.ToString());
                    cell.DataType = CellValues.String;
                }
                else if (DateTime.TryParse(cellValue, out resDate))
                {
                    cell.CellValue = new CellValue(resDate.ToString("dd/MM/yyyy"));
                    cell.DataType = CellValues.String;
                }
                else
                {
                    string text = cellValue == null ? "0" : cellValue.ToString();
                    cell.CellValue = new CellValue(text);
                    InlineString inlineString = new InlineString();
                    Text txt = new Text();
                    txt.Text = text;
                    inlineString.Append(txt);
                    cell.InlineString = inlineString;
                    cell.DataType = CellValues.InlineString;
                }
            }
            catch (Exception ex)
            {
                string excep = ex.Message;
            }
            
        }

        private static string GetColumnName(this int columnIndex)
        {
            int dividend = columnIndex;
            string columnName = string.Empty;
            int modifier;

            while (dividend > 0)
            {
                modifier = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modifier).ToString() + columnName;
                dividend = (int)((dividend - modifier) / 26);
            }

            return columnName;
        }

        private static bool WriteDatabase(this SheetData sheetData, string sheetName, WorkbookPart workBookPart, Models.DbEntities db, bool isBC_QuanTrac = true)
        {
            DateTime? datetime = sheetData.GetDateImportDb(workBookPart, sheetName);
            if (datetime == null)
                return false;
            bool response = false;

            db.Database.Log = Console.Write;
            bool isUpdate = isBC_QuanTrac 
                ? db.NV_DulieuQuantrac.Select(x => x.NgayQuantrac).Distinct()
                    .Any(row => DateTime.Compare(datetime.Value, row) == 0) 
                : db.NV_Dulieudubao.Select(x => x.Ngaydubao).Distinct()
                    .Any(row => DateTime.Compare(datetime.Value, row) == 0);

            var lstTT = db.NV_MaubaocaoThuoctinh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Thuoctinh_ID);
            var lstDD = db.NV_MaubaocaoDiadanh.Where(x => x.MauBC_ID.Equals("BC_CLN")).OrderBy(x => x.STT).Select(row => row.Diadanh_ID);
                
            int? rowIndex = null;
            int? colIndex = null;
            try
            {
                int? soLieuIndex = null;
                if (isBC_QuanTrac)
                {
                    var lastEntity = db.NV_DulieuQuantrac.AsEnumerable()
                        .Select(x => new { id = Convert.ToInt32(x.SolieuQuantrac_ID) })
                        .OrderByDescending(x => x.id).FirstOrDefault();
                    soLieuIndex = lastEntity == null ? 0 : lastEntity.id;
                }
                else
                {
                    var lastEntity = db.NV_Dulieudubao
                        .Select(x => new { id = Convert.ToInt32(x.SolieuDB_ID) })
                        .OrderByDescending(x => x.id).FirstOrDefault();
                    soLieuIndex = lastEntity == null ? 0 : lastEntity.id;
                }
                lstDD.AsEnumerable().ForEach(ref rowIndex, row =>
                {
                    colIndex = null;
                    lstTT.AsEnumerable().ForEach(ref colIndex, col =>
                    {
                        soLieuIndex = soLieuIndex ?? 0;
                        double value;
                        string val = sheetData.GetValueCell(workBookPart, rowIndex.Value + 6, colIndex.Value + 3);
                        if (string.IsNullOrEmpty(val) || !double.TryParse(val, out value))
                            value = 0;

                        if (isBC_QuanTrac)
                        {
                            if (isUpdate)
                            {
                                var isExits = db.NV_DulieuQuantrac.Any(res =>
                                        res.Thuoctinh_ID == col &&
                                        res.Diadanh_ID == row &&
                                        DateTime.Compare(datetime.Value, res.NgayQuantrac) == 0);
                                if (isExits)
                                {
                                    #region update du lieu quan trac
                                    var temp = db.NV_DulieuQuantrac.FirstOrDefault(res =>
                                    res.Thuoctinh_ID == col &&
                                    res.Diadanh_ID == row &&
                                    DateTime.Compare(datetime.Value, res.NgayQuantrac) == 0);
                                    temp.Giatri = value;
                                    #endregion
                                }
                                else
                                {
                                    #region add du lieu quan trac
                                    soLieuIndex++;
                                    Models.NV_DulieuQuantrac entity = new Models.NV_DulieuQuantrac()
                                    {
                                        SolieuQuantrac_ID = soLieuIndex.ToString(),
                                        NgayQuantrac = datetime.Value,
                                        Diadanh_ID = row,
                                        Thuoctinh_ID = col,
                                        Giatri = value
                                    };
                                    db.NV_DulieuQuantrac.Add(entity);
                                    #endregion
                                }
                            }
                            else
                            {
                                #region add du lieu quan trac
                                soLieuIndex++;
                                Models.NV_DulieuQuantrac entity = new Models.NV_DulieuQuantrac()
                                {
                                    SolieuQuantrac_ID = soLieuIndex.ToString(),
                                    NgayQuantrac = datetime.Value,
                                    Diadanh_ID = row,
                                    Thuoctinh_ID = col,
                                    Giatri = value
                                };
                                db.NV_DulieuQuantrac.Add(entity);
                                #endregion
                            }
                        }
                        else
                        {
                            if (isUpdate)
                            {
                                var isExits = db.NV_Dulieudubao.Any(res =>
                                        res.Thuoctinh_ID == col &&
                                        res.Diadanh_ID == row &&
                                        DateTime.Compare(datetime.Value, res.Ngaydubao) == 0);
                                if (isExits)
                                {
                                    #region update du lieu du bao
                                    var temp = db.NV_Dulieudubao.FirstOrDefault(res =>
                                        res.Thuoctinh_ID == col &&
                                        res.Diadanh_ID == row &&
                                        DateTime.Compare(datetime.Value, res.Ngaydubao) == 0
                                    );
                                    temp.Giatri = value;
                                    #endregion
                                }
                                else
                                {
                                    #region add du lieu du bao
                                    soLieuIndex++;
                                    Models.NV_Dulieudubao entity = new Models.NV_Dulieudubao()
                                    {
                                        SolieuDB_ID = soLieuIndex.ToString(),
                                        Ngaydubao = datetime.Value,
                                        Diadanh_ID = row,
                                        Thuoctinh_ID = col,
                                        Giatri = value
                                    };
                                    db.NV_Dulieudubao.Add(entity);
                                    #endregion
                                }
                            }
                            else
                            {
                                #region add du lieu du bao
                                soLieuIndex++;
                                Models.NV_Dulieudubao entity = new Models.NV_Dulieudubao()
                                {
                                    SolieuDB_ID = soLieuIndex.ToString(),
                                    Ngaydubao = datetime.Value,
                                    Diadanh_ID = row,
                                    Thuoctinh_ID = col,
                                    Giatri = value
                                };
                                db.NV_Dulieudubao.Add(entity);
                                #endregion
                            }
                        }

                        db.SaveChanges();
                    });
                });
                
                response = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error occurred: " + ex.StackTrace);
                response = false;
            }
            return response;
        }

        private static DateTime? GetDateImportDb(this SheetData sheetData, WorkbookPart workBookPart, string sheetName)
        {
            DateTime? datetime = sheetData.GetValueCell(workBookPart, 5, 2).Trim().Split(" ").AsEnumerable().Last().ConvertStringToDate();
            datetime = datetime.HasValue ? datetime : null;

            if (datetime == null)
            {
                DateTime? date = sheetName.ConvertStringToDate("dd-MM-yyyy");
                datetime = !date.HasValue ? datetime : date;
            }
            return datetime;
        }

        private static string GetValueCell(this SheetData sheetData, WorkbookPart workBookPart, int rowIndex, int colIndex)
        {
            Row row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();
            string rCell = colIndex.GetColumnName() + rowIndex;

            Cell cell = row.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, rCell, true) == 0).First();
            if (cell.DataType != null && cell.DataType.Value.Equals(CellValues.SharedString))
            {
                SharedStringItem item = GetSharedStringItemById(workBookPart, Convert.ToInt32(cell.CellValue.Text));
                return item.InnerText;
            }
            
            return cell.CellValue == null ? null : cell.CellValue.Text;
        }

        private static SharedStringItem GetSharedStringItemById(WorkbookPart workbookPart, int id)
        {
            return workbookPart.SharedStringTablePart.SharedStringTable.Elements<SharedStringItem>().ElementAt(id);
        }
        #endregion
    }
}