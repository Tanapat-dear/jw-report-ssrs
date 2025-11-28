import { useRouteError } from "react-router"

export default function ErrorPage(){
    const error: any= useRouteError();
    console.log(error)
    return(
        <div>{error.statusText}</div>
    )
}