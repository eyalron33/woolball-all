import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                Built on a 🥶 November night <strong>using frozen fingers</strong> © {new Date().getFullYear()}
            </p>
            <p>
                <a href="httpshttps://neimanslab.org/" target="_blank" rel="noopener noreferrer">
                    Read more weird stuff on Neiman's Lab 🕸️
                </a>
            </p>
            <p>
                Executing dumb ideas beautifully since 1999.
            </p>
        </footer>
    );
};

export default Footer;
