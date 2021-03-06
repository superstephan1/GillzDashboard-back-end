import {Injectable} from '@nestjs/common';
import * as azdev from 'azure-devops-node-api';
import * as co from 'azure-devops-node-api/CoreApi';
import * as ci from 'azure-devops-node-api/interfaces/CoreInterfaces';
import * as ta from 'azure-devops-node-api/TaskAgentApi';
import {Cron, CronExpression} from '@nestjs/schedule';
import {TaskAgentJobRequest} from 'azure-devops-node-api/interfaces/TaskAgentInterfaces';

export let agentRequests: TaskAgentJobRequest[] = [];
export let projectsResult: TeamProjectWithImage[] = [];

@Injectable()
export class DevopsService {
    @Cron(CronExpression.EVERY_30_SECONDS)
    async getDevopsProjects() {
        const orgUrl = process.env.DEVOPS_ORGANISATION_URL;
        const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
        const authHandler = azdev.getPersonalAccessTokenHandler(token);
        const connection = new azdev.WebApi(orgUrl, authHandler);
        const core: co.ICoreApi = await connection.getCoreApi();
        const projects = await core.getProjects(undefined, undefined, undefined, undefined, true);
        const newArray: TeamProjectWithImage[] = [];
        for (const project of projects) {
            newArray.push({
                ...await core.getProject(project.id),
                defaultTeamImageUrl: project.defaultTeamImageUrl
            });
        }
        // return newArray;
        projectsResult = newArray;
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async getDevopsAgentRequests() {
        const orgUrl = process.env.DEVOPS_ORGANISATION_URL;
        const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
        const authHandler = azdev.getPersonalAccessTokenHandler(token);
        const connection = new azdev.WebApi(orgUrl, authHandler);
        const taskAgent: ta.ITaskAgentApi = await connection.getTaskAgentApi();
        agentRequests = await taskAgent.getAgentRequests(9, 50);
    }
}

export interface TeamProjectWithImage extends ci.TeamProject {
    defaultTeamImageUrl: string;
}


