import * as React from "react";

import { SideLink, Actions } from "@twilio/flex-ui";

export default class DialerButton extends React.Component{

    render() {
        return <SideLink
            {...this.props}
            icon="Call"
            iconActive="CallBold"
            isActive={this.props.activeView === "dialer"}
            onClick={() => Actions.invokeAction("NavigateToView", {viewName: "dialer"})}>My custom page</SideLink>
            ;
    }
}
