import React, { useEffect, useState, useRef } from "react"
import ReactApexChart from "react-apexcharts"
import { getAccessToken } from "../../helper/Cookies"
import TableVUI from "./components/TableVUI"
import socketIOClient from "socket.io-client"
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap"
import BalanceVUI from "./components/BalanceVUI"
import URL from "../../api/config"
import { Select } from "antd"

const Option = Select.Option
/*eslint-disable */
import { get } from "../../api/axios"
const host = "http://localhost:5050"

export default function RealtimeDash() {
    const arr = new Array(168).fill(0)
    const [option, setOption] = useState(8)
    const socketRef = useRef()
    useEffect(() => {
        // Connect socket
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.on("connect", function () {
            socketRef.current.emit("authenticate", { token: getAccessToken() })
        })
        socketRef.current.on("getData", (data) => {
            let now = new Date().getTime() - 1000 * 60
            let now1 = new Date(now)
            let last = new Date(categories[categories.length - 1])

            if (
                now1.getSeconds() === last.getSeconds() &&
                now1.getMinutes() === last.getMinutes() &&
                now1.getHours() === last.getHours()
            ) {
                setSeries1((prev) => {
                    prev[prev.length - 1] = data.vuiSpending
                    return [...prev]
                })
                setSeries2((prev) => {
                    prev[prev.length - 1] = data.vuiGiving
                    return [...prev]
                })
            } else {
                setSeries1((prev) => {
                    return [...prev.slice(0), data.vuiSpending]
                })
                setSeries2((prev) => {
                    return [...prev.slice(0), data.vuiGiving]
                })
                setCategories((prev) => {
                    return [...prev.slice(0), now]
                })
            }
        })

        //
        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    useEffect(() => {
        const getAllData = () => {
            get(URL.URL_GET_ALL_DATA + `?time=${option}`)
                .then((res) => {
                    setCategories(res.data.arrCate)
                    setSeries2(res.data.Giving)
                    setSeries1(res.data.Using)
                })
                .catch((err) => {
                    alert(err.message)
                })
        }
        getAllData()
    }, [option])

    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
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
                zoom: {
                    type: "x",
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: "zoom"
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
                style: "hollow"
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
                type: "datetime",
                categories,
                // axisBorder: {
                //     show: true
                // },
                // axisTicks: {
                //     show: true
                // },
                labels: {
                    datetimeUTC: false,
                },
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val) {
                        return val
                    }
                },
                x: {
                    format: "dd/MM/yy HH:mm",
                    formatter: function (value) {
                        const date = new Date(value)
                        return (
                            date.getDate() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getFullYear() +
                            " " +
                            date.getHours() +
                            ":" +
                            date.getMinutes() +
                            ":" +
                            date.getSeconds()
                        )
                    }
                }
            }
        }
    }

    return (

        <Row className='match-height'>
            <Col lg='12' sm='12'>
                <Card>
                    <CardHeader>
                        <CardTitle>Kick start your project 🚀</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Select
                            onChange={(value) => { setOption(value) }}
                            value={option}
                            style={{
                                width: 240
                            }}
                        >
                            {
                                arr.map((value, index) => {
                                    return <Option value={index + 1} key={index}>{index + 1}</Option>
                                })
                            }
                        </Select>
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
    )
}
