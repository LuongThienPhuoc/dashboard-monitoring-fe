import { message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs"
import { get } from "../../../api/axios"
import URL from "../../../api/config"
import CreateApp from "../modal/CreateApp"
/*eslint-disable */

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Using VUI',
        dataIndex: 'using',
        sorter: {
            compare: (a, b) => a.using - b.using,
        },
        render: (text) => <div style={{ display: 'flex', justifyContent: "start", alignItems: "center" }} className='!flex justify-start items-center'>
            <p style={{ color: "#a0d911", fontWeight: "bold", margin: "0" }} className='text-[#a0d911] font-bold m-0'>{text}</p>
            <BsArrowUpShort style={{ fontSize: "2rem", color: "#a0d911" }} className='text-[2rem] text-[#a0d911]' />
        </div>,
    },
    {
        title: 'Giving VUI',
        dataIndex: 'giving',
        sorter: {
            compare: (a, b) => a.giving - b.giving,
        },
        render: (text) => <div style={{ display: 'flex', justifyContent: "start", alignItems: "center" }} className='!flex justify-start items-center'>
            <p style={{ color: "#ff4d4f", fontWeight: "bold", margin: "0" }} className='text-[#ff4d4f]  font-bold m-0'>{text}</p>
            <BsArrowDownShort style={{ fontSize: "2rem", color: "#ff4d4f" }} className='text-[2rem] text-[#ff4d4f]' />
        </div>,
    }
];

const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};


const TableVUI = (props) => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState([])
    const [selected, setSelected] = useState({})
    const [selectedData, setSelectedData] = useState([])
    const renderDate = (date) => {
        if (props.type === "week") {
            return date
        } else if (props.type === "day") {
            return props.day + " " + date + "h"
        } else if (props.type === "hour") {
            return props.day + " " + props.hour + ":" + date
        } else {
            let a = new Date(date)
            return a.getDate() + "/" + (a.getMonth() + 1) + "/" + a.getFullYear() + " " + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds()
        }
    }
    const onRowClick = (record) => {
        const splitRecord = record.date.split(" ");
        setShow(true)
        setSelected(record)
        if (splitRecord.length === 1) {
            // Day
            get(URL.URL_GET_TRANSACTIOM + `?options=day&day=${splitRecord[0]}`).then(res => {
                console.log(res.data);
                setSelectedData(res.data.result)
            }).catch(err => {
                message.error(err.message)
            })
        } else if (splitRecord[1].includes("h")) {
            // Hour
            get(URL.URL_GET_TRANSACTIOM + `?options=hour&day=${splitRecord[0]}&hour=${splitRecord[1].split(0, splitRecord[1].length - 2)}`).then(res => {
                setSelectedData(res.data.result)
            }).catch(err => {
                message.error(err.message)
            })
        } else {
            // Minutes
            const splitTime = splitRecord[1].split(":")
            get(URL.URL_GET_TRANSACTIOM + `?options=minute&day=${splitRecord[0]}&hour=${splitTime[0]}&minute=${splitTime[1]}`).then(res => {
                setSelectedData(res.data.result)
            }).catch(err => {
                message.error(err.message)
            })
        }
    }

    useEffect(() => {
        console.log(data)
        if (data?.length !== 0) {
            setData(props.categories?.map((value, key) => {
                return {
                    key: key,
                    date: renderDate(props.categories[key] && props.categories[key]),
                    using: props.using[key],
                    giving: props.giving[key],
                }
            }))
        } else {
            if (props.categories?.length !== 0) {
                setData(prev => {
                    return [{
                        key: props.categories?.length,
                        date: renderDate(props.categories && props.categories[props.categories?.length - 1]),
                        using: props.using[props.using?.length - 1],
                        giving: props.giving[props.giving?.length - 1],
                    }, ...prev]
                })
            }
        }
    }, [props.categories, props.using, props.giving, data?.length])
    return (
        <>
            <CreateApp show={show} setShow={setShow} selected={selected} selectedData={selectedData}></CreateApp>
            <Table
                columns={columns}
                dataSource={data}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: () => onRowClick(record), // click row
                    };
                }}
                onChange={onChange}
            />
        </>
    )
}
export default TableVUI;