import styles from "../styles/Nav.module.scss";

export default function Nav() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <svg
          width={41}
          height={41}
          viewBox="0 0 41 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.41596 1.41596C0 2.83193 0 5.11089 0 9.66882V31.0783C0 35.6362 0 37.9152 1.41596 39.3312C2.83193 40.7471 5.11089 40.7471 9.66882 40.7471H31.0783C35.6362 40.7471 37.9152 40.7471 39.3312 39.3312C40.7471 37.9152 40.7471 35.6362 40.7471 31.0783V9.66881C40.7471 5.11089 40.7471 2.83193 39.3312 1.41596C37.9152 0 35.6362 0 31.0783 0H9.66881C5.11089 0 2.83193 0 1.41596 1.41596ZM8.23932 11.382V28.1215H13.2153C14.3466 28.1215 15.3249 27.9074 16.1504 27.4794C16.9912 27.0361 17.6409 26.4246 18.0996 25.6449C18.5582 24.85 18.7875 23.9251 18.7875 22.8703V16.6102C18.7875 15.5554 18.5582 14.6382 18.0996 13.8585C17.6409 13.0789 16.9912 12.475 16.1504 12.047C15.3249 11.6037 14.3466 11.382 13.2153 11.382H8.23932ZM13.2153 25.4844H11.1057V14.019H13.2153C14.0408 14.019 14.6982 14.256 15.1874 14.7299C15.6765 15.1885 15.9211 15.8153 15.9211 16.6102V22.8703C15.9211 23.6805 15.6765 24.3226 15.1874 24.7965C14.6982 25.2551 14.0408 25.4844 13.2153 25.4844ZM25.2909 11.382L21.0716 28.1215H24.0067L24.924 24.0627H29.3726L30.2898 28.1215H33.2249L28.9827 11.382H25.2909ZM27.8362 17.2293L28.8451 21.7238H25.4514L26.4603 17.2064C26.6285 16.4726 26.7737 15.8076 26.896 15.2114C27.0183 14.5999 27.1024 14.1566 27.1483 13.8814C27.1941 14.1566 27.2782 14.5999 27.4005 15.2114C27.5228 15.8076 27.668 16.4803 27.8362 17.2293Z"
            fill="#42D7F8"
          />
        </svg>
      </div>
    </div>
  );
}
