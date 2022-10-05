// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"

// ** Default Avatar Image
import { useDispatch, useSelector } from "react-redux"
import { handleLogout } from "../../../../redux/authen"
const UserDropdown = () => {
  const dispatch = useDispatch()
  const skin = useSelector(state => state.layout.skin)
  console.log(34)
  console.log(skin)
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span style={{ color: skin === "dark" ? "white" : "#6e6b7b" }} className="user-name fw-bold">Admin</span>
        </div>
        <Avatar
          img={'https://taptap.com.vn/wp-content/uploads/2021/11/1-1.png'}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/login" onClick={() => { dispatch(handleLogout()) }}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
