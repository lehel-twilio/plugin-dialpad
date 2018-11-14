#Dialpad

Make outbound calls using Flex!

![Dialpad](https://cinereous-mallard-4959.twil.io/assets/dialpad.png)

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
