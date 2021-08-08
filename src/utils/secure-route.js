import { useContext } from "react";
import { Route, Redirect } from "react-router";
import SiteContext from "./site-context";

export default function SecureRoute({ component: Component, redirect, authed, ...rest }) {
    let { user } = useContext(SiteContext);

    return <Route render={
        props =>
            !user === !authed ?
                <Component {...props} /> :
                <Redirect to={{ pathname: redirect, state: { from: props.location } }} />
    } {...rest} />
}
