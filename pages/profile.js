import Head from 'next/head'
import Link from 'next/link'
import axios from "../lib/axios";
import useAuth from "../lib/useAuth";
import useSWR from "swr";
import Select from "react-select";
import {useState, useEffect} from "react";
import Button from "../components/button";

export default function Profile() {
    const [uCategories, setUCategories] = useState([]);
    const [uSources, setUSources] = useState([]);
    const [uAuthors, setUAuthors] = useState([]);

    const {user} = useAuth({middleware: 'auth'})

    const {data: categories} = useSWR('/api/categories', () =>
        axios.get('/api/categories')
            .then(response => response.data.data),
    )

    const {data: sources} = useSWR('/api/sources', () =>
        axios.get('/api/sources')
            .then(response => response.data.data),
    )

    const {data: authors} = useSWR('/api/authors', () =>
        axios.get('/api/authors')
            .then(response => response.data.data),
    )

    /** Categories setup */
    let defaultCategories = [];
    let mapCategories = [];
    for (let i = 0; i < categories?.length; i++) {
        let category = categories[i];
        mapCategories.push({value: category.id, label: category.name})
    }
    for (let i = 0; i < user?.settings?.categories?.length; i++) {
        let id = user.settings.categories[i];
        let category = categories?.find(c => c.id === id);

        if (category) {
            defaultCategories.push({value: category.id, label: category.name})
        }
    }

    /** Sources setup */
    let mapSources = [];
    let defaultSources = [];
    for (let i = 0; i < sources?.length; i++) {
        let source = sources[i];
        mapSources.push({value: source.id, label: source.name})
    }
    for (let i = 0; i < user?.settings?.sources?.length; i++) {
        let id = user.settings.sources[i];
        let source = sources?.find(c => c.id === id);

        if (source) {
            defaultSources.push({value: source.id, label: source.name})
        }
    }

    /** Authors setup */
    let mapAuthors = [];
    let defaultAuthors = [];
    for (let i = 0; i < authors?.length; i++) {
        let author = authors[i];
        mapAuthors.push({value: author.id, label: author.name})
    }
    for (let i = 0; i < user?.settings?.authors?.length; i++) {
        let id = user.settings.authors[i];
        let author = authors?.find(c => c.id === id);

        if (author) {
            defaultAuthors.push({value: author.id, label: author.name})
        }
    }

    const handleUCategoriesChange = async (e) => {
        setUCategories(Array.isArray(e) ? e.map((item) => item.value) : []);
    };

    const handleUSourcesChange = async (e) => {
        setUSources(Array.isArray(e) ? e.map((item) => item.value) : []);
    };

    const handleUAuthorsChange = async (e) => {
        setUAuthors(Array.isArray(e) ? e.map((item) => item.value) : []);
    };

    const submitForm = async (event) => {
        event?.preventDefault();

        await axios.put('/api/user/settings', {
            'categories': uCategories,
            'sources': uSources,
            'authors': uAuthors,
        }).then(response => response.data.data)
    }

    if (!user) {
        return <>Loading...</>
    }

    return (
        <>
            <Head>
                <title>ArticlesDatabase — Account</title>
            </Head>

            <h1 className="text-3xl font-black mb-10">
                Hello {user.name}!
            </h1>

            <div className="mb-5">
                <strong>Update your preferences:</strong>
            </div>

            <form onSubmit={submitForm} autoComplete="off">
                <div>
                    <div className="w-1/2">
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                            Select categories
                        </label>
                        <Select
                            id="categories"
                            className="t-1 block w-full rounded-md border-gray-300 py-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            options={mapCategories}
                            defaultValue={defaultCategories}
                            onChange={handleUCategoriesChange}
                            isMulti/>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="sources" className="block text-sm font-medium text-gray-700">
                            Select sources
                        </label>
                        <Select
                            id="sources"
                            className="t-1 block w-full rounded-md border-gray-300 py-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            options={mapSources}
                            defaultValue={defaultSources}
                            onChange={handleUSourcesChange}
                            isMulti/>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
                            Select authors
                        </label>
                        <Select
                            id="authors"
                            className="t-1 block w-full rounded-md border-gray-300 py-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            options={mapAuthors}
                            defaultValue={defaultAuthors}
                            onChange={handleUAuthorsChange}
                            isMulti/>
                    </div>
                    <Button className="mt-3">Update</Button>
                </div>
            </form>


        </>
    )
}
