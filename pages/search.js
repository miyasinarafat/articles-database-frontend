import Head from 'next/head'
import {useEffect, useState} from "react";
import axios from "../lib/axios";
import Label from "../components/label";
import Input from "../components/input";
import Button from "../components/button";
import useSWR from "swr";
import Select from "react-select";

export default function Home() {
    const [getArticles, setArticles] = useState(null);
    const [pageCount, setPageCount] = useState(1);
    const [query, setQuery] = useState('');
    const [uCategories, setUCategories] = useState([]);
    const [uSources, setUSources] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const {data: categories} = useSWR('/api/categories', () =>
        axios.get('/api/categories')
            .then(response => response.data.data),
    )

    const {data: sources} = useSWR('/api/sources', () =>
        axios.get('/api/sources')
            .then(response => response.data.data),
    )

    /** Categories setup */
    let mapCategories = [];
    for (let i = 0; i < categories?.length; i++) {
        let category = categories[i];
        mapCategories.push({value: category.id, label: category.name})
    }

    /** Sources setup */
    let mapSources = [];
    for (let i = 0; i < sources?.length; i++) {
        let source = sources[i];
        mapSources.push({value: source.id, label: source.name})
    }

    useEffect(() => {

    }, []);

    const handleUCategoriesChange = async (e) => {
        setUCategories(Array.isArray(e) ? e.map((item) => item.value) : []);
    };

    const handleUSourcesChange = async (e) => {
        setUSources(Array.isArray(e) ? e.map((item) => item.value) : []);
    };

    const submitSearch = async (event) => {
        event?.preventDefault();

        const response = await axios.get('/api/search', {params: {
            page: pageCount,
            query: query,
            filter: {
                categories: uCategories,
                sources: uSources,
                fromArticleDate: fromDate,
                toArticleDate: toDate,
            },
        }})
        setArticles(response.data.data)
    }

    return (
        <>
            <Head>
                <title>Search Articles</title>
            </Head>

            <form onSubmit={submitSearch} autoComplete="off" className="mb-20">
                <div>
                    <Label htmlFor="search" className="block text-sm font-medium text-gray-700">Search for articles</Label>

                    <Input
                        id="search"
                        type="text"
                        value={query}
                        className="t-1 block w-full rounded-md border-gray-300 py-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={event => setQuery(event.target.value)}
                        required
                        autoFocus
                        autoComplete="off"
                        placeholder="query..."
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                            Select categories
                        </label>
                        <Select
                            id="categories"
                            className="t-1 block w-full rounded-md border-gray-300 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            options={mapCategories}
                            onChange={handleUCategoriesChange}
                            isMulti/>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="sources" className="block text-sm font-medium text-gray-700">
                            Select sources
                        </label>
                        <Select
                            id="sources"
                            className="t-1 block w-full rounded-md border-gray-300 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            options={mapSources}
                            onChange={handleUSourcesChange}
                            isMulti/>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                            Select from date
                        </label>
                        <Input
                            id="fromDate"
                            type="date"
                            value={fromDate}
                            className="t-1 block w-full rounded-md border-gray-300 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={event => setFromDate(event.target.value)}
                            required
                            autoFocus
                            autoComplete="off"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                            Select to date
                        </label>
                        <Input
                            id="toDate"
                            type="date"
                            value={toDate}
                            className="t-1 block w-full rounded-md border-gray-300 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={event => setToDate(event.target.value)}
                            required
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <Button style={{display: 'block' }} className="ml-3 w-1/3 text-center">Search</Button>
                </div>
            </form>

            {getArticles?.list.map((article, index) => (
                <div key={article.id} className={`flex ${index + 1 == getArticles.list.length ? '' : 'pb-10 mb-10 border-b'}`}>
                    <div className="w-1/3 h-56 relative overflow-hidden rounded-lg">
                        <img src={article.imageUrl ? article.imageUrl : 'https://loremflickr.com/640/360'} className="object-cover w-full h-full"></img>
                    </div>

                    <div className="w-full pl-14">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">{article.title}</h1>
                            <span className="block font-semibold">{article.publishedAt}</span>
                        </div>
                        <p className="leading-loose mb-5">
                            {article.content}
                        </p>
                        <a target="_blank" href={article.sourceUrl} className="text-purple-600 font-bold">Visit source</a>
                    </div>
                </div>
            ))}

            {getArticles?.paginate.total > 15 ? <nav
                className="flex items-center justify-between border-t border-t-2 mt-10 px-4 py-3 sm:px-6"
                aria-label="Pagination"
            >
                <div className="flex flex-1 justify-between sm:justify-end">
                    <button
                        onClick={() => {
                            setPageCount((prevState) => prevState - 1)
                            submitSearch();
                        }}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            setPageCount((prevState) => prevState + 1)
                            submitSearch();
                        }}
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
