import ForgeUI, { render, ProjectPage, IssuePanel, Fragment, Text, useState, useProductContext } from '@forge/ui';
import api, { route } from '@forge/api';

const fetchNumberOfIssues = async () => {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`);
    const data = await response.json();
    return data.total;
}

const App = () => {
    const [numOfIssues] = useState(async () => await fetchNumberOfIssues());
    return (
        <Fragment>
            <Text>Number of issues: {numOfIssues}</Text>
        </Fragment>
    );
};

export const run = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);

const Panel = () => {
    const {platformContext: {issueKey}} = useProductContext();
    return (
        <Fragment>
            <Text>Issue key: {issueKey}</Text>
        </Fragment>
    );
}
export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
);
