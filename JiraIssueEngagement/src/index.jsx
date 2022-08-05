import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState } from '@forge/ui';
import api, { route } from '@forge/api';

const fetchNumberOfComments = async function(issueKey) {
  console.log(`KEY: ${issueKey}`);
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/comment`);
  const data = await response.json();
  console.log(data);
  return data.total;
}
const EngagementPanel = () => {
  const { platformContext: {issueKey}} = useProductContext();
  const [ numComments ] = useState(fetchNumberOfComments(issueKey));
  //console.log(numComments);
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
