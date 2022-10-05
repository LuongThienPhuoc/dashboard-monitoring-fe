import React, { useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap"
import { message, Select } from "antd"
import { get } from "../../api/axios"
import URL from "../../api/config"
import ReactApexChart from "react-apexcharts"
import BalanceVUI from './components/BalanceVUI'
import TableVUI from './components/TableVUI'
const Option = Select.Option

/*eslint-disable */
export default function BrandCodeDash() {
    const [option1, setOption1] = useState("week")
    const [option2, setOption2] = useState("all")
    const [dayOfWeek, setDayOfWeek] = useState([])
    /*eslint-disable */
    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
    const arr = new Array(24).fill(0)
    const [type, setType] = useState("service")
    const [yourChoice, setYourChoice] = useState("")
    const [listDataByType, setListDataByType] = useState([])
    const [type1, setType1] = useState("week")
    const handleChange = (value) => {
        setOption1(value)
    }
    const handleChange1 = (value) => {
        setOption2(value)
    }
    useEffect(() => {
        const currentDay = new Date()
        const days = []
        days.push(
            `${currentDay.getDate()}/${currentDay.getMonth() + 1
            }/${currentDay.getFullYear()}`
        )
        for (let i = 1; i <= 6; i++) {
            const newDay = new Date()
            newDay.setDate(currentDay.getDate() - i)
            days.unshift(
                `${newDay.getDate()}/${newDay.getMonth() + 1}/${newDay.getFullYear()}`
            )
        }
        setDayOfWeek(days)
    }, [])

    useEffect(() => {
        setYourChoice("")
        const fetApi = async () => {
            await get(URL.URL_GET_DATA_STORE + `?type=${type}`).then(res => {
                setListDataByType(res.data.result)
            }).catch(err => {
                message.error(err.message)
            })
        }
        fetApi()
    }, [type])

    useEffect(() => {
        if (yourChoice.length !== 0) {
            if (option1 === "week") {
                setType1("week")
                get(URL.URL_GET_CONCRETE_DATA + `?dataType=${type}&value=${yourChoice}&options=${option1}`)
                    .then(res => {
                        setSeries1(res.data.vuiSpending)
                        setSeries2(res.data.vuiGiving)
                        const currentDay = new Date()
                        const arrCategories = []
                        arrCategories.push(
                            `${currentDay.getDate()}/${currentDay.getMonth() + 1
                            }/${currentDay.getFullYear()}`
                        )
                        for (let i = 1; i <= 6; i++) {
                            const newDay = new Date()
                            newDay.setDate(currentDay.getDate() - i)
                            arrCategories.unshift(
                                `${newDay.getDate()}/${newDay.getMonth() + 1}/${newDay.getFullYear()}`
                            )
                        }
                        setCategories(arrCategories)
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            } else if (option2 === "all") {
                setType1("day")
                get(URL.URL_GET_CONCRETE_DATA + `?dataType=${type}&value=${yourChoice}&options=day&day=${option1}`)
                    .then(res => {
                        setSeries1(res.data.vuiSpending)
                        setSeries2(res.data.vuiGiving)
                        setCategories(res.data.arrCate)
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            } else {
                setType1("hour")
                get(URL.URL_GET_CONCRETE_DATA + `?dataType=${type}&value=${yourChoice}&options=hour&day=${option1}&hour=${option2}`)
                    .then(res => {
                        setSeries1(res.data.vuiSpending)
                        setSeries2(res.data.vuiGiving)
                        const arr = new Array(60).fill(0)
                        const cate = arr.map((value, key) => {
                            return key
                        })
                        setCategories(cate)
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            }
        } else {
            setSeries1([])
            setSeries2([])
            setCategories([])
        }
    }, [yourChoice, option1, option2])

    const series = [
        {
            name: "Using VUI",
            data: series1
        },
        {
            name: "Giving VUI",
            data: series2
        }
    ]
    const state = {
        series,
        options: {
            chart: {
                type: "area",
                stacked: false,
                height: 700,
                width: 1400,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            // markers: {
            //     size: 0,
            //     style: "hollow",
            // },
            markers: {
                strokeWidth: 7,
                strokeOpacity: 1,
                strokeColors: ['#fff'],
                colors: ["#a0d911", "#ff4d4f"]
            },
            annotations: {
                yaxis: [
                    {
                        y: 30,
                        borderColor: "#999",
                        label: {
                            show: true,
                            text: "Time",
                            style: {
                                color: "#fff",
                                background: "#00E396"
                            }
                        }
                    }
                ],
                xaxis: [
                    {
                        borderColor: "#999",
                        yAxisIndex: 0,
                        label: {
                            show: true,
                            text: "VUI",
                            style: {
                                color: "#fff",
                                background: "#775DD0"
                            }
                        }
                    }
                ]
            },
            title: {
                text: "VUI Chart",
                align: "left"
            },
            stroke: {
                curve: "smooth"
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                }
            },
            colors: ["#a0d911", "#ff4d4f"],
            yaxis: {
                title: {
                    text: "Vui"
                }
            },
            xaxis: {
                categories
            },
            tooltip: {
                enabled: true,
                shared: true,
                y: {
                    formatter: function (val) {
                        return val
                    }
                },
                x: {
                    format: "dd/MM/yy HH:mm",
                    formatter: function (value) {
                        if (option1 === "week") {
                            return categories[value - 1]
                        } else if (option1 !== "weel" && option2 === "all") {
                            return `${option1} ${value - 1}:00`
                        } else {
                            return `${option1} ${option2}:${value}`
                        }
                    }
                }
            },
        }
    }

    const renderTitle = () => {
        let a = ""
        if (type === "service") {
            a = "Service"
        } else if (type === "brandCode") {
            a = "Brand"
        } else {
            a = "Store"
        }
        return `${a}: ${yourChoice ? yourChoice : "Please, chose something "}`
    }

    return (
        <div>
            <Row className='match-height'>
                <Col lg='12' sm='12'>
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ fontSize: "2rem" }}> 🚀 {renderTitle()}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div style={{ marginBottom: "20px" }} className="flex justify-start">
                                <Select
                                    value={type}
                                    style={{
                                        width: 120,
                                        marginRight: "12px"
                                    }}
                                    onChange={(value) => { setType(value) }}
                                >
                                    <Option value="service">Service</Option>
                                    <Option value="storeCode">Store</Option>
                                    <Option value="brandCode">Brand</Option>
                                </Select>
                                <Select
                                    onChange={(value) => { setYourChoice(value) }}
                                    value={yourChoice}
                                    style={{
                                        width: 240
                                    }}
                                >
                                    <Option value=""></Option>
                                    {
                                        listDataByType.map((value, index) => {
                                            return <Option value={value._id} key={index}>{value._id}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="flex justify-start">
                                <Select
                                    value={option1}
                                    style={{
                                        width: 120,
                                        marginRight: "12px"
                                    }}
                                    onChange={handleChange}
                                >
                                    <Option value="week">Week</Option>
                                    {dayOfWeek.map((value, index) => {
                                        return (
                                            <Option key={index} value={value}>
                                                {value}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select
                                    value={option2}
                                    style={{
                                        width: 120
                                    }}
                                    /*eslint-enable */
                                    disabled={option1 === "week"}
                                    onChange={handleChange1}
                                >
                                    <Option value="all">All</Option>
                                    {arr.map((value, key) => (
                                        <Option key={key} value={key}>{key}</Option>
                                    ))}
                                </Select>
                            </div>
                        </CardBody>
                        <CardBody>
                            <ReactApexChart
                                options={state.options}
                                series={state.series}
                                height={500}
                                type="area"
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Col xxl="7" xl="12" >
                    <Card>
                        <CardHeader>
                            <CardTitle>Table</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <TableVUI
                                using={series1}
                                type={type1}
                                day={option1}
                                hour={option2}
                                giving={series2}
                                service={type}
                                yourChoice={yourChoice}
                                categories={categories}
                            ></TableVUI>
                        </CardBody>
                    </Card>
                </Col>
                <Col xxl="5" xl="12"  >
                    <Card>
                        <CardHeader>
                            <CardTitle>Chart</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <BalanceVUI using={series1} giving={series2}></BalanceVUI>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
