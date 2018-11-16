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

Edit public/appConfig.js and add your accountSid and runtime domain (without protocol [http/https])

### Deploy Functions

Go to your [Twilio Functions](https://www.twilio.com/console/runtime/functions/manage) and deploy the functions in the /functions directory.

In the [Function Configuration](https://www.twilio.com/console/runtime/functions/configure) tab you will need to make your credentials available in your Function code by checking the `Enable ACCOUNT_SID and AUTH_TOKEN` option. Additionally, you will need two configure two environment variables:

`TWILIO_WORKSPACE_SID` Out of the box, `Flex Task Assignment` is the only available Workspace
`TWILIO_WORKFLOW_SID:` Out of the box, `Assign to Anyone` is the only available Workflow

**function paths should match file names**

### Build

-   `npm run build`

### Deploy Plugin

Go to your [Twilio Assets](https://www.twilio.com/console/runtime/assets/public) and deploy the plugin-dialpad.js file from the /build directory.
