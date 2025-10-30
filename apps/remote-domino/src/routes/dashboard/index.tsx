import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@one-portal/ui';
import { Activity, Clock, AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/dashboard/')({
    component: DashboardPage,
});

interface MetricCard {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const metricCards: MetricCard[] = [
    {
        title: 'Total Events Processed',
        value: 1234,
        icon: Activity,
        description: 'All time events',
    },
    {
        title: 'Pending Events',
        value: 45,
        icon: Clock,
        description: 'Awaiting processing',
    },
    {
        title: 'Failed Events',
        value: 12,
        icon: AlertCircle,
        description: 'Require attention',
    },
];

function DashboardPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {metricCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="bg-background">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {card.value.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Recent events will appear here
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            System health metrics will appear here
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
