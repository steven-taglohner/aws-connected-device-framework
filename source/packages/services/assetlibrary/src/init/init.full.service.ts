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
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { logger } from '../utils/logger';
import { TypesService } from '../types/types.service';
import { TypeCategory } from '../types/constants';
import { InitDaoFull } from './init.full.dao';
import { TypeDefinitionModel } from '../types/types.models';
import { InitService } from './init.service';

@injectable()
export class InitServiceFull implements InitService {

    constructor( @inject(TYPES.InitDao) private initDao: InitDaoFull,
        @inject(TYPES.TypesService) private typesService: TypesService) {}

    public async init(): Promise<void> {
        logger.debug('init.service init: in:');

        const initialized  = await this.initDao.isInitialized();
        if (initialized) {

            await this.initDao.applyFixes();

            logger.debug(`init.service exit: already initialized!`);
            throw new Error ('ALREADY_INITIALIZED');
        } else {

            // seed the database with the type categories
            await this.initDao.initialize();

            // create the root group type definition
            const definition:TypeDefinitionModel= {
                properties: {}
            }
            await this.typesService.create('root', TypeCategory.Group, definition);
            await this.typesService.publish('root', TypeCategory.Group);

        }

    }

}
