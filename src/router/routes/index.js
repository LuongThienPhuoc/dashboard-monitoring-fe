// ** React Imports
import { Fragment, lazy, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"
import { message } from "antd"
// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isObjEmpty } from "@utils"

import { useDispatch, useSelector } from "react-redux"
import { get } from "../../api/axios"
import URL from "../../api/config"
import { handleLogin } from "../../redux/authen"
const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"

// ** Default Route
const DefaultRoute = "/dashboards/dashboard"

const NotAuthorized = lazy(() => import("../../views/NotAuthorized"))
const Login = lazy(() => import("../../views/Login"))
const Error = lazy(() => import("../../views/Error"))
const Dashboard = lazy(() => import("../../views/Dashboard/Dashboard"))
const RealtimeDash = lazy(() => import("../../views/Dashboard/RealtimeDash"))
const BrandCodeDash = lazy(() => import("../../views/Dashboard/BrandCodeDash"))
// ** Merge Routes
const Routes = [
  // Login success
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
    isLogin: true
  },
  {
    path: "/not-authen",
    index: true,
    element: <NotAuthorized />,
    isLogin: true
  },
  {
    path: "/dashboards/dashboard",
    element: <Dashboard />,
    isLogin: true
  },
  {
    path: "/dashboards/real-time",
    element: <RealtimeDash />,
    isLogin: true
  },
  {
    path: "/dashboards/brand-code",
    element: <BrandCodeDash />,
    isLogin: true
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank"
    },
    isLogin: true
  },
  {
    path: "/*",
    element: <Error />,
    meta: {
      layout: "blank"
    },
    isLogin: true
  },
  // isLogin = false  
  {
    path: "/",
    index: true,
    element: <Navigate replace to={"/login"} />,
    isLogin: false
  },
  {
    path: "/:id",
    index: true,
    element: <Navigate replace to={"/login"} />,
    isLogin: false
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank"
    },
    isLogin: false
  },
  {
    path: "/*",
    element: <Error />,
    meta: {
      layout: "blank"
    },
    isLogin: false
  }
]


const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }
        const isLogin = useSelector(state => state.authen.isLogin)
        console.log(isLogin)
        // Push route to LayoutRoutes
        console.log(route)
        if (isLogin && route.isLogin) {
          LayoutRoutes.push(route)
        }
        if (!isLogin && !route.isLogin) {
          LayoutRoutes.push(route)
        }
      }
      return LayoutRoutes
    })

  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const AllRoutes = []
  useEffect(() => {
    const refreshApi = () => {
      get(URL.URL_ADMIN_REFRESH)
        .then((res) => {
          if (res.data.success) {
            dispatch(handleLogin())
            navigate("/")
          } else {
            navigate("/login")
          }
        })
        .catch((err) => {
          message.error(err.message)
          navigate("/login")
        })
    }
    refreshApi()
  }, [])

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
