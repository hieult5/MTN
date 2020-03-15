using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SOE.Util
{
    class OpenXMLCopySheet
    {
        private static int tableId;

        public static void CopySheet(string filename, string sheetName, string clonedSheetName, string destFileName)
        {

            //Open workbook
            using (SpreadsheetDocument mySpreadsheet = SpreadsheetDocument.Open(filename, true))
            {
                WorkbookPart workbookPart = mySpreadsheet.WorkbookPart;
                //Get the source sheet to be copied
                WorksheetPart sourceSheetPart = GetWorkSheetPart(workbookPart, sheetName);
                SharedStringTablePart sharedStringTable = workbookPart.SharedStringTablePart;
                //Take advantage of AddPart for deep cloning
                using (SpreadsheetDocument newXLFile = SpreadsheetDocument.Create(destFileName, SpreadsheetDocumentType.Workbook))
                {
                    WorkbookPart newWorkbookPart = newXLFile.AddWorkbookPart();
                    SharedStringTablePart newSharedStringTable = newWorkbookPart.AddPart<SharedStringTablePart>(sharedStringTable);
                    WorksheetPart newWorksheetPart = newWorkbookPart.AddPart<WorksheetPart>(sourceSheetPart);
                    //Table definition parts are somewhat special and need unique ids...so let's make an id based on count
                    int numTableDefParts = sourceSheetPart.GetPartsCountOfType<TableDefinitionPart>();
                    tableId = numTableDefParts;

                    //Clean up table definition parts (tables need unique ids)
                    if (numTableDefParts != 0)
                        FixupTableParts(newWorksheetPart, numTableDefParts);
                    //There should only be one sheet that has focus
                    CleanView(newWorksheetPart);

                    var fileVersion = new FileVersion { ApplicationName = "Microsoft Office Excel" };

                    //Worksheet ws = newWorksheetPart.Worksheet;
                    Workbook wb = new Workbook();
                    wb.Append(fileVersion);

                    //Add new sheet to main workbook part
                    Sheets sheets = null;
                    //int sheetCount = wb.Sheets.Count();
                    if (wb.Sheets != null)
                    { sheets = wb.GetFirstChild<Sheets>(); }
                    else
                    { sheets = new Sheets(); }

                    Sheet copiedSheet = new Sheet
                    {
                        Name = clonedSheetName,
                        Id = newWorkbookPart.GetIdOfPart(newWorksheetPart)
                    };
                    if (wb.Sheets != null)
                    { copiedSheet.SheetId = (uint)sheets.ChildElements.Count + 1; }
                    else { copiedSheet.SheetId = 1; }

                    sheets.Append(copiedSheet);
                    newWorksheetPart.Worksheet.Save();

                    wb.Append(sheets);
                    //Save Changes
                    newWorkbookPart.Workbook = wb;
                    wb.Save();
                    newXLFile.Close();
                }
            }
        }
        static void CleanView(WorksheetPart worksheetPart)
        {
            //There can only be one sheet that has focus
            SheetViews views = worksheetPart.Worksheet.GetFirstChild<SheetViews>();

            if (views != null)
            {
                views.Remove();
                worksheetPart.Worksheet.Save();
            }
        }

        static void FixupTableParts(WorksheetPart worksheetPart, int numTableDefParts)
        {
            //Every table needs a unique id and name
            foreach (TableDefinitionPart tableDefPart in worksheetPart.TableDefinitionParts)
            {
                tableId++;
                tableDefPart.Table.Id = (uint)tableId;
                tableDefPart.Table.DisplayName = "CopiedTable" + tableId;
                tableDefPart.Table.Name = "CopiedTable" + tableId;
                tableDefPart.Table.Save();
            }
        }
        static WorksheetPart GetWorkSheetPart(WorkbookPart workbookPart, string sheetName)
        {
            //Get the relationship id of the sheetname
            string relId = workbookPart.Workbook.Descendants<Sheet>()
                .Where(s => s.Name.Value.Equals(sheetName))
                .First()
                .Id;

            return (WorksheetPart)workbookPart.GetPartById(relId);
        }
    }
}