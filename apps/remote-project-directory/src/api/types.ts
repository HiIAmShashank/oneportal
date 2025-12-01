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
  ProjectName?: string;
  Description?: string;
  ProjectNumber?: string;
  Project_Director?: string;
  ProjectPrincipal?: string;
  ProjectOpenOrClosed?: string;
  RegionCode?: string;
  UnitCode?: string;
  DivisionCode?: string;
  StartDate?: string;
  ActualEndDate?: string;
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

export interface OptionSetsResponse {
  divisionCode: string[];
  unitCode: string[];
  regionCode: string[];
  projectStatus: string[];
  projectOpenOrClosed: string[];
}
