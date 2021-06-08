import Head from 'next/head'
import Image from 'next/image'
import ExportReport from '../components/ExportReport'
import styles from '../styles/Report.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>ระบบรายงานการประปาสำแล</title>
        <meta name="description" content="ระบบรายงานการประปาสำแล" />
      </Head>
      <div className={styles.titleBox}>
        <h2 className={styles.title}>ระบบรายงานการประปาสำแล</h2>

      </div>
      <main className={styles.main}>
      <div className={styles.logo}>
      <Image
        src="/mwa-logo.gif"
        width="500px"
        height="500px"
      />
      </div>
      <div className={styles.formBox}>
        <ExportReport/>
      </div>
       
      </main>
    </div>
  )
}
