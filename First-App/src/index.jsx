import ForgeUI, { render, AdminPage, ProjectPage, IssuePanel, IssueGlance, IssueAction, CustomField, Fragment, Text, useState, useProductContext, ModalDialog } from '@forge/ui';
import api, { route } from '@forge/api';

const fetchNumberOfIssues = async () => {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`);
    const data = await response.json();
    return data.total;
};

const App = () => {
    const context = useProductContext();
    console.log(JSON.stringify(context));
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
};

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
};

export const action = render(
    <IssueAction>
        <Action/>
    </IssueAction>
);

export const admin = render(
    <AdminPage>
        <Fragment>
            <Text>Some admin stuff here</Text>
        </Fragment>
    </AdminPage>
);

export async function trigger(event, context) {
    console.log(JSON.stringify(event));
};

const FieldData = () => {
    const { extensionContext: {fieldValue}} = useProductContext();
    
    let result = '';
    for (let i=0; i < fieldValue; i++) {
        result += '*';
    }
    return (
        <Text>{result}</Text>
    );
};

export const fieldRenderer = render(
    <CustomField>
        <FieldData />
    </CustomField>
);