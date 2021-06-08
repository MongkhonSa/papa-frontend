import { Response,Request } from "express"
import {Workbook} from 'exceljs'
import path from 'path'
import { pool } from "../db"
import dayjs from "dayjs"

const getIndex =(list:Array<any>,key:string) =>{
  return list.indexOf(key)
}

function convertToNumberingScheme(number:number) {
  var baseChar = ("A").charCodeAt(0),
      letters  = "";

  do {
    number -= 1;
    letters = String.fromCharCode(baseChar + (number % 26)) + letters;
    number = (number / 26) >> 0; // quick `floor`
  } while(number > 0);

  return letters;
}

const addLeadingZeror = (number:number) =>{
  return ("0"+number).substr(-2)
}

export const downloadXLSX = async(req:Request,res:Response)=> {
  try {
    const shiftRow = 7
    const selectedDate = dayjs(req.body.selectedDate).format('YYYY-MM-DD')
    const workbook = new Workbook()
    const wb  = await workbook.xlsx.readFile(path.join(__dirname,'../',`template/${req.body.report}.xlsx`))
    // set date 
    const tableDate = wb.worksheets[0].getCell('A2').value +selectedDate
    wb.worksheets[0].getCell('A2').value = tableDate
    const headerNames  = wb.worksheets[1].getColumn(2).values.slice(2) // A2
    const timeRanges  = wb.worksheets[0].getColumn(1).values.slice(shiftRow)
    .map(val=> {
      const twoDigitHour = addLeadingZeror(new Date(val as Date).getUTCHours())
      const twoDigitMinute = addLeadingZeror(new Date(val as Date).getUTCMinutes())
      const  time = `${twoDigitHour}:${twoDigitMinute}`
      return time
    }) //A7

    wb.removeWorksheet('TAG')
    
    const request = pool.request()
    const {recordset} =await request.query(`SELECT
        time_hour,
        CONVERT(VARCHAR(30), point_id) AS point_id,
        _VAL AS value
      FROM
        REPORT_TABLE AS t1
        INNER JOIN (
          SELECT
            DATEPART (HOUR,CONVERT(VARCHAR(30), timestamp)) AS time_hour,
            CONVERT(VARCHAR(30), point_id) AS min_point_id,
            MIN(CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp))) AS min_timestamp
          FROM
            REPORT_TABLE
          WHERE
            CAST(CONVERT(VARCHAR(30), timestamp) AS DATE) = '${selectedDate}'
          GROUP BY
            DATEPART (HOUR,
              CONVERT(VARCHAR(30), timestamp)),
            CONVERT(VARCHAR(30), point_id)) AS t2 
        ON CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp)) = t2.min_timestamp
      WHERE
        t2.min_timestamp = CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp))
        AND t2.min_point_id LIKE t1.point_id
      ORDER BY
        time_hour ASC`)

    recordset.forEach( async record=>{
      const colIndex =getIndex(headerNames,record.point_id)
      const rowIndex = getIndex(timeRanges,`${("0"+record.time_hour).substr(-2)}:00`)
      if(colIndex>-1){
        //FYI: we +2 because change array index to  execl excel column 
        const ref = `${convertToNumberingScheme(colIndex+2)}`+`${rowIndex+shiftRow}` 
        wb.worksheets[0].getCell(ref).value=record.value
      }
      
    })

      const buffer = await wb.xlsx.writeBuffer()
      res.send(buffer)
  } catch (error) {
    res.status(404).end()
  }
}