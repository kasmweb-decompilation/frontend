import React, { useState, useEffect, useRef, Fragment } from "react";
import { Combobox } from '@headlessui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/pro-light-svg-icons";
import pagelist from "./pages.json"
import getUserNavigationBarItems from "../Sidebar/getUserNavigationBar";
import { useTranslation } from "react-i18next";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export function Search(props) {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(true)
    const [focused, setFocused] = useState(false)
    const onFocus = () => {
        setFocused(true)
        setOpen(true)
    }
    const onBlur = () => setTimeout(() => { searchInput.current.blur(); setFocused(false) }, 250)
    const searchInput = React.useRef(null)
    const { t } = useTranslation('common');

    const items = getUserNavigationBarItems();

    let pages = []
    const navPages = ({ items, parent = '', parentKeywords = [] }) => {
        items.forEach((page, index) => {
            let keywords = [
                ...parentKeywords
            ]
            if (page.name) {
                keywords.push(page.name.toLowerCase())
            }
            const additionalKeywords = pagelist.find(p => p.id === page.url)
            if (additionalKeywords) {
                const additional = additionalKeywords.keywords.map((word) => {
                    return t(word).toLowerCase()
                })
                keywords = [
                    ...keywords,
                    ...additional
                ]
            }

            if (page.children) {
                navPages({ items: page.children, parent: parent + ' ' + page.name + ' / ', parentKeywords: keywords })
            } else {
                pages.push({
                    id: page.url,
                    name: parent + page.name,
                    location: page.url,
                    keywords
                })
            }
        })
    }
    navPages({ items })


    const filteredPeople =
        query === ''
            ? []
            : pages && pages.filter((page) => {
                // return page.name.toLowerCase().includes(query.toLowerCase())
                return page.keywords.some((keyword) => {
                    return keyword.toLowerCase().includes(query.toLowerCase())
                })
            })

    const getRecentList = JSON.parse(window.localStorage.getItem("recent_search")) || []
    const recentList = [
        ...getRecentList
    ]

    let recent = []
    recentList.forEach((r) => {
        const page = pages.find(page => r === page.id)
        if (page) {
            recent.push(page)
        }
    })

    const goToPage = (page) => {
        let recent = [
            ...getRecentList
        ]
        const search = recent.findIndex(r => r === page.id)
        if (search !== -1) {
            recent.unshift(recent.splice(search, 1)[0])
        } else {
            recent = [
                page.id,
                ...recent
            ]
        }
        const newrecent = recent.slice(0, 5)
        window.localStorage.setItem("recent_search", JSON.stringify(newrecent));
        props.history.push(page.location)
        setQuery('')
    }

    return <Combobox onChange={goToPage}>
        <div className="tw-relative">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-h-4 tw-w-4 tw-text-gray-400" aria-hidden="true" />
            <Combobox.Input
                name="searchfornav"
                className="tw-h-12 tw-w-full tw-border-0 tw-bg-transparent !tw-pl-11 tw-pr-4 placeholder:tw-text-gray-400 focus:tw-ring-0 sm:tw-text-sm"
                placeholder="Search..."
                ref={searchInput}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(event) => setQuery(event.target.value)}
            />
        </div>
        {focused && (
            <Combobox.Options static className={classNames("tw-max-h-72 tw-list-none scroll-py-2 tw-px-3 tw-overflow-y-auto tw-text-color tw-text-sm tw-rounded tw-absolute tw-left-3 tw-right-3 tw-backdrop-blur-lg tw-shadow-lg tw-z-50 tw-bg-[image:var(--bg)]",)}>
                {query !== '' && (
                    <div className="tw-py-2">
                        {filteredPeople.length > 0 && filteredPeople.map((page) => (
                            <Combobox.Option
                                key={page.id}
                                value={page}
                                className={({ active }) =>
                                    classNames('tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-rounded', active && 'tw-bg-blue-500 tw-text-white')
                                }
                            >
                                {page.name}
                            </Combobox.Option>
                        ))}
                    </div>
                )}
                {query === '' && recent && recent.length > 0 && (
                    <div className="tw-py-2">
                        <h2 className="tw-mb-2 tw-mt-4 tw-px-3 tw-text-xs tw-font-bold text-muted">Recent searches:</h2>
                        {query === '' && recent.length > 0 && recent.map((page) => (
                            <Combobox.Option
                                key={page.id}
                                value={page}
                                className={({ active }) =>
                                    classNames('tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-rounded', active && 'tw-bg-blue-500 tw-text-white')
                                }
                            >
                                {page.name}
                            </Combobox.Option>
                        ))}
                    </div>
                )}
            </Combobox.Options>

        )}
        {focused && query !== '' && filteredPeople.length === 0 && (
            <p className="tw-p-4 tw-text-sm tw-text-gray-500 tw-absolute tw-left-3 tw-right-3 tw-backdrop-blur-lg tw-shadow-lg tw-z-50 tw-bg-[image:var(--bg)]">No pages found.</p>
        )}
    </Combobox>
}