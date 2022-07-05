---
title: API Management
sidebar_position: 0
---

## Resources

- [Microservices](https://docs.microsoft.com/en-us/azure/architecture/microservices/design/gateway) (high level design)
- [API Management Service](https://docs.microsoft.com/en-us/azure/api-management/import-and-publish) (tutorial)
- [Managed service identity](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-use-managed-service-identity) (tutorial)

## API Management Service

Goal: Import an (OpenAPI Specification) backend API in JSON format into Azure API Management. Microsoft provides the backend API and hosts it on Azure.  

:::tip
If gpt3 api doesn't meet OAI specification just use a "blank" api template
:::

1. Create api-management-service in Azure portal
    - Note: Selected "Development tier" for pricing (no SLA)
    - Can be linked to AppInsights for monitoring - need to create an AppInsights instance
    - Enabled system assigned managed identities to enable authentication
    - Note: Deployment of the resource can take >30 minutes, so be patient ;-)
2. Test API
    - See section below
3. Add CORS policy to out API
    - See section below
4. Add key to income requests
    - See section below


### Test API

**Input:** Working endpoint from azureml that can be called e.g. like this

```bash
curl http://51.143.104.146:80/api/v1/service/autome-endpoint/score -H "Content-Type: application/json" -H "Authorization: Bearer $apikey" -d '{"prompt": "what did Wittgenstein become =>", "max_length": 50}'
```

where the apikey is available from ml.azure.com.

**Goal:** define a "blank api" using Azure API Management service that "wraps" this endpoint.

1. Find the resource in Azure Portal > select the API tab.
2. Create an API > "Blank API" > Select "Full" to see additional configuration options
    - Display name: Autome Endpoint
    - Name: autome-endpoint
    - Description: Endpoint serving finetuned gpt-2 model
    - Web service URL: http://51.143.104.146:80/api/v1/service/autome-endpoint
        - Note: this DOES NOT include the `/score` suffix
    - URL Scheme: http
    - API URL suffix: autome
    Gateways: "Managed" (this should be automatically populated)
3. Add an operation (we will add `/score`)
    - Go to Design tab > + Operation
        - Display name: Score
        - Name: score
        - URL: POST /score
4. Test the endpoint: Find the "Test" tab near the "Design" tab.
    - Add headers:
        - Authorization: Bearer `<api-key>`
        - Content-Type: application/json
    - Add a request body
        ```json
        {"prompt": "what did Wittgenstein become =>", "max_length": 50}
        ```
    - Click Send and wait for the response.
        ```
        HTTP/1.1 200 OK

        cache-control: max-age=0, private, must-revalidate
        content-length: 240
        content-type: application/json
        date: Wed, 07 Apr 2021 18:57:06 GMT
        ocp-apim-apiid: autome-endpoint
        ocp-apim-operationid: score
        ocp-apim-subscriptionid: master
        ocp-apim-trace-location: https://apimstbfwzj8bvczuq2ugnwq.blob.core.windows.net/apiinspectorcontainer/AgpenpXg3kGGMNWQXVlUmA2-3?sv=2019-07-07&sr=b&sig=AbA%2Bu6FALawalSuNesS9eQOwIJA8QSmPG0x0iYFkWlY%3D&se=2021-04-08T18%3A56%3A57Z&sp=r&traceId=fa3a5a23daed4a3988d17401a3ee7b82
        vary: Origin
        x-ms-request-id: 0aaaad60-6e7d-4a33-85eb-d8d485827399
        x-ms-run-function-failed: False
        "{\"output\": \"what did Wittgenstein become => I was just thinking to myself... That was crazy. I'm sure he was a lot more serious than we know :-)\", \"prompt\": \"what did Wittgenstein become =>\", \"num_return_sequences\": 1}"
        ```

#### Test api with curl

You can replicate this test from the command line:

```bash
curl http://babel-api-manager.azure-api.net/autome/score -H "Authorization: Bearer <from ml.azure.com>" -H "Content-Type: application/json" -H "ocp-apim-subscriptionid: master" -H "Ocp-Apim-Subscription-Key: <from-portal>" -d '{"prompt": "what did Wittgenstein become =>", "max_length": 50}'
```

    "{\"output\": \"what did Wittgenstein become => He was the first American to work in the post. He was very nice - he was also the youngest one to speak!\", \"prompt\": \"what did Wittgenstein become =>\", \"num_return_sequences\": 1}"


Note here that the apikey from the ml.azure.com endpoint and the subscription key from portal.azure.com are used to authenticate the request.

### Add CORS policy to our API

By now we have the following setup:

- An endpoint from azureml, e.g.,

```bash
curl http://51.143.104.146:80/api/v1/service/autome-endpoint/score -H "Content-Type: application/json" -H "Authorization: Bearer $apikey" -d '{"prompt": "what did Wittgenstein become =>", "max_length": 50, "num_return_sequences": 2}'

"{\"output\": [\"what did Wittgenstein become => He's really good at predicting. He got this:\\n\\n\\\"The Great Depression started in the midst of the Great American Manufacturing Experiment... It went well, but slowly, in large part because there were a lot\", \"what did Wittgenstein become => I think I know who Wittgen...\"], \"prompt\": \"what did Wittgenstein become =>\", \"num_return_sequences\": 2}"
```

- An API management service endpoint that wraps the above endpoint, e.g.,

```
curl http://babel-api-manager.azure-api.net/autome/score -H "Authorization: Bearer $apikey" -H "Content-Type: application/json" -H "ocp-apim-subscriptionid: master" -H "Ocp-Apim-Subscription-Key: $subkey" -d '{"prompt": "what did Wittgenstein become =>", "max_length": 50}'

"{\"output\": \"what did Wittgenstein become => Yeah, I've been a bit sceptical. I thought he was a \\\"maniac\\\".\", \"prompt\": \"what did Wittgenstein become =>\", \"num_return_sequences\": 1}"
```

#### The problem: CORS

We want to call this endpoint from our application. In our case that is a React
component inside a docusaurus generated single page application. In that component
we call the api something like this:

```js
const apikey = "..."; //set these secrets
const subkey = "..."; //set these secrets
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apikey}`,
    'Ocp-Apim-Subscription-Key': `${subkey}`,
    'ocp-apim-subscriptionid': 'master',
}
const data = {
    'prompt': prompt,  // this comes from client text box
    'max_length': 5,
    'num_return_sequences': 2,
}
console.log(data)
axios.post(
    "http://babel-api-manager.azure-api.net/autome/score", data, { headers: headers }
).then(result => {
    // do something with the response
})
```

Testing this code locally gives an error

```
Access to XMLHttpRequest at 'http://babel-api-manager.azure-api.net/autome/score' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

