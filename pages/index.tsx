import Head from 'next/head'
import ExportReport from '../components/ExportReport'
import styles from '../styles/Report.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>ระบบรายงานการประปาของลุงพล</title>
        <meta name="description" content="ระบบรายงานการประปาของลุงพล" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.titleBox}>
        <h2 className={styles.title}>ระบบรายงานการประปาของลุงพล</h2>

      </div>
      <main className={styles.main}>
      <div className={styles.logo}>
      <img
        src="/mwa-logo.gif"
        width="auto"
        height="auto"
      />
      </div>
      <div className={styles.formBox}>
        <ExportReport/>
      </div>
       
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}

    </div>
  )
}
