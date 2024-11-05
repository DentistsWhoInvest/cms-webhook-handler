const axios = require('axios');

const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
const API_KEY = process.env.CMS_WEBHOOK_HANDLER_API_KEY;

async function triggerWorkflowDispatch() {
  const url = `https://api.github.com/repos/DentistsWhoInvest/dotcom-next-app/actions/workflows/strapi-automated-deploy.yml/dispatches`;

  const data = {
    ref: 'main',
    inputs: {}
  };

  const headers = {
    'Authorization': `Bearer ${GITHUB_API_KEY}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'axios - workflow dispatch'
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 204) {
      console.log('Workflow dispatched successfully!');
    } else {
      console.error(`Unexpected status code: ${response.status}`);
      console.error('Response data:', response.data);
    }
  } catch (error) {
    if (error.response) {
      console.error(`Failed to dispatch workflow. Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error('An error occurred:', error.message);
    }
  }
}

exports.startFunction = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.writeHead(403);
    return res.end('Forbidden: No credentials sent');
  }
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || token !== API_KEY) {
    res.writeHead(403);
    return res.end('Forbidden: Invalid credentials');
  }
  triggerWorkflowDispatch()
    .then(_ => {
      res.status(200).send('Workflow dispatched successfully!');
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      res.status(500).send('Internal Server Error');
    });
};
