import { SetMetadata } from '@nestjs/common';

export const RESPONSE_FORMATTER_FIELDS = 'responseFormatterFields';

/**
 * @param removeKeys : list of fields to remove for this endpoint
 */
export const ResponseFormatter = (removeKeys: string[] = []) =>
  SetMetadata(RESPONSE_FORMATTER_FIELDS, removeKeys);