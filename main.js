// 页面内容
const Page = (props) => {
    const hash = window.location.hash.substring(1)
    const [type, setType] = React.useState(hash || 'all')
    const [list, setList] = React.useState([])

    const cacheArrRef = React.useRef({
        all: [],
        javascript: [],
        ruby: [],
        java: [],
        css: []
    })
    const listParamsRef = React.useRef({
        q: 'stars:>1',
        sort: 'stars',
        order: 'desc',
        page: 1,
        per_page: 10
    })

    // effect => type
    React.useEffect(() => {
        if (cacheArrRef.current[type].length > 0) {
            setList(cacheArrRef.current[type])
        } else {
            const queryStr = type == 'all' ? 'stars:>1' : `stars:>1 language:${type}`
            listParamsRef.current = { q: queryStr, sort: 'stars', order: 'desc', page: 1, per_page: 10 }

            netWork.axios.get('/search/repositories', { params: listParamsRef.current }).then(res => {
                res = res.items
                res[res.length - 1].isWatchScoll = true
                cacheArrRef.current[type] = res
                setList(res)
            })
            // Api.popular.getGithubSearchList(listParamsRef.current).then(res => {
            //     res[res.length - 1].isWatchScoll = true
            //     cacheArrRef.current[type] = res
            //     setList(res)
            // })
        }
    }, [type])

    function getMoreData(params) {
        listParamsRef.current = { ...listParamsRef.current, ...params }
        netWork.axios.get('/search/repositories', { params: listParamsRef.current }).then(res => {
            res = res.items
            res[res.length - 1].isWatchScoll = true
            const newList = [...list, ...res]
            cacheArrRef.current[type] = newList
            setList(newList)
        })

    }

    return (
        <div className='page-view mt-10'>
            <PageHead handleSetType={setType}></PageHead>
            <div className='flex flex-row flex-wrap justify-around'>
                {list.map((item, index) => {
                    return (
                        <CardItem
                            data={item}
                            index={index}
                            className='basis-[100%] sm:basis-[50%] md:basis-[33.3%] lg:basis-[25%]'
                            key={type + index}
                            isWatchScoll={item.isWatchScoll}
                            handleGetPopular={getMoreData}
                        ></CardItem>
                    )
                })}
            </div>
        </div>
    )
};


const PageHead = (props) => {
    const { handleSetType } = props
    const arr = [
        { name: 'All', type: 'all' },
        { name: 'JavsScript', type: 'javascript' },
        { name: 'Ruby', type: 'ruby' },
        { name: 'Java', type: 'java' },
        { name: 'Css', type: 'css' }
    ]
    function changeLan(type) {
        handleSetType(type)
    }

    return (
        <div className={`page-head flex_r`}>
            <ul className='flex_r' style={{ width: '300px' }}>
                {arr.map(item => {
                    return (
                        <li className='flex1 flex_r' key={item.type}>
                            <a
                                href={'#' + item.type}
                                onClick={() => {
                                    changeLan(item.type)
                                }}
                            >
                                {item.name}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const CardItem = (props) => {
    const { className, data, index, isWatchScoll = false, handleGetPopular } = props
    const itemRef = React.useRef(null)
    React.useEffect(() => {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const dom = entry.target
                    dom.src = dom.getAttribute('data-src')
                    if (isWatchScoll) {
                        const params = {
                            page: (index + 1) / 10 + 1
                        }
                        handleGetPopular(params)
                    }

                    imageObserver.unobserve(dom)
                }
            })
        })
        imageObserver.observe(itemRef.current)
    }, [isWatchScoll])

    return (
        <div className={`flex_c pr-[16px] mt-[16px] ${className}`}>
            <div className='bg-[#ddd] w-full px-3 py-3'>
                <div className='flex_c'>
                    <p className='text-[24px] py-3'>#{index + 1}</p>
                    <div className='w-[50vw] h-[50vw] sm:w-[30vw] sm:h-[30vw] md:w-[20vw] md:h-[20vw] lg:w-[15vw] lg:h-[15vw]'>
                        <img
                            ref={itemRef}
                            className='aspect-auto object-cover w-full h-full'
                            src='./assets/placeholder.png'
                            data-src={data.owner.avatar_url}
                            alt=''
                        />
                    </div>

                    <span className='text-[#ca3838] text-lg  mt-3 font-[600]'>{data.name}</span>
                </div>
                <div className='flex_c_s' style={{ width: '100%' }}>
                    <div className='flex_r_s mt5 px-2 font-[600]'>
                        <SvgIcon iconName='user' height='20px' width='20px' color='#ea873e'></SvgIcon>
                        <span>{data.name}</span>
                    </div>
                    <div className='flex_r_s mt5 px-2'>
                        <SvgIcon iconName='star' height='20px' width='20px' color='yellow'></SvgIcon>
                        <span>{data.stargazers_count} &nbsp;</span>
                        <span>stars</span>
                    </div>
                    <div className='flex_r_s mt5 px-2'>
                        <SvgIcon iconName='fork' height='20px' width='20px'></SvgIcon>
                        <span>{data.forks_count}&nbsp;</span>
                        <span>forks</span>
                    </div>
                    <div className='flex_r_s mt5 px-2'>
                        <SvgIcon iconName='dangerous' height='20px' width='20px' color='#e75d5d'></SvgIcon>
                        <span>{data.open_issues_count}&nbsp;</span>
                        <span>issues</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SvgIcon = ({ iconName, color = '#409EFF', width = '18px', height = '18px' }) => {
    return (
        <svg
            style={{
                width: width,
                height: height,
                position: 'relative',
                fill: 'currentColor',
                marginRight: '8px',
                verticalAlign: '-2px'
            }}
            aria-hidden='true'
        >
            <use xlinkHref={'#icon-' + iconName} fill={color} />
        </svg>
    )
}


// 将页面内容渲染到指定容器
ReactDOM.render(<Page />, document.querySelector("#app"));
