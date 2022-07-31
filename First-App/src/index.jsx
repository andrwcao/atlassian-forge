import ForgeUI, { render, ProjectPage, IssuePanel, IssueGlance, IssueAction, Fragment, Text, useState, useProductContext, ModalDialog } from '@forge/ui';
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

export const glance = render(
    <IssueGlance>
        <Fragment>
            <Text>Information about this issue glance</Text>
        </Fragment>
    </IssueGlance>
);

const Action = () => {
    const [visible, setVisible] = useState(true);

    if (visible) {
        return (
            <ModalDialog closeButtonText="Perform" header="My Action" onClose={() => setVisible(false)}>
                <Text>We will peform action</Text>
            </ModalDialog>
        );
    }
    console.log('Performing action');
    return null;
}

export const action = render(
    <IssueAction>
        <Action/>
    </IssueAction>
);