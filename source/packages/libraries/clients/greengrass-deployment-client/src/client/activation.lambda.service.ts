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

import ow from 'ow';
import { injectable, inject } from 'inversify';
import { LambdaInvokerService, LAMBDAINVOKE_TYPES, LambdaApiGatewayEventBuilder } from '@cdf/lambda-invoke';

import {ActivationService, ActivationServiceBase} from './activation.service';
import {ActivationResponse} from './activation.model';
import {RequestHeaders} from './common.model';


@injectable()
export class ActivationLambdaService extends ActivationServiceBase implements ActivationService {
    constructor(
        @inject(LAMBDAINVOKE_TYPES.LambdaInvokerService) private lambdaInvoker: LambdaInvokerService,
        @inject('greengrassDeployment.apiFunctionName') private functionName : string
    ) {
        super();
        this.lambdaInvoker = lambdaInvoker;
    }

    public async createActivation(deviceId: string, additionalHeaders?:RequestHeaders): Promise<ActivationResponse> {
        ow(deviceId, ow.string.nonEmpty);

        const requestBody = {
            deviceId
        }

        const event = new LambdaApiGatewayEventBuilder()
            .setPath(super.activationsRelativeUrl(deviceId))
            .setPath('POST')
            .setHeaders(super.buildHeaders(additionalHeaders))
            .setBody(requestBody)

        const res = await this.lambdaInvoker.invoke(this.functionName, event);
        return res.body;
    }

    public async getActivation(activationId: string, deviceId: string, additionalHeaders?:RequestHeaders): Promise<ActivationResponse> {
        ow(deviceId, ow.string.nonEmpty);
        ow(activationId, ow.string.nonEmpty);

        const event = new LambdaApiGatewayEventBuilder()
            .setPath(super.activationsByIdRelativeUrl(activationId, deviceId))
            .setMethod('GET')
            .setHeaders(super.buildHeaders(additionalHeaders));

        const res = await this.lambdaInvoker.invoke(this.functionName, event);
        return res.body;
    }

    public async deleteActivation(activationId: string, deviceId: string, additionalHeaders?:RequestHeaders): Promise<void> {
        ow(deviceId, ow.string.nonEmpty);
        ow(activationId, ow.string.nonEmpty);

        const event = new LambdaApiGatewayEventBuilder()
            .setPath(super.activationsByIdRelativeUrl(activationId, deviceId))
            .setMethod('DELETE')
            .setHeaders(super.buildHeaders(additionalHeaders));

        await this.lambdaInvoker.invoke(this.functionName, event);
    }
}
