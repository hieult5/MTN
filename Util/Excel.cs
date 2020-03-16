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
                            worksheetPart.Worksheet.GetFirstChild<SheetData>().updateSheetData(item.Key, item.Value);
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

        private static void updateSheetData(this SheetData sheetData, DateTime date, string[,] arr)
        {
            // update date
            Row headerTimeRow = sheetData.Elements<Row>().Where(r => r.RowIndex == 2).First();
            Cell headerTimeCell = headerTimeRow.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, 9.getColumnName() + 2, true) == 0).First();
            headerTimeCell.updateText(9, Convert.ToInt32(headerTimeRow.RowIndex.Value), "Ngày " + date.ToString("dd/MM"));


            Row timeInfoRow = sheetData.Elements<Row>().Where(r => r.RowIndex == 5).First();
            Cell timeInfoCell = timeInfoRow.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, 2.getColumnName() + 5, true) == 0).First();
            timeInfoCell.updateText(2, Convert.ToInt32(headerTimeRow.RowIndex.Value), "CHỈ TIÊU CHẤT LƯỢNG NƯỚC ĐO ĐẠC LÚC 9 GIỜ SÁNG NGÀY " + date.ToString("dd/MM/yyyy"));

            for (int i = 0; i < arr.GetLength(0); i++)
            {
                uint rowIndex = (uint)i + 6;
                Row row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();

                for (int j = 0; j < arr.GetLength(1); j++)
                {
                    try
                    {
                        string cellRef = (j + 3).getColumnName() + rowIndex;
                        Cell cell = row.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, cellRef, true) == 0).First();
                        cell.updateText(j + 3, Convert.ToInt32(row.RowIndex.Value), arr[i, j]);
                    }
                    catch (Exception ex)
                    {
                        string excep = ex.Message;
                    }
                }
            }
        }

        private static void updateText(this Cell cell, int columnIndex, int rowIndex, string cellValue)
        {
            int resInt;
            double resDouble;
            DateTime resDate;

            try
            {
                if (int.TryParse(cellValue, out resInt))
                {
                    cell.CellValue = new CellValue(resInt.ToString());
                }
                else if (double.TryParse(cellValue, out resDouble))
                {
                    cell.CellValue = new CellValue(resDouble.ToString());
                }
                else if (DateTime.TryParse(cellValue, out resDate))
                {
                    cell.CellValue = new CellValue(resDate.ToString("dd/MM/yyyy"));
                }
                else
                {
                    cell.CellValue = new CellValue(cellValue.ToString());
                    cell.DataType = CellValues.String;
                }
            }
            catch (Exception ex)
            {
                string excep = ex.Message;
            }
            
        }

        private static string getColumnName(this int columnIndex)
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
    }
}