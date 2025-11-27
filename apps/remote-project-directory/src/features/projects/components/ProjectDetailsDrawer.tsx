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
import { UserAvatar } from "../../../components/UserAvatar";

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

const PersonDetail = ({
  name,
  email,
  groupNumber,
}: {
  name?: string;
  email?: string;
  groupNumber?: string;
}) => {
  if (!name) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex items-start gap-3 pt-1">
      <UserAvatar name={name} email={email} className="mt-0.5" />
      <div className="flex flex-col min-w-0 overflow-hidden">
        <div
          className="font-medium text-sm truncate leading-none mb-1"
          title={name}
        >
          {name}
        </div>
        {email && (
          <div
            className="text-xs text-muted-foreground truncate leading-tight"
            title={email}
          >
            {email}
          </div>
        )}
        {groupNumber && (
          <div className="text-xs text-muted-foreground/80 truncate mt-0.5">
            Group: {groupNumber}
          </div>
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
    <div className="grid grid-cols-2 gap-x-4 gap-y-6">{children}</div>
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
        <SheetHeader className="p-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{project.projectName}</SheetTitle>
            </div>
          </div>
          <SheetDescription className="line-clamp-2">
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
              <DetailItem
                label="Opportunity Number"
                value={project.opportunityNumber}
              />
              <DetailItem
                label="MSA Project Number"
                value={project.masterServiceAgreementProjectNumber}
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

            <DetailSection title="Key People">
              <DetailItem label="Account Leader">
                <PersonDetail
                  name={project.accountLeader}
                  email={project.accountLeaderEmail}
                  groupNumber={project.accountLeaderGroupNumber}
                />
              </DetailItem>
              <DetailItem label="Project Manager">
                <PersonDetail
                  name={project.projectManager}
                  email={project.projectManagerEmail}
                  groupNumber={project.projectManagerGroupNumber}
                />
              </DetailItem>
              <DetailItem label="Project Principal">
                <PersonDetail
                  name={project.projectPrincipal}
                  email={project.projectPrincipalEmail}
                  groupNumber={project.projectPrincipalGroupNumber}
                />
              </DetailItem>
              <DetailItem label="Project Director">
                <PersonDetail name={project.project_Director} />
              </DetailItem>
              <DetailItem label="Safety Advisor">
                <PersonDetail
                  name={project.projectSafetyAdivisor}
                  groupNumber={project.projectSafetyAdivisorGroupNumber}
                />
              </DetailItem>
              <DetailItem label="Sustainability Consultant">
                <PersonDetail
                  name={project.projectSustainabilityConsultant}
                  groupNumber={
                    project.projectSustainabilityConsultantGroupNumber
                  }
                />
              </DetailItem>
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
              <DetailItem
                label="Parent Portfolio"
                value={project.parentProjectPortfolioCode}
              />
              <DetailItem label="Portfolio" value={project.portfolioCode} />
              <DetailItem label="Source" value={project.sourceSystem} />
              <DetailItem label="SharePoint" fullWidth>
                <div className="flex flex-col gap-2">
                  <LinkCell
                    url={project.projectSharepointSite_url}
                    label="Open Site"
                    icon={SharePointIcon}
                  />
                </div>
              </DetailItem>
            </DetailSection>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
