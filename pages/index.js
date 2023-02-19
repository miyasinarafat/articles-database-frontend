import Head from 'next/head'
import {useEffect, useState} from "react";
import axios from "../lib/axios";

export default function Home({ articles }) {
    const [getArticles, setArticles] = useState(null);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        setArticles(articles);
    }, [articles]);

    const getFeedsByPage = async (page) => {
        const response = await axios.get('/api/feed', {params: {page}})
        setArticles(response.data.data)
    }
    const nextPage = async () => {
        await getFeedsByPage(pageCount + 1)
        setPageCount(pageCount + 1)

    }
    const previousPage = async () => {
        await getFeedsByPage(pageCount - 1)
        setPageCount(pageCount - 1)
    }

    return (
        <>
            <Head>
                <title>Articles Database</title>
            </Head>

            {getArticles?.list.map((article, index) => (
                <div key={article.id} className={`flex ${index + 1 == getArticles.list.length ? '' : 'pb-10 mb-10 border-b'}`}>
                    <div className="w-1/3 h-56 relative overflow-hidden rounded-lg">
                        <img src={article.imageUrl ? article.imageUrl : 'https://loremflickr.com/640/360'} className="object-cover w-full h-full"></img>
                    </div>

                    <div className="w-full pl-14">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-bold">{article.title}</h1>
                            <span className="block font-semibold">{article.publishedAt}</span>
                        </div>
                        <p className="leading-loose mb-5">
                            {article.content}
                        </p>
                        <a target="_blank" href={article.sourceUrl}
                           rel="noreferrer"
                           className="text-purple-600 font-bold">Visit source</a>
                    </div>
                </div>
            ))}

            {getArticles?.paginate.total > 15 ? <nav
                className="flex items-center justify-between px-4 py-3 sm:px-6"
                aria-label="Pagination"
            >
                <div className="flex flex-1 justify-between sm:justify-end">
                    <button
                        onClick={() => previousPage()}
                        disabled={pageCount <= 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => nextPage()}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </nav>
            :  ''}
        </>
    )
}
export async function getStaticProps() {
    const response = await axios.get('/api/feed');

    return {
        props: {
            articles: response.data.data
        },
    }
}
