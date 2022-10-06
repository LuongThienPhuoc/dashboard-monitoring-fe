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
import { useSelector } from "react-redux"
const host = "http://localhost:5050"

export default function RealtimeDash() {
    const skin = useSelector(state => state.layout.skin)
    const arr = new Array(168).fill(0)
    const [option, setOption] = useState(8)
    const socketRef = useRef()
    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
    useEffect(() => {
        // Connect socket
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.on("connect", function () {
            socketRef.current.emit("authenticate", { token: getAccessToken() })
        })
        socketRef.current.on("getData", (data) => {
            const now = new Date().getTime() - 1000 * 60
            setSeries1((prev) => {
                return [...prev.slice(0), data.vuiSpending]
            })
            setSeries2((prev) => {
                return [...prev.slice(0), data.vuiGiving]
            })
            setCategories((prev) => {
                return [...prev.slice(0), now]
            })
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
                    let now = new Date()
                    let lastElementDate = new Date(res.data.data[res.data.data.length - 1].time)
                    if (now.getMinutes() === lastElementDate.getMinutes() && now.getHours() === lastElementDate.getHours && now.getDate() === lastElementDate.getDate()) {
                        setCategories(res.data.arrCate.filter((value, key) => key !== res.data.arrCate.length - 1))
                        setSeries2(res.data.Giving.filter((value, key) => key !== res.data.Giving.length - 1))
                        setSeries1(res.data.Using.filter((value, key) => key !== res.data.Using.length - 1))
                    } else {
                        setCategories(res.data.arrCate)
                        setSeries2(res.data.Giving)
                        setSeries1(res.data.Using)
                    }

                })
                .catch((err) => {
                    alert(err.message)
                })
        }
        getAllData()
    }, [option])


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
                id: 'realtime',
                stacked: false,
                zoom: {
                    type: "x",
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: "zoom"
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 500
                    }
                },
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                strokeWidth: 1,
                strokeOpacity: 7,
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
                                background: "#00E396",
                                fontSize: "16px"
                            }
                        }
                    },
                    {
                        y: 10000,
                        y2: 50000,
                        borderColor: '#000',
                        fillColor: '#ffccc7',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '12px',
                                color: '#333',
                                background: '#ffa39e',
                            },
                            text: 'Danger',
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
                                background: "#775DD0",
                                fontSize: "16px"
                            }
                        }
                    }
                ],
                points: [{
                    x: new Date('01 Dec 2017').getTime(),
                    y: 400,
                    marker: {
                        size: 8,
                        fillColor: '#fff',
                        strokeColor: 'red',
                        radius: 2,
                        cssClass: 'apexcharts-custom-class'
                    },
                    label: {
                        borderColor: '#FF4560',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#FF4560',
                        },

                        text: 'Point Annotation',
                    }
                }
                ]
            },
            title: {
                text: "VUI Chart",
                align: "left",
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: 'white'
                },
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
            legend: {
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: undefined,
                labels: {
                    useSeriesColors: true
                }
            },
            colors: ["#a0d911", "#ff4d4f"],
            yaxis: {
                title: {
                    text: "Vui",
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: skin === "dark" ? "white" : "black"
                    },
                },
                labels: {
                    style: {
                        colors: skin === "dark" ? "white" : "black",
                        fontSize: '13px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                }
            },
            xaxis: {
                type: "datetime",
                categories,

                labels: {
                    datetimeUTC: false,
                    style: {
                        colors: skin === "dark" ? "white" : "black",
                        fontSize: '13px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-xaxis-label',
                    },
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
                },
                style: {
                    colors: skin === "dark" ? "white" : "black",
                    fontSize: '13px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-label',
                },
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
