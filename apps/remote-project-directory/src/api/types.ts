export interface ApiUser {
  userId: number;
  username: string;
  favouriteProjects: Project[];
}

export interface Project {
  id: number;
  extractionKey: string;
  accountLeader?: string;
  accountLeaderEmail?: string;
  accountLeaderGroupNumber?: string;
  actualEndDate: string;
  amountRegistrationBlocked: string;
  approvalState: string;
  baseCurrencyCode: string;
  budgetingBlocked: string;
  caapApprovedDate?: string;
  clientName: string;
  clientNumber: string;
  contractType: string;
  countryISOCode: string;
  countryName: string;
  description: string;
  divisionCode: string;
  expectedEndDate: string;
  feeEarningDate?: string;
  grossFeeAtCAAP_GBP?: number;
  invoicingBlocked: string;
  lastEvaluationDate: string;
  levelOfControl: number;
  mainOrSubProject: string;
  masterServiceAgreementProjectNumber: string;
  opportunityNumber?: string;
  parentProjectName: string;
  parentProjectNumber: string;
  parentProjectPortfolioCode: string;
  portfolioCode: string;
  projectManager: string;
  projectManagerEmail: string;
  projectManagerGroupNumber: string;
  projectName: string;
  projectNumber: string;
  projectOpenOrClosed: string;
  projectPrincipal: string;
  projectPrincipalEmail?: string;
  projectPrincipalGroupNumber: string;
  projectSafetyAdivisor: string;
  projectSafetyAdivisorGroupNumber: string;
  projectSharepointSite_url: string;
  projectSharepointSite_source?: string;
  projectStatus: string;
  projectSustainabilityConsultant: string;
  projectSustainabilityConsultantGroupNumber: string;
  projectType: string;
  regionCode: string;
  riskProfile?: string;
  sourceSystem: string;
  startDate: string;
  timeRegistrationBlocked: string;
  unitCode: string;
  wonOrLost: string;
  project_Director?: string;
  isFavourite: boolean;
}

export interface GetProjectsRequest {
  UserId: number;
  Title?: string;
  Description?: string;
  ProjectCode?: number;
  ProjectDirector?: string;
  ProjectManager?: string;
  ProjectStatus?: string;
  Region?: string;
  Unit?: string;
  Division?: string;
  ProjectStartDate?: string;
  ProjectEndDate?: string;
  LimitCount: number;
  LastId?: number | null;
}

export interface GetProjectsResponse {
  projects: Project[];
  count: number;
}

export interface UpdateFavouriteRequest {
  UserId: number;
  ProjectId: number;
  UpdateType: 0 | 1; // 0 = Add, 1 = Remove
}
