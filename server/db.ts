import sql from 'mssql'
import config from './config'
export const pool = new sql.ConnectionPool(config)
export const poolConnected =() => pool.connect()