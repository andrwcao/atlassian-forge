import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();
const requiredSummary = 50;
const requiredDescription = 4;

function getScore(data) {
  let summaryScore = data.fields.summary ? data.fields.summary.length/requiredSummary : 0;
  if (summaryScore > 1) {
    summaryScore = 1;
  }

  let descriptionScore = data.fields.description.content ? data.fields.description.content.length/requiredDescription : 0;
  if (descriptionScore > 1) {
    descriptionScore = 1;
  }

  return (summaryScore + descriptionScore) / 2 * 100;
}

resolver.define('getText', async (req) => {
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${req.context.extension.issue.key}`);
  const data = await response.json();
  return getScore(data);
});

resolver.define('getProjectOverview', async (req) => {
  let jql = `project in (${req.context.extension.project.key})`;
  const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}&expand=names&fields=summary,description`);
  const data = await response.json();
  let issueScores = [];
  for (let issue of data.issues) {
    issueScores.push({
      'key': issue.key,
      'scoreText': getScore(issue) + "%"
    });
  }

  return issueScores;
});

export const handler = resolver.getDefinitions();
