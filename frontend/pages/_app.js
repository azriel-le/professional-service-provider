import '../styles/App.css'; // Use relative path // Ensure you import global styles if needed

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
