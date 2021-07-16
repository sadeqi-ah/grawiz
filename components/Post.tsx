import React from 'react'
import styles from '@styles/Post.module.scss'
import Link from 'next/link'
import I from '@icons'

export type PostProps = {
	title: string
	categories: string[]
	url: string
	color: string
}

const Post: React.FC<PostProps> = ({ title, categories, url, color }) => {
	return (
		<div className={`col-lg-3 col-md-4 col-sm-6 ${styles.container}`}>
			<style jsx>{`
				.${styles.post}:hover {
					border: 2px solid ${color};
				}
				.${styles.post}:hover .${styles.category} {
					fill: ${color};
					color: ${color};
				}
				.${styles.title} {
					color: ${color};
				}
			`}</style>
			<div className={styles.post}>
				<Link href={url}>
					<a>
						<p className={styles.title}>{title}</p>
						<div className={styles.category}>
							<I name='Folder' />
							<ul>
								{categories.map(category => (
									<li>{category}</li>
								))}
							</ul>
						</div>
					</a>
				</Link>
			</div>
		</div>
	)
}

export default Post
