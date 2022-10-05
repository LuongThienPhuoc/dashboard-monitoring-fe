// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { BiLineChartDown, BiLineChart } from "react-icons/bi"
import { MdMiscellaneousServices, MdBrandingWatermark } from "react-icons/md"
import { FaStore } from "react-icons/fa"
// ** Reactstrap Imports
import {
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import { Table } from 'antd'
// ** Third Party Components
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    sorter: {
      compare: (a, b) => a.stt - b.stt
    },
    render: (text) => <div style={{ fontWeight: "600", fontSize: '14px' }}>{text}</div>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text) => <div style={{ color: "#b4b7bd", fontWeight: "500", fontSize: "16px  " }}>{text}</div>
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <div style={{ display: 'flex', justifyContent: "start", alignItems: "center" }} className='!flex justify-start items-center'>
      {
        text === "REDEEM" ? (<p style={{ margin: '0', padding: "8px", background: "#55f35554", borderRadius: "50%" }}>
          <BiLineChart style={{ fontSize: "2rem", color: "green" }} />
        </p>
        ) : (<p style={{ margin: '0', padding: "8px", background: "#ff000033", borderRadius: "50%" }}>
          <BiLineChartDown style={{ fontSize: "2rem", color: "#f5222d" }} />
        </p>)
      }
    </div>
  },
  {
    title: 'VUI',
    dataIndex: 'value',
    key: 'value',
    sorter: {
      compare: (a, b) => a.value.value - b.value.value
    },
    render: (text) => <div style={{ fontWeight: "500", fontSize: "18px", color: text.status === "REDEEM" ? "#a0d911" : "#f5222d" }}>{text.status === "REDEEM" ? "+" : "-"} ${text.value}</div>
  }
]

const ShareProjectExample = (props) => {
  const [data, setData] = useState([])

  const renderDate = (date) => {
    return `${date.day}/${date.month}/${date.year} - ${date.hour}:${date.minute}:${date.second}`
  }

  useEffect(() => {
    const arr = props.selectedData.map((value, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        value: {
          value: value.value,
          status: value.data.event
        },
        date: renderDate(value.date),
        data: value.data,
        status: value.data.event
      }
    })
    setData(arr)
  }, [props.selectedData])
  return (
    <Fragment>
      <Modal isOpen={props.show} toggle={() => props.setShow(!props.show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => props.setShow(!props.show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-4'>
          <h1 className='text-center mb-1'>List transaction in {props.selected.date}</h1>
          <p className='text-center'>Chose anything transaction</p>
          <p style={{ fontSize: "1.3rem" }} className='fw-bolder pt-50 mt-2'>{props.selectedData.length} Transaction</p>
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ paddingLeft: "50px" }}>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center", fontSize: "16px", marginBottom: "15px" }}>
                    <p style={{ margin: "0", padding: "10px", borderRadius: "4px", color: "#7367f0", background: "rgb(115 103 240 / 20%)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                      <FaStore></FaStore>
                    </p>
                    <p style={{ margin: "0", marginLeft: "10px", fontWeight: "600", width: "60px" }}>Store: </p>
                    <p style={{ margin: "0" }}>{record.data.storeCode ? record.data.storeCode : "Không có"}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center", fontSize: "16px", marginBottom: "15px" }}>
                    <p style={{ margin: "0", padding: "10px", borderRadius: "4px", color: "#ff9f43", background: "rgb(255 159 67 / 20%)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                      <MdMiscellaneousServices></MdMiscellaneousServices>
                    </p>
                    <p style={{ margin: "0", marginLeft: "10px", fontWeight: "600", width: "60px" }}>Service: </p>
                    <p style={{ margin: "0" }}>{record.data.service ? record.data.service : "Không có"}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center", fontSize: "16px", marginBottom: "15px" }}>
                    <p style={{ margin: "0", padding: "10px", borderRadius: "4px", color: "#00cfe8", background: "rgb(0 207 232 / 20%)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                      <MdBrandingWatermark></MdBrandingWatermark>
                    </p>
                    <p style={{ margin: "0", marginLeft: "10px", fontWeight: "600", width: "60px" }}>Brand: </p>
                    <p style={{ margin: "0" }}>{record.data.brandCode ? record.data.brandCode : "Không có"}</p>
                  </div>
                </div>
              ),
              rowExpandable: (record) => record.name !== 'Not Expandable'
            }}
            dataSource={data}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ShareProjectExample
