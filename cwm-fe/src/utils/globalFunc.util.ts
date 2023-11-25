import { CURRENT_USER } from 'constants/auth.constant';
import * as fs from 'file-saver';
import ExcelJS from 'exceljs';

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const options = (array: any) => {
  return (
    array?.length > 0 &&
    array?.map((item: any) => {
      let o: any = {};
      o.value = item?.id;
      o.label = item?.name;
      return o;
    })
  );
};

const getDataExcel = (data: any, objectKey: any, fields: any) => {
  return data
    ?.map((item: any) => {
      let newItem: any = {};
      objectKey?.forEach((x: any) => {
        fields?.forEach((y: any) => {
          if (x === y.key) {
            newItem[x] = item[x];
          }
        });
      });
      return newItem;
    })
    ?.map((z: any) => {
      return fields?.map((item: any) => {
        return z[item.key];
      });
    });
};

const getFields = (columnTable: any) => {
  return columnTable
    ?.filter((x: any) => x?.show && x?.key !== 'action')
    ?.map((y: any) => ({ key: y.key, title: y.title, width: y.widthExcel }));
};

const addRow = (ws: any, data: any, section: any) => {
  const borderStyles = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  const row = ws.addRow(data);
  row.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
    if (section?.border) {
      cell.border = borderStyles;
    }
    if (section?.alignment) {
      cell.alignment = section.alignment;
    } else {
      cell.alignment = { vertical: 'middle' };
    }
    if (section?.font) {
      cell.font = section.font;
    }
    if (section?.fill) {
      cell.fill = section.fill;
    }
  });
  if (section?.height > 0) {
    row.height = section.height;
  }
  return row;
};

const mergeCells = (ws: any, row: any, from: any, to: any) => {
  ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`);
};

const getHeadersExcel = (data: any) => {
  const myHeader = data[0].map((item: any) => item.title);
  const widths = data[0].map((item: any) => ({ width: item.width }));
  const newData: any = data.slice(1, data?.length);
  return {
    myHeader,
    widths,
    newData,
  };
};

const exportToExcelPro = async (
  myData: any,
  fileName: any,
  sheetName: any,
  report: any,
  myHeader: any,
  widths: any
) => {
  if (!myData || myData.length === 0) {
    return;
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  const columns = myHeader?.length;

  const title = {
    border: true,
    height: 40,
    font: { size: 20, bold: false, color: { argb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: {
      type: 'pattern',
      pattern: 'solid', //darkVertical
      fgColor: {
        argb: '0000FF',
      },
    },
  };
  const header = {
    border: true,
    height: 0,
    font: { size: 12, bold: true, color: { argb: '000000' } },
    alignment: null,
    fill: null,
  };
  const data = {
    border: true,
    height: 0,
    font: { size: 12, bold: false, color: { argb: '000000' } },
    alignment: null,
    fill: null,
  };

  if (widths && widths.length > 0) {
    ws.columns = widths;
  }

  let row = addRow(ws, [report], title);
  mergeCells(ws, row, 1, columns);

  addRow(ws, myHeader, header);

  myData.forEach((row: any) => {
    addRow(ws, Object.values(row), data);
  });

  const buf = await wb.xlsx.writeBuffer();
  fs.saveAs(new Blob([buf]), `${fileName}.xlsx`);
};

const resolveDataExcel = (data: any, sheetName: string, columnTable: any) => {
  const fields: any = getFields(columnTable);
  const objectKey = Object.keys(data[0]);
  const newDatas: any = getDataExcel(data, objectKey, fields);
  const workSheetColumnName = fields?.map((item: any) => ({
    title: item?.title,
    width: item?.width,
  }));
  const workSheetName = sheetName;
  const fileName = `${sheetName} ${new Date()
    .toISOString()
    .substring(0, 10)}.xlsx`;
  const finalData: any = [workSheetColumnName, ...newDatas];
  const { myHeader, widths, newData } = getHeadersExcel(finalData);
  exportToExcelPro(
    newData,
    fileName,
    workSheetName,
    workSheetName,
    myHeader,
    widths
  );
};

const onChangeCheckbox = (
  item: any,
  e: any,
  columnTable: any,
  setColumnTable: any
) => {
  let newColumns: any = columnTable.map((column: any) => {
    if (item.title === column.title) {
      column.show = e.target.checked;
    }
    return column;
  });
  setColumnTable(newColumns);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER) || '');
};


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export {
  convertBase64,
  options,
  getDataExcel,
  getFields,
  addRow,
  mergeCells,
  getHeadersExcel,
  exportToExcelPro,
  resolveDataExcel,
  onChangeCheckbox,
  getCurrentUser,
  formatCurrency,
};
