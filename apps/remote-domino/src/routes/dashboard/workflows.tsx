import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@one-portal/ui';

export const Route = createFileRoute('/dashboard/workflows')({
    component: WorkflowsPage,
});

function WorkflowsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            </div>

            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Workflow Management</CardTitle>
                    <CardDescription>
                        Design and manage workflows
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Workflow builder and management interface will be implemented here
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
