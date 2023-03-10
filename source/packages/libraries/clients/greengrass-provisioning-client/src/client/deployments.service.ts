/*********************************************************************************************************************
 *  Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
import {PathHelper} from '../utils/path.helper';
import {ClientServiceBase} from './common.service';
import {injectable} from 'inversify';
import { Deployment, DeploymentTaskSummary } from './deployments.model';
import { RequestHeaders } from './common.model';

export interface DeploymentsService {

    createDeploymentTask(deployments:Deployment[], additionalHeaders?:RequestHeaders) : Promise<DeploymentTaskSummary>;

    getDeploymentTask(deploymentId:string, additionalHeaders?:RequestHeaders) : Promise<DeploymentTaskSummary>;

}

@injectable()
export class DeploymentsServiceBase extends ClientServiceBase {

    constructor() {
        super();
    }

    protected deploymentsRelativeUrl() : string {
        return '/deploymentTasks';
    }

    protected deploymentsByIdRelativeUrl(taskId: string) : string {
        return PathHelper.encodeUrl('deploymentTasks', taskId);
    }

}
