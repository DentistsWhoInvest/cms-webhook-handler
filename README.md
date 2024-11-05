# CMS Webhook handler

Strapi has the ability to call webhooks, when certain actions happen.

Unfortunately this has limited customisation, we can't connect this directly to github actions.

This middleware allows us to create a public function which allows the endpoint to be called when the webhook runs, but then customise what happens.
In this case, craft a valid requst to github

I've created a long random API key, only used for this API endpoint.
The secret is stored in a GCP secret, and must be used here in the auth header:

```bash
Authorization: Bearer <value>
```

This doesn't do anything more or less than forward the request on to github actions, using a Personal Access Token, and say whether or not the request was successful.
