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
import ow from 'ow';

import { TYPES } from '../../di/types';
import { logger } from '../../utils/logger';

import { Batch } from '../../batch/batch.service';
import { Extracted, Extractor } from '../extract.service';
import { GroupsService } from '../../groups/groups.service';
import { TypeCategory } from '../../types/constants';


@injectable()
export class GroupExtractor implements Extractor {

    @inject(TYPES.GroupsService) private groupsService: GroupsService;

    public async extract(batch: Batch): Promise<Extracted> {
        logger.debug(`GroupExtractor: extract: in:`);

        ow(batch, 'batch', ow.object.nonEmpty);
        ow(batch.category, 'batchCategory', ow.string.nonEmpty);
        ow(batch.id, 'batchId', ow.string.nonEmpty);
        ow(batch.type, 'batchType', ow.string.nonEmpty);
        ow(batch.items, 'batchType', ow.array.nonEmpty);
        ow(batch.timestamp, 'batchType', ow.number.greaterThan(0));

        const groupItemList = await this.groupsService.getBulk(batch.items);


        const extracted = {
            id: batch.id,
            category: TypeCategory.Group,
            type: batch.type,
            items: groupItemList.results,
            timestamp: batch.timestamp
        };

        logger.debug(`GroupExtractor: extract: out`);

        return extracted;
    }
}
