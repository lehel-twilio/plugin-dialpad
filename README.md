# Dialpad

Make outbound calls using Twilio Flex!

![Dialpad](https://zaffre-cow-9057.twil.io/assets/68747470733a2f2f63696e6572656f75732d6d616c6c6172642d343935392e7477696c2e696f2f6173736574732f6469616c7061642e706e67.png)

## Summary

This plug-in adds an icon to the side navigation bar which will open a dialpad. When a call is placed, a new TaskRouter Task is created through a Twilio Function and routed through the TaskRouter Workflow. Changes will need to be made to the Workflow in order to ensure that this Task gets routed back to the original worker.

Once the Worker is assigned the Task, a customization from the plug-in will auto-accept the Task on the Worker’s behalf, create a Conference and will call a second Twilio Function which will place the agent into the previously created Conference. Once the Worker is in the conference, a third Twilio Function is called which will place the outbound call into the same Conference.

## Instructions

### Get the Source Code

- `git clone https://github.com/lehel-twilio/plugin-dialpad.git`
- `npm install`
- `make patch`

### Setup Environment Variables

- `cp public/appConfig.example.js public/appConfig.js`

Edit public/appConfig.js and add your accountSid.

### Deploy Functions

Go to your [Twilio Functions](https://www.twilio.com/console/runtime/functions/manage) and deploy the functions in the /functions directory.

**The function paths should match the function file names**

Note the below functions need to have the Access Control checkbox, Check for valid Twilio signature, **unchecked**.

- Flex Dialpad Hold Call (/hold-call)
- Flex Dialpad Create New Task (/create-new-task)
- Flex Dialpad Cleanup Rejected Task (/cleanup-rejected-task)

You can edit the below Twilio functions to replace the placeholder text, "Your Company Name Here", with your company name.

- Flex Dialpad Add Conference Participant (/add-conference-participant)
- Flex Dialpad Create New Task (/create-new-task)

In the [Function Configuration](https://www.twilio.com/console/runtime/functions/configure) tab you will need to make your credentials available in your Function code by checking the `Enable ACCOUNT_SID and AUTH_TOKEN` option. Additionally, you will need to configure two environmental variables:

`TWILIO_WORKSPACE_SID` Out of the box, `Flex Task Assignment` is the only available Workspace  
`TWILIO_WORKFLOW_SID` Out of the box, `Assign to Anyone` is the only available Workflow.

You will need to add the NPM package, axios, as a Dependency under the Twilio Functions Dependencies section.

### Task Router

In the TaskRouter -> Task Channels, please verify that channel `custom1` exists. If not, please create one using the REST API or via Twilio Console. Instructions can be found [here](https://www.twilio.com/docs/taskrouter/api/task-channel?code-sample=code-create-a-taskchannel&code-language=curl#create-a-taskchannel)

In TaskRouter, add an attribute called “phone” to every Worker and specify a [E.164 phone number](https://www.twilio.com/docs/glossary/what-e164) which will be used as the caller ID for outbound calls.

Within the TaskRouter Workflow, add the following filter at the top:

```
{
  ​"filter_friendly_name"​: ​"Outbound Calls"​,
  ​"expression"​: ​"targetWorker != null"​,
  ​"targets"​: [
    {
​      "queue"​: ​"your Queue Sid which includes all workers"​,
      "expression"​: ​"task.targetWorker == worker.contact_uri"
    }
  ]
}
```

The filter should look like this within the Twilio Console:

![TaskRouter Image](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/github-plugin-dialpad-plugin-Flex-readme.original.jpg)

### Build

- `npm run build`

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

7/2/2019 - v4.0 - Complete rewrite of the dialpad. No new features were added in this release. The components of the dialpad were separated out into individual React components and a custom redux store is used to communicate between components. This version requires Flex 1.9 or newer.
