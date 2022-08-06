import ForgeUI, { Table, Head, Row, Cell, render, Fragment, Text, IssuePanel, ProjectPage, useProductContext, useState } from '@forge/ui';
import api, { route } from '@forge/api';

const updateEngagementScore = async function(issueId, score) {
  const fieldKey = "2e84daed-8556-44eb-8ed9-7fc991942fc1" + "__DEVELOPMENT__" + "engagement-score-field";
  const body = {updates: [
    {
      issueIds: [issueId],
      value: score
    }
  ]};

  const response = await api.asApp().requestJira(route`/rest/api/3/app/field/${fieldKey}/value`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

}

const fetchNumberOfComments = async function(issueKey) {
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/comment`);
  const data = await response.json();
  return data.total;
}

const fetchIssuesWithNumberOfComments = async function(projectKey) {
  const jql = `project in (${projectKey})`;
  const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}`);
  const data = await response.json();

  const issuesWithNumberOfComments = [];
  for (const issue of data.issues) {
    const numberOfComments = await fetchNumberOfComments(issue.key);
    issuesWithNumberOfComments.push({
      'key': issue.key,
      'summary': issue.fields.summary,
      'numComments': numberOfComments
    });
  }
  return issuesWithNumberOfComments;
}

const EngagementPanel = () => {
  const { platformContext: {issueKey}} = useProductContext();
  const [ numComments ] = useState(fetchNumberOfComments(issueKey));
  return (
    <Fragment>
      <Text>Engagement Score: {numComments}</Text>
    </Fragment>
  );
};

export const panel = render(
  <IssuePanel>
    <EngagementPanel />
  </IssuePanel>
);

const EngagementOverview = () => {
  const { platformContext: {projectKey}} = useProductContext();
  const [issues] = useState(fetchIssuesWithNumberOfComments(projectKey));
  console.log(JSON.stringify(issues));
  return (
    <Table>
      <Head>
        <Cell><Text>Issue Key</Text></Cell>
        <Cell><Text>Summary</Text></Cell>
        <Cell><Text>Engagement Score</Text></Cell>
      </Head>
      {issues.map(issue => (
        <Row>
          <Cell><Text>{issue.key}</Text></Cell>
          <Cell><Text>{issue.summary}</Text></Cell>
          <Cell><Text>{issue.numComments}</Text></Cell>        
        </Row>
      ))}
    </Table>
  );
};

export const engagementOverview = render(
  <ProjectPage>
    <EngagementOverview />
  </ProjectPage>
);

export async function trigger(event, context) {
  const numComments = await fetchNumberOfComments(event.issue.key);
  await updateEngagementScore(event.issue.id, numComments);
}

export async function scheduledTrigger(event) {
  const response = await api.asApp().requestJira(route`/rest/api/3/search?maxResults=100`);
  const data = await response.json();
  
  for (const issue of data.issues) {
      let numComments = await fetchNumberOfComments(issue.key);
      await updateEngagementScore(issue.id, numComments);
    }
}

