import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Nav from '../components/Nav'
import PostList from '../components/PostList'
import styles from '../styles/Home.module.scss'

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>grawiz</title>
				<meta name='description' content='graph builder' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Nav />
			<Header />
			<PostList />

			<Footer />
		</div>
	)
}
