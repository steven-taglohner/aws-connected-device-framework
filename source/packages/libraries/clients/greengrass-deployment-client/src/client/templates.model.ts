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
export interface DeploymentSource {
	type: DeploymentSourceType;
	bucket: string;
	prefix: string;
}

export enum DeploymentSourceType {
	S3='s3',
}

export enum DeploymentTemplateType {
	AGENTLESS='agentless',
	AGENTBASED='agentbased',
}

export class DeploymentTemplate {
	createdAt?: Date;
	description: string;
	enabled?: boolean;
	envVars?: string[];
	name: string;
	options?: string[];
	source: DeploymentSource;
	type: DeploymentTemplateType;
	updatedAt?: Date;
	versionNo?: number;
}

export class DeploymentTemplateList {
	templates: DeploymentTemplate[] = [];
	pagination?: {
		offset:number|string;
		count: number;
	};
}