But it will run successfully if we launch our browser like this

```
'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'  --disable-web-security --disable-gpu  --user-data-dir=~/chromeTemp
```

#### The solution: Add a CORS policy

- Select your endpoint in the Azure API Management service in the Azure portal.
- Add a cors policy to your inbound processing policies

:::tip
1. Remove the existing `<base />` policy from inbound section.
2. Add the origins of your desired webpage here otherwise it won't work! We include
  localhost:3000 for local testing.
:::

```xml
<policies>
    <inbound>
        <cors allow-credentials="true">
            <allowed-origins>
                <origin>https://babel-webapp.azurewebsites.net</origin>
                <origin>http://localhost:3000</origin>
            </allowed-origins>
            <allowed-methods preflight-result-max-age="300">
                <method>*</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
            <expose-headers>
                <header>*</header>
            </expose-headers>
        </cors>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

### Add key to incoming requests

Goal: Abstract secrets from client i.e. do not store apikey in javascript logic calling the api

Solution: Add the authorization header to incoming requests in API manager

To do so, add the following policy to the inbound section:

```xml
<set-header name="Authorization" exists-action="override">
    <value>Bearer "your-api-key"</value>
</set-header>
```

To look something like this:

```xml
<policies>
    <inbound>
        <cors allow-credentials="true">
            <allowed-origins>
                <origin>https://babel-webapp.azurewebsites.net</origin>
                <origin>http://localhost:3000</origin>
            </allowed-origins>
            <allowed-methods preflight-result-max-age="300">
                <method>*</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
            <expose-headers>
                <header>*</header>
            </expose-headers>
        </cors>
        <set-header name="Authorization" exists-action="override">
            <value>Bearer "your-api-key"</value>
        </set-header>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```