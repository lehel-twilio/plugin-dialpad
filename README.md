#Dialpad

Make outbound calls using Flex!

![Dialpad](https://zaffre-cow-9057.twil.io/assets/68747470733a2f2f63696e6572656f75732d6d616c6c6172642d343935392e7477696c2e696f2f6173736574732f6469616c7061642e706e67.png)

## Instructions

### Get the Source Code

-   `git clone https://github.com/lehel-twilio/plugin-dialpad.git`
-   `npm install`
-   `make patch`

### Setup Environment Variables

-   `cp public/appConfig.example.js public/appConfig.js`

Edit public/appConfig.js and add your accountSid.

### Deploy Functions

Go to your [Twilio Functions](https://www.twilio.com/console/runtime/functions/manage) and deploy the functions in the /functions directory.

In the [Function Configuration](https://www.twilio.com/console/runtime/functions/configure) tab you will need to make your credentials available in your Function code by checking the `Enable ACCOUNT_SID and AUTH_TOKEN` option. Additionally, you will need two configure two environment variables:

`TWILIO_WORKSPACE_SID` Out of the box, `Flex Task Assignment` is the only available Workspace  
`TWILIO_WORKFLOW_SID` Out of the box, `Assign to Anyone` is the only available Workflow.

In the TaskRouter -> Task Channels, please verify that channel `custom1` exists. If not, please create one using the REST API or via Twilio Console. Instructions can be found [here](https://www.twilio.com/docs/taskrouter/api/task-channel?code-sample=code-create-a-taskchannel&code-language=curl#create-a-taskchannel)

The plugin uses the worker attribute `phone` as the callerId to make outbound calls.

**function paths should match file names**

### Build

-   `npm run build`

### Deploy Plugin

Go to your [Twilio Assets](https://www.twilio.com/console/runtime/assets/public) and deploy the plugin-dialpad.js file from the /build directory.


### Change log
10/12/2018 - v1.0 - Initial release

10/15/2018 - v1.1 - Added hold functionality

10/18/2018 - v1.2 - Added support for international dialing

10/22/2018 - v2.0 - Support for Flex 1.0

10/26/2018 - v2.1 - E.164 dialing format now supported

11/12/2018 - v2.2 - Significant changes on back-end, support for Flex 1.1

11/16/2018 - v2.3 - Checking number length before dialing, copy and paste, bug fix that was
allowing multiple calls to be dialed at the same time

11/27/2018 - v2.4 - Added Call button for SMS, support for Flex 1.2

12/19/2018 - v2.5 - Moved all outbound calls to taskChannel custom1, only auto-accepting
interactions that have the attribute autoAnswer set to true. Support for Flex 1.3. Restyled using
MUI buttons

1/16/2019 - v2.6 - Support for Flex 1.4. Minor bug fixes in hold.

3/14/2019 - v3.0 - Support for Flex 1.6. Added internal dialing and 3-way conferencing. Multiple breaking changes. Minor bug fixes. If upgrading from a previous version, please re-deploy all functions from src/functions to your Twilio console as most functions received updates.

4/25/2019 - v3.1 - Support for Flex 1.8. Instead of grabbing the url from the state, manager.serviceConfiguration.runtime_domain is used. Task Timeout is now set to 30 seconds instead of the default 24 hours.

5/31/2019 - v3.2 - Added support for Flex 1.9. Validating all JWE tokens in Twilio Functions. Using new version of MUI. Miscellaneous bug fixes.
