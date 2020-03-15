using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace MTN.Util
{
    public class Excel
    {
        public static string getCopyExcelTemplateFile(string path)
        {
            string
                newFile = Guid.NewGuid() + "Excel.xlsx",
                rootPath = HttpContext.Current.Request.MapPath("~"),
                templateFile = rootPath + path,
                tempFile = Path.GetDirectoryName(templateFile) + "\\" + newFile;

            // coppy excel file
            File.Copy(templateFile, tempFile, true);
            return tempFile;
        }

        public static byte[] WriteExcel(Dictionary<DateTime, string[,]> lst, string excelFile, string path)
        {
            var template = new FileInfo(excelFile);
            using (var templateStream = new MemoryStream())
            {
                using (SpreadsheetDocument spreadDocument = SpreadsheetDocument.Open(excelFile, true))
                {
                    WorkbookPart workBookPart = spreadDocument.WorkbookPart;
                    Workbook workbook = workBookPart.Workbook;
                    string id;
                    using (SpreadsheetDocument newXLFile = SpreadsheetDocument.Open(HttpContext.Current.Request.MapPath("~") + path, true))
                    {
                        WorkbookPart wookbookP = newXLFile.WorkbookPart;
                        string relId = wookbookP.Workbook.Descendants<Sheet>().Where(s => s.Name.Value.Equals("sheet_name")).First().Id;
                        WorksheetPart sourceSheetPart = (WorksheetPart)wookbookP.GetPartById(relId);
                        WorksheetPart worksheetPart = workBookPart.AddPart<WorksheetPart>(sourceSheetPart);
                        id = workBookPart.GetIdOfPart(worksheetPart);
                    }

                    var fileVersion = new FileVersion { ApplicationName = "Microsoft Office Excel" };
                    Workbook wb = new Workbook();
                    wb.Append(fileVersion);
                    Sheets sheets = null;

                    foreach (KeyValuePair<DateTime, string[,]> item in lst)
                    {
                        sheets = sheets ?? new Sheets();

                        Sheet copiedSheet = new Sheet
                        {
                            Name = item.Key.ToString("dd-MM-yyyy"),
                            Id = id
                        };

                        copiedSheet.SheetId = sheets != null ? (uint)sheets.ChildElements.Count + 1 : 1;

                        sheets.Append(copiedSheet);

                    }
                    wb.Append(sheets);
                    //Save Changes
                    workBookPart.Workbook = wb;
                    wb.Save();
                    workBookPart.Workbook.Save();

                    Sheet sheet = workBookPart.Workbook.Sheets.GetFirstChild<Sheet>();
                    //sheet.Name = ...
                    Worksheet worksheet = (spreadDocument.WorkbookPart.GetPartById(sheet.Id.Value) as WorksheetPart).Worksheet;

                    //SheetData sheetData = worksheet.GetFirstChild<SheetData>();
                    //setSheetData(sheetData, lst.First().Value);
                    int? index = null;
                    worksheet.ChildElements.Cast<SheetData>().ForEach(ref index,
                        sheetData =>
                        {
                            string[,] arr = lst.Values.ToArray()[index.Value];
                            setSheetData(sheetData, arr);
                        });
                    spreadDocument.WorkbookPart.Workbook.Save();
                    spreadDocument.Close();
                }
                byte[] templateBytes = File.ReadAllBytes(template.FullName);
                templateStream.Write(templateBytes, 0, templateBytes.Length);
                templateStream.Position = 0;
                var result = templateStream.ToArray();
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
                    
                }
                return result;
            }
        }

        private static void setSheetData(SheetData sheetData, string[,] arr)
        {
            for (int i = 0; i < arr.GetLength(0); i++)
            {
                Row header = new Row();
                header.RowIndex = (uint)i + 6;

                for (int j = 0; j < arr.GetLength(1); j++)
                {
                    Cell headerCell = createTextCell(j + 1, Convert.ToInt32(header.RowIndex.Value), arr[i, j]);
                    header.AppendChild(headerCell);
                }

                sheetData.AppendChild(header);
            }
        }

        private static Cell createTextCell(int columnIndex, int rowIndex, string cellValue)
        {
            Cell cell = new Cell();
            cell.CellReference = getColumnName(columnIndex) + rowIndex;
            int resInt;
            double resDouble;
            DateTime resDate;

            if (int.TryParse(cellValue, out resInt))
            {
                CellValue v = new CellValue();
                v.Text = resInt.ToString();
                cell.AppendChild(v);
            }
            else if (double.TryParse(cellValue, out resDouble))
            {
                CellValue v = new CellValue();
                v.Text = resDouble.ToString();
                cell.AppendChild(v);
            }
            else if (DateTime.TryParse(cellValue, out resDate))
            {
                cell.DataType = CellValues.InlineString;
                InlineString inlineString = new InlineString();
                Text txt = new Text();

                txt.Text = resDate.ToString("dd/MM/yyyy");
                inlineString.AppendChild(txt);
                cell.AppendChild(inlineString);
            }
            else
            {
                cell.DataType = CellValues.InlineString;
                InlineString inlineString = new InlineString();
                Text txt = new Text();

                txt.Text = cellValue == null ? "" : cellValue.ToString();
                inlineString.AppendChild(txt);
                cell.AppendChild(inlineString);
            }
            return cell;
        }

        private static string getColumnName(int columnIndex)
        {
            int dividend = columnIndex;
            string columnName = string.Empty;
            int modifier;

            while(dividend > 0)
            {
                modifier = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modifier).ToString() + columnName;
                dividend = (int)((dividend - modifier) / 26);
            }

            return columnName;
        }
    }
}