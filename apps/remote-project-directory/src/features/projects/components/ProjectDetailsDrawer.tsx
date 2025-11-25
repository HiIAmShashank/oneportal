import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Separator,
} from "@one-portal/ui";
import { type Project } from "../../../api/types";
import { CopyableCell } from "./CopyableCell";
import { LinkCell } from "./LinkCell";
import { SharePointIcon } from "./SharePointIcon";

interface ProjectDetailsDrawerProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailItem = ({
  label,
  value,
  fullWidth = false,
  children,
}: {
  label: string;
  value?: string | number | undefined | null;
  fullWidth?: boolean;
  children?: React.ReactNode;
}) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  if (!hasValue && !children) return null;

  return (
    <div className={`flex flex-col space-y-1 ${fullWidth ? "col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="text-sm font-medium text-foreground">
        {children ? (
          children
        ) : (
          <CopyableCell value={value} className="w-full" />
        )}
      </div>
    </div>
  );
};

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
      {title}
      <Separator className="flex-1" />
    </h4>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

export function ProjectDetailsDrawer({
  project,
  open,
  onOpenChange,
}: ProjectDetailsDrawerProps) {
  if (!project) return null;

  // Helper for dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
      dateStyle: "medium",
    });
  };

  // Helper for currency
  const formatCurrency = (amount?: number, currency = "GBP") => {
    if (amount === undefined || amount === null) return null;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col gap-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{project.projectName}</SheetTitle>
            </div>
          </div>
          <SheetDescription className="line-clamp-2 mt-2">
            {project.description || "No description available."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <DetailSection title="Project Identification">
              <DetailItem
                label="Project Number"
                value={project.projectNumber}
              />
              <DetailItem label="Status" value={project.projectStatus} />
            </DetailSection>

            <DetailSection title="General Information">
              <DetailItem label="Client" value={project.clientName} />
              <DetailItem label="Client Number" value={project.clientNumber} />
              <DetailItem label="Type" value={project.projectType} />
              <DetailItem label="Contract" value={project.contractType} />
              <DetailItem label="Main/Sub" value={project.mainOrSubProject} />
              <DetailItem label="Approval" value={project.approvalState} />
              <DetailItem
                label="Status"
                value={`${project.projectOpenOrClosed} / ${project.wonOrLost}`}
              />
            </DetailSection>

            <DetailSection title="Organization & Location">
              <DetailItem label="Unit" value={project.unitCode} />
              <DetailItem label="Division" value={project.divisionCode} />
              <DetailItem label="Region" value={project.regionCode} />
              <DetailItem
                label="Country"
                value={`${project.countryName} (${project.countryISOCode})`}
              />
            </DetailSection>

            <DetailSection title="Timeline">
              <DetailItem
                label="Start Date"
                value={formatDate(project.startDate)}
              />
              <DetailItem
                label="Expected End"
                value={formatDate(project.expectedEndDate)}
              />
              <DetailItem
                label="Actual End"
                value={formatDate(project.actualEndDate)}
              />
              <DetailItem
                label="Fee Earning"
                value={formatDate(project.feeEarningDate)}
              />
              <DetailItem
                label="CAAP Approved"
                value={formatDate(project.caapApprovedDate)}
              />
              <DetailItem
                label="Last Eval"
                value={formatDate(project.lastEvaluationDate)}
              />
            </DetailSection>

            <DetailSection title="Financials & Controls">
              <DetailItem label="Currency" value={project.baseCurrencyCode} />
              <DetailItem
                label="Gross Fee (GBP)"
                value={formatCurrency(project.grossFeeAtCAAP_GBP)}
              />
              <DetailItem label="Risk Profile" value={project.riskProfile} />
              <DetailItem
                label="Level of Control"
                value={project.levelOfControl}
              />
              <DetailItem
                label="Blocked"
                value={[
                  project.budgetingBlocked === "Yes" && "Budget",
                  project.invoicingBlocked === "Yes" && "Invoicing",
                  project.timeRegistrationBlocked === "Yes" && "Time",
                  project.amountRegistrationBlocked === "Yes" && "Amount",
                ]
                  .filter(Boolean)
                  .join(", ")}
                fullWidth
              />
            </DetailSection>

            <DetailSection title="Key People">
              <DetailItem
                label="Project Manager"
                value={project.projectManager}
              />
              <DetailItem
                label="Account Leader"
                value={project.accountLeader}
              />
              <DetailItem
                label="Project Principal"
                value={project.projectPrincipal}
              />
              <DetailItem
                label="Project Director"
                value={project.project_Director}
              />
              <DetailItem
                label="Safety Advisor"
                value={project.projectSafetyAdivisor}
              />
              <DetailItem
                label="Sustainability"
                value={project.projectSustainabilityConsultant}
              />
            </DetailSection>

            <DetailSection title="Hierarchy & Systems">
              <DetailItem
                label="Parent Project"
                value={project.parentProjectName}
                fullWidth
              />
              <DetailItem
                label="Parent Number"
                value={project.parentProjectNumber}
              />
              <DetailItem label="Portfolio" value={project.portfolioCode} />
              <DetailItem label="Source" value={project.sourceSystem} />
              <DetailItem label="SharePoint" fullWidth>
                <LinkCell
                  url={project.projectSharepointSite_url}
                  label="Open Site"
                  icon={SharePointIcon}
                />
              </DetailItem>
            </DetailSection>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
