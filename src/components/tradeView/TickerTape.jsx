import { TickerTape as Tap } from "react-tradingview-embed";

function TickerTap() {
    const styles = {
        parent: {
            fontSize: "24px",
            color: "red",
        },
        link: {
            textDecoration: "line-trough",
        },
        span: {
            color: "darkblue",
        },
    };

    return <Tap colorTheme="dark" copyrightStyles={styles} />;
}

export default TickerTap;
