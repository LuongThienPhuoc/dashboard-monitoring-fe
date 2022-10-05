import React, { useState, useEffect } from 'react'
/*eslint-disable */
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap"
import { Select } from "antd"
import ReactApexChart from "react-apexcharts"
import TableVUI from './components/TableVUI'
import { get } from "../../api/axios"
import URL from "../../api/config"
import BalanceVUI from './components/BalanceVUI'
const Option = Select.Option

export default function Dashboard() {
    const [option1, setOption1] = useState("week")
    const [option2, setOption2] = useState("all")
    const [dayOfWeek, setDayOfWeek] = useState([])
    const arr = new Array(24).fill(0)
    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
    const [type, setType] = useState("week")

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

    const renderWeek = async () => {
        const response = await get(URL.URL_GET_DATA_WEEK)
        setSeries1(response.data.vuiSpending)
        setSeries2(response.data.vuiGiving)
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
    }

    const renderDay = async () => {
        const response = await get(URL.URL_GET_DATA_DAY + `?day=${option1}`)
        const arr = new Array(24).fill(0)
        setSeries1(response.data.vuiSpending)
        setSeries2(response.data.vuiGiving)
        const cate = arr.map((value, key) => {
            return key
        })
        setCategories(cate)
    }

    const renderHours = async () => {
        const response = await get(
            URL.URL_GET_DATA_HOURS + `?day=${option1}&hour=${option2}`
        )
        const arr = new Array(60).fill(0)
        setSeries1(response.data.vuiSpending)
        setSeries2(response.data.vuiGiving)
        const cate = arr.map((value, key) => {
            return key
        })
        setCategories(cate)
    }

    useEffect(() => {
        if (option1 === "week") {
            renderWeek()
            setType("week")
        } else if (option1 !== "week" && option2 === "all") {
            renderDay()
            setType("day")
        } else {
            setType("hour")
            renderHours()
        }
    }, [option1, option2])


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

    return (
        <div>
            <Row className='match-height'>
                <Col lg='12' sm='12'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kick start your project 🚀</CardTitle>
                        </CardHeader>
                        <CardBody>
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
                                type={type}
                                day={option1}
                                hour={option2}
                                giving={series2}
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
