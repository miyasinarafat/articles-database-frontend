import Document, { Html, Head, Main, NextScript } from 'next/document'
import axios from "../lib/axios";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body className={"bg-gray-100"}>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument

export async function getStaticProps() {
    const response = await axios.get('/api/user');

    return {
        props: {
            user: response.data.data
        },
    }
}