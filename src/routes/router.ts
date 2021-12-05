import express from 'express'
import mysql from 'mysql'

const router = express.Router()

router.get('/', (req, res) => {
  const localFlg: boolean = process.env.NODE_ENV === 'local' ? true : false
  const connection = mysql.createConnection({
    host: localFlg
      ? 'localhost'
      : 'new-goods-instance.c4gr8yy5e4ab.us-east-2.rds.amazonaws.com',
    user: localFlg ? 'root' : 'noma',
    password: 'Toeic900',
    database: 'convenience_store_info',
  })
  connection.connect((err: Error) => {
    if (err) {
      console.log('error connecting:' + err.stack)
      return
    }
    console.log('success')
  })

  type response = {
    id: number
    name: string
    title: string
    img: string
    href: string
    price: string
    date: string
    kcal: string
    caution: string
    release_date: string
  }

  const name = `WHERE name = '${req.query.name}'`
  const offset = `OFFSET ${req.query.offset}`

  const num = new Promise((resolve, reject) => {
    connection.query(
      `SELECT count(*) FROM new_goods ${name}`,
      (error, results: [{ 'count(*)': number }]) => {
        if (error) reject(error)
        resolve(results[0]['count(*)'])
      }
    )
  })
  const data = new Promise((resolve, reject) => {
    const mysqlQuery = `SELECT * FROM new_goods ${name} ORDER BY date DESC LIMIT 50 ${offset}`
    connection.query(mysqlQuery, (error, results: response[]) => {
      if (error) reject(error)
      // console.dir(results, { depth: null })
      resolve(results)
    })
  })
  Promise.all([num, data]).then((values) => {
    res.json({ num: values[0], data: values[1] })
  })
})

export default router